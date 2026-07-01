import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function DashboardRedirect() {
  const session = await auth();
  if (!session) redirect("/login");

  if (session.user.type === "admin") redirect("/admin");
  if (session.user.type === "contributeur") redirect("/dashboard/contributeur");
  redirect("/dashboard/cotisant");
}
