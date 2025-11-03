import { auth } from "@/app/(auth)/auth";

/**
 * getUser - Function to retrieve user information from NextAuth session.
 * @returns A Promise that resolves to the user data from the session.
 */
export async function getUser() {
  const session = await auth();
  
  // Return the user data from the NextAuth session
  return session?.user ?? null;
}
