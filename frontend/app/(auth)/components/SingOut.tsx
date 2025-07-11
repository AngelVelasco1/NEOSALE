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
  return <Button onClick={() => handleSignOut()} 
  className=" absolute top-4 right-4 w-fit h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0 text-white shadow-lg transition-all duration-200"> <LogOut className="h-5 w-5"/>Cerrar Sesion</Button>
} 