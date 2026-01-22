import { EditDailog } from "@/components/edit-todo"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { deleteTodo, toggleTodo } from "@/server/todo"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import React from "react"
import { toast } from "sonner"
import { TodoProps } from "./todo-client"

export default function TodoList({ todo }: { todo: TodoProps }) {
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
                if (!currentStatus) {
                    toast.success("Todo checked / completed");
                } else {
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
        } finally {
            setIsLoading((prev) => ({ ...prev, [todoId]: false }));
        }
    }

    const handleDeleteTodo = async (todoId: string) => {
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
            <span className={cn(value && "line-through text-muted-foreground")}>{todo.title}</span>
            {isHovered[todo.id] && (
                <div className='ml-auto'>
                    <EditDailog todo={todo} />
                    <button onClick={() => handleDeleteTodo(todo.id)} className='text-destructive cursor-pointer'>
                        <Trash2 size={16} />
                    </button>
                </div>
            )}
        </div>
    )
}