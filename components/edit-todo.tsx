"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Loader2, Pen, Plus } from "lucide-react"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { updateTodo } from "@/server/todo"
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { TodoProps } from "@/app/todo/todo-client"

const formSchema = z.object({
    title: z.string().min(5).max(30),
})

export function EditDailog({ todo }: { todo: TodoProps }) {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: todo.title,
        },
    })
    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);

            const userId = (await authClient.getSession()).data?.user.id;

            if (!userId) {
                toast.error("You must be logged in to create a todo");
                return;
            }

            const response = await updateTodo(todo.id, {
                ...values,
                userId,
            });

            if (response.success) {
                form.reset();
                toast.success(response.message || "Todo created successfully");
                router.refresh();
                setIsOpen(false);
            } else {
                toast.error(response.message);
            }
        } catch (error) {
            toast.error((error as Error).message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <button className="cursor-pointer mr-2">
                    <Pen className='size-4' />
                </button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit this Todo</DialogTitle>
                    <DialogDescription>
                        Edit the title of your todo
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Title</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <DialogClose asChild>
                                <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button type="submit">
                                {isLoading ? (
                                    <Loader2 className="size-4 animate-spin" />
                                ) : (
                                    <Plus className='size-4' />
                                )}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>

        </Dialog>
    )
}
