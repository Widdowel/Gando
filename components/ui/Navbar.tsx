import Link from "next/link";
import { auth, signOut } from "@/lib/auth";

export default async function Navbar() {
  const session = await auth();

  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-lg font-bold tracking-tight text-amber-800">
          Terre Royal Mutuelle
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-neutral-700">
          <Link href="/cagnottes" className="hover:text-amber-800">
            Cagnottes
          </Link>
          <Link href="/gadgets" className="hover:text-amber-800">
            Gadgets
          </Link>
          {session ? (
            <>
              <Link href="/dashboard" className="hover:text-amber-800">
                Mon espace
              </Link>
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button type="submit" className="hover:text-amber-800">
                  Déconnexion
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-amber-800">
                Connexion
              </Link>
              <Link
                href="/register"
                className="rounded-md bg-amber-800 px-4 py-2 text-white hover:bg-amber-900"
              >
                S&apos;inscrire
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
