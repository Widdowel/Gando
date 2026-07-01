import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-neutral-900">Connexion</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Pas encore de compte ?{" "}
        <a href="/register" className="font-medium text-amber-800 hover:underline">
          Inscrivez-vous
        </a>
      </p>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          Email ou mot de passe incorrect.
        </p>
      )}

      <form action={login} className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700">Email</label>
          <input
            type="email"
            name="email"
            required
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700">Mot de passe</label>
          <input
            type="password"
            name="password"
            required
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-amber-800 px-4 py-3 font-medium text-white hover:bg-amber-900"
        >
          Se connecter
        </button>
      </form>
    </div>
  );
}
