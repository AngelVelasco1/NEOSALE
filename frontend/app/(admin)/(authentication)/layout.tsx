import { cookies } from "next/headers";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Access cookies to make this route dynamic
  // This prevents static prerendering of auth pages
  const cookieStore = await cookies();
  cookieStore.getAll();

  return <main>{children}</main>;
}
