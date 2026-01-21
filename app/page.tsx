import { ModeSwitcher } from "@/components/mode-switcher";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home(){
  return (
    <main className="flex min-h-screen items-center justify-center gap-3">
      <Button variant={"ghost"} asChild>
        <Link href="/login">
          Login
        </Link>
        </Button>
        <Button asChild>
        <Link href="/signup">
          SignUp
        </Link>
        </Button>
        <ModeSwitcher/>
    </main>
  )
}