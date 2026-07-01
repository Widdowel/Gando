import { prisma } from "@/lib/prisma";
import Badge from "@/components/ui/Badge";
import { changerStatutKyc } from "./actions";

const STATUTS_KYC = ["pending", "verified", "rejected"];

export default async function AdminKycPage() {
  const utilisateurs = await prisma.user.findMany({
    where: { type: { in: ["cotisant", "contributeur"] } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Suivi KYC</h1>

      <table className="mt-4 w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-neutral-500">
            <th className="py-2 font-medium">Utilisateur</th>
            <th className="py-2 font-medium">Email</th>
            <th className="py-2 font-medium">Pays</th>
            <th className="py-2 font-medium">Type</th>
            <th className="py-2 font-medium">Statut KYC</th>
          </tr>
        </thead>
        <tbody>
          {utilisateurs.map((user) => (
            <tr key={user.id} className="border-b border-neutral-100">
              <td className="py-2 text-neutral-900">
                {user.prenom} {user.nom}
              </td>
              <td className="py-2 text-neutral-700">{user.email}</td>
              <td className="py-2 text-neutral-700">{user.pays}</td>
              <td className="py-2 text-neutral-700">{user.type}</td>
              <td className="py-2">
                <form
                  action={changerStatutKyc.bind(null, user.id)}
                  className="flex items-center gap-2"
                >
                  <select
                    name="statutKyc"
                    defaultValue={user.statutKyc}
                    className="rounded-md border border-neutral-300 px-2 py-1 text-xs"
                  >
                    {STATUTS_KYC.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <button
                    type="submit"
                    className="rounded-md bg-neutral-800 px-2 py-1 text-xs text-white hover:bg-neutral-900"
                  >
                    Mettre à jour
                  </button>
                  <Badge statut={user.statutKyc} />
                </form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
