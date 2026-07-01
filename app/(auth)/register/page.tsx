import { register } from "./actions";

const ERREURS: Record<string, string> = {
  invalide: "Merci de vérifier les informations saisies.",
  existe: "Un compte existe déjà avec cet email.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-2xl font-bold text-neutral-900">Créer un compte</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Déjà inscrit ?{" "}
        <a href="/login" className="font-medium text-amber-800 hover:underline">
          Connectez-vous
        </a>
      </p>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
          {ERREURS[error] ?? "Une erreur est survenue."}
        </p>
      )}

      <form action={register} className="mt-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700">Prénom</label>
            <input
              type="text"
              name="prenom"
              required
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Nom</label>
            <input
              type="text"
              name="nom"
              required
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
            />
          </div>
        </div>

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
          <label className="block text-sm font-medium text-neutral-700">Téléphone</label>
          <input
            type="tel"
            name="telephone"
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700">Pays</label>
            <select
              name="pays"
              required
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
            >
              <option value="BJ">Bénin</option>
              <option value="TG">Togo</option>
              <option value="BF">Burkina Faso</option>
              <option value="CI">Côte d&apos;Ivoire</option>
              <option value="AE">Dubaï</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700">Je souhaite</label>
            <select
              name="type"
              required
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
            >
              <option value="cotisant">Rejoindre une mutuelle</option>
              <option value="contributeur">Acheter des gadgets</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">Mot de passe</label>
          <input
            type="password"
            name="password"
            required
            minLength={6}
            className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full rounded-md bg-amber-800 px-4 py-3 font-medium text-white hover:bg-amber-900"
        >
          Créer mon compte
        </button>
      </form>
    </div>
  );
}
