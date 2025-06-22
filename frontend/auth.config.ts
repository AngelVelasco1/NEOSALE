import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
     Credentials({ 
      authorize: async (credentials) => {
        console.log({credentials});
        if (credentials.email !== "emailprueba@gmail.com") {
          throw new Error("Invalid credentials.")
        }
         return {
            id: "1",
            email: "emailprueba@gmail.com",
            password: "hola454545"
          
        }
      },
    }),
  ],
} satisfies NextAuthConfig