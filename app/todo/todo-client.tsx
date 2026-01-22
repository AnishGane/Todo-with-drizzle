'use client'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { CheckCheck } from 'lucide-react'
import { AddDialog } from '@/components/add-todo'
import { ScrollArea } from "@/components/ui/scroll-area"

import SearchTodo from '@/components/search-todo'
import { useQueryState } from 'nuqs'
import TodoList from './todo-list'
import LogoutButton from '@/components/logout-button'

export type TodoProps = {
  id: string
  title: string
  createdAt: Date
  completed: boolean
}

export default function TodoClient({ todos }: { todos: TodoProps[] }) {

  const [search] = useQueryState("search", { defaultValue: "" });
  const query = search.toLowerCase();

  const filteredTodo = todos.filter((todo) => todo.title.toLowerCase().includes(query));

  return (
    <section className="flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-xl min-h-96">
        <div className="space-y-3">
          <CardHeader className=" flex justify-between items-center">
            <CardTitle className='flex gap-1'>
              <CheckCheck size={18} className='text-emerald-400' />
              TODO
            </CardTitle>

            <div className="flex items-center gap-2">
              <LogoutButton/>
              <AddDialog />
            </div>
          </CardHeader>
          <SearchTodo />
        </div>
        <CardContent>
          <ScrollArea className="h-[240px] rounded-md p-2 border">
            {filteredTodo.length === 0 ? (
              <p className="text-center text-muted-foreground py-6">
                Add todo first
              </p>
            ) : (
              filteredTodo.map((todo) => (
                <TodoList key={todo.id} todo={todo} />
              ))
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </section>
  )
}


