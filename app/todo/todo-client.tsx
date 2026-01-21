'use client'

import React from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'

import { cn } from '@/lib/utils'
import { CheckCheck, Plus } from 'lucide-react'
import { DialogDemo } from '@/components/add-todo'
import { toast } from 'sonner'
import { toggleTodo } from '@/server/todo'
import { ScrollArea } from "@/components/ui/scroll-area"

type TodoProps = {
  id: string
  title: string
  createdAt: Date
  completed: boolean
}

export default function TodoClient({ todos }: {todos: TodoProps[]}) {
    // Note:
    // Why not useState<boolean>(true)?
    // - const [checked, setChecked] = useState(true)
    // Problem: ❌ One boolean state(checked) controls all checkboxes
    // If you check one todo → every todo changes, to prevent it we uses Record<Key: string, Value: boolean> - dictionary/map type
  const [checked, setChecked] = React.useState<Record<string, boolean>>({})
  const [isLoading, setIsLoading] = React.useState<Record<string, boolean>>({})

  const handleCheckedTodo = async (todoId: string, currentStatus: boolean) => {

    setChecked((prev) => ({ ...prev, [todoId]: !currentStatus }))
    setIsLoading((prev) => ({ ...prev, [todoId]: true }));

    try {
      const result = await toggleTodo(todoId, !currentStatus);
      if (result.success) {
        if(!currentStatus){
          toast.success("Todo checked / completed");
        }else{
          toast.success("Todo unchecked / incomplete");
        }
      } else {
        // Revert if failed
        setChecked((prev) => ({ ...prev, [todoId]: currentStatus }));
        toast.error(result.message)
      }
    } catch (error) {
      const e = error as Error;
      toast.error(e.message)
      // Revert on error
      setChecked((prev) => ({ ...prev, [todoId]: currentStatus }));
    }finally{
      setIsLoading((prev) => ({ ...prev, [todoId]: false }));
    }
  }

  return (
    <section className="flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-xl min-h-80">
        <div className="space-y-3">

        <CardHeader className=" flex justify-between items-center">
          <CardTitle className='flex gap-1'>
            <CheckCheck size={18} className='text-emerald-400'/>
            TODO
          </CardTitle>

       <DialogDemo/>
        </CardHeader>

        <CardContent>
          <Input placeholder="Search your todos" />
        </CardContent>
        </div>


            <CardContent>
                <ScrollArea className="h-[200px] rounded-md p-2 border">
                {todos.map((todo) => {
                  const value = checked[todo.id] ?? todo.completed;

                  return (
                    <div
                      key={todo.id}
                      className="flex bg-muted p-3 mb-1 rounded-md items-center gap-2"
                    >
                      <Checkbox
                        checked={value}
                        disabled={!!isLoading[todo.id]}
                        onCheckedChange={() => handleCheckedTodo(todo.id, value)}
                      />
                      <span className={cn(value && "line-through")}>{todo.title}</span>
                    </div>
                  );
                })}
          </ScrollArea>
            </CardContent>
            
        </Card>
    </section>
  )
}


