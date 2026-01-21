"use client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
 
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { useForm } from "react-hook-form"
import { FieldDescription, FieldGroup, FieldLabel } from "../ui/field"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import React from "react"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { signInUser } from "@/server/users"
 
const formSchema = z.object({
  email: z.email(),
  password: z.string().min(6),
})

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })
  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      const res = await signInUser(values.email, values.password);
      if(!res) return;
      if(res.success){
        toast.success(res.message);
        router.push("/todo");
      }
    } catch (error) {
      const e = error as Error;
      toast.error("Error in Signing user" || e.message);
    }finally{
      setIsLoading(false);
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
        <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email here" {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="******" {...field} />
              </FormControl>
             
              <FormMessage />
            </FormItem>
          )}
        />
       <Button type="submit" className="w-full">
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ):(
            "Login"
          )}
        </Button>
        <FieldGroup>
          <FieldDescription>Don't have an account?{" "}
            <Link href="/signup">SignUp</Link>
          </FieldDescription>
        </FieldGroup>
      </form>
    </Form>
        </CardContent>
      </Card>
    </div>
  )
}
