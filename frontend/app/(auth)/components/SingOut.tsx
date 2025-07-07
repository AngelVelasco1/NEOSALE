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
  return <Button onClick={() => handleSignOut()} variant="destructive" 
  className="w-fit h-10 text-red-600 hover:text-red-700 
  hover:bg-red-100 font-medium  rounded-lg transition-colors group text-md"> <LogOut className="w-4 h-4 mr-2 "/>Cerrar Sesion</Button>
} 