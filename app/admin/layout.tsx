import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const LIENS = [
  { href: "/admin", label: "Vue d'ensemble" },
  { href: "/admin/residences", label: "Résidences" },
  { href: "/admin/cagnottes", label: "Cagnottes" },
  { href: "/admin/revenus", label: "Revenus locatifs" },
  { href: "/admin/gadgets", label: "Gadgets" },
  { href: "/admin/chantier", label: "Chantiers" },
  { href: "/admin/kyc", label: "KYC utilisateurs" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect("/login");
  if (session.user.type !== "admin") redirect("/dashboard");

  return (
    <div className="mx-auto flex max-w-6xl gap-8 px-4 py-12">
      <aside className="w-56 flex-shrink-0">
        <nav className="space-y-1">
          {LIENS.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              className="block rounded-md px-3 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-100"
            >
              {lien.label}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
