import { auth } from "@/app/(auth)/auth";
import { useUserSafe } from "@/app/(auth)/hooks/useUserSafe";
import { redirect } from "next/navigation";

export async function requireVerifiedEmail() {
  const session = await auth();
  const {userProfile} = useUserSafe();
  
  if (!session?.user) {
    redirect('/login');
  }
  
  if (!userProfile?.emailVerified) {
    redirect('/?verification=required');
  }
  
  return session;
}
