"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"


export const SignOut  = () => {
    const handleSignOut = async() => {
        await signOut ({
          redirectTo: "/login"
     })

    }
  return <Button className="border-none shadow-none w-fit " onClick={() => handleSignOut()}><LogOut className="h-5 w-5"/>Cerrar Sesion</Button>
} 