"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { toast } from "sonner"
import { signOutUser } from "@/server/users"

export default function LogoutButton() {
  const handleLogout = async () => {
    try {
      const res = await signOutUser()
      toast.success("Logout successful")
      window.location.replace("/")
    } catch {
      toast.error("Logout failed")
    }
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      <LogOut size={18} />
    </Button>
  )
}
