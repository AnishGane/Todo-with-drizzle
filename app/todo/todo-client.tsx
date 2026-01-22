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
import { CheckCheck, Pen, Plus, Trash2 } from 'lucide-react'
import { AddDialog } from '@/components/add-todo'
import { toast } from 'sonner'
import { deleteTodo, toggleTodo } from '@/server/todo'
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRouter } from 'next/navigation'
import { EditDailog } from '@/components/edit-todo'

export type TodoProps = {
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
  const [isHovered, setIsHovered] = React.useState<Record<string, boolean>>({});
  const router = useRouter();

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

  const handleDeleteTodo = async (todoId : string)=>{
    try {
      const result = await deleteTodo(todoId);
      if (result.success) {
        toast.success("Todo deleted successfully");
        router.refresh();
      } else {
        toast.error(result.message)
      }
    } catch (error) {
      const e = error as Error;
      toast.error(e.message)
    }
  }

  return (
    <section className="flex min-h-svh w-full flex-col items-center justify-center p-6 md:p-10">
      <Card className="w-full max-w-xl min-h-96">
        <div className="space-y-3">

        <CardHeader className=" flex justify-between items-center">
          <CardTitle className='flex gap-1'>
            <CheckCheck size={18} className='text-emerald-400'/>
            TODO
          </CardTitle>

        <AddDialog/>
        </CardHeader>

        <CardContent>
          <Input placeholder="Search your todos" />
        </CardContent>
        </div>


            <CardContent>
                <ScrollArea className="h-[240px] rounded-md p-2 border">
                {todos.map((todo) => {
                  const value = checked[todo.id] ?? todo.completed;

                  return (
                    <div
                    onMouseEnter={() => setIsHovered((prev) => ({ ...prev, [todo.id]: true }))}
                    onMouseLeave={() => setIsHovered((prev) => ({ ...prev, [todo.id]: false }))}
                      key={todo.id}
                      className="flex bg-muted p-3 mb-1 rounded-md items-center gap-2"
                    >
                      <Checkbox
                        checked={value}
                        disabled={!!isLoading[todo.id]}
                        onCheckedChange={() => handleCheckedTodo(todo.id, value)}
                      />
                      <span className={cn(value && "line-through")}>{todo.title}</span>
                      {isHovered[todo.id] && (
                        <div className='ml-auto'>
                            <EditDailog todo={todo}/>
                          <button onClick={()=>handleDeleteTodo(todo.id)} className='text-destructive cursor-pointer'>
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
          </ScrollArea>
            </CardContent>
            
        </Card>
    </section>
  )
}


