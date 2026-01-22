"use server"

import { db } from "@/db/drizzle";
import { NewTodo, todo } from "@/db/schema";
import { auth } from "@/lib/auth";
import { eq, desc, and  } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {headers} from "next/headers";
import { randomUUID } from "crypto";
import { requireAuth } from "@/lib/get-session";

export const getTodo = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });

        const userId = session?.user?.id;

        if (!userId) {
            return {
                success: false,
                message: "User not found",
            }
        }

        const userTodos = await db.query.todo.findMany({
            where: eq(todo.userId, userId),
            orderBy: [desc(todo.createdAt)],
        });

        return {
            success: true,
            data: userTodos,
        }
    } catch (error) {
        const e = error as Error;
        return {
            success: false,
            message: e.message || "Error getting todo",
        }
    }
}

export const toggleTodo = async (todoId: string, completed: boolean)=>{
    try {
        await db.update(todo).set({
            completed,
            updatedAt: new Date()
        }).where(eq(todo.id, todoId))

        return {
            success: true,
            message: "Todo is completed",
          };
    } catch (error) {
        const e = error as Error;
    return {
      success: false,
      message: e.message || "Error updating todo",
    };
  }
}


export const createTodo = async (values: Pick<NewTodo, "title">) => {
  try {
    const session = await requireAuth();

    const userId = session.user.id;

    const todoData: NewTodo = {
      id: randomUUID(),
      title: values.title,
      userId,
      completed: false,
      createdAt: new Date(),
    };

    await db.insert(todo).values(todoData);

    revalidatePath("/todo");

    return {
      success: true,
      message: "Todo created successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    };
  }
};


export const deleteTodo = async (todoId: string)=>{
  try {
    const session = await requireAuth();
    const userId = session.user.id;
    
    await db.delete(todo).where(and(eq(todo.id, todoId), eq(todo.userId, userId)));

    return {
      success: true,
      message: "Todo deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    }
  }
}

export const updateTodo = async (todoId: string, values: Pick<NewTodo, "title" | "completed">) => {
  try {
    const session = await requireAuth();
    const userId = session.user.id;
  
    const result = await db.update(todo).set({
      title: values.title,
      completed: values.completed,
      updatedAt: new Date()
    }).where(and(eq(todo.id, todoId), eq(todo.userId, userId)));

    if (result.rowCount === 0) {
      return {
        success: false,
        message: "Todo not found or not authorized",
      };
    }

    return {
      success: true,
      message: "Todo updated successfully",
    }
  } catch (error) {
    return {
      success: false,
      message: (error as Error).message,
    }
  }
}
