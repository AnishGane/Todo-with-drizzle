import { getTodo } from "@/server/todo";
import TodoClient from "./todo-client";
import { requireAuth } from "@/lib/get-session";
import { redirect } from "next/navigation";

type TodoUI = Omit<
  NonNullable<Awaited<ReturnType<typeof getTodo>>["data"]>[number],
  "userId" | "updatedAt"
>;

export default async function TodoServer() {
  const session = await requireAuth();

  if (!session) {
    redirect("/login");
  }

  const todos = await getTodo();

  const uiTodos: TodoUI[] =
    todos?.data?.map(({ userId, updatedAt, ...rest }) => rest) ?? [];

  return <TodoClient todos={uiTodos}  />
}
