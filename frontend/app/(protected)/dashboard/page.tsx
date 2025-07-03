import { SignOut } from "@/app/(auth)/components/SingOut"
import { auth } from "@/auth"

export default async function Dashboard() {
  const session = await auth()
 
  if (!session) {
    return <div>You must be authenticated</div>
  }
  if (session?.user?.role !== 'admin') {
    return <div>You must be admin</div>
  }
 
  return (
    <div className="container">
      <pre>{JSON.stringify(session, null, 2)}</pre>
      <SignOut />
    </div>
  )
}