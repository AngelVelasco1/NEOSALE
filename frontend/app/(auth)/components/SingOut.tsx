"use client"

import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export const SignOut  = () => {
    const handleSignOut = async() => {
        await signOut ({
          redirectTo: "/login"
     })

    }
  return <Button onClick={() => handleSignOut()}>Sign Out</Button>
} 