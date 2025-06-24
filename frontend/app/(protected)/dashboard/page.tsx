import { SignOut } from "@/app/(auth)/components/SingOut"
import { auth } from "@/auth"

export default async function Dashboard() {
  const session = await auth()
 
  if (!session) {
    return <div>Not authenticated</div>
  }
 
  return (
    <div className="container">
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <SignOut />
    </div>
  )
}