const STYLES: Record<string, string> = {
  ouverte: "bg-green-100 text-green-800",
  complete: "bg-blue-100 text-blue-800",
  en_construction: "bg-amber-100 text-amber-800",
  en_exploitation: "bg-purple-100 text-purple-800",
  remboursement_foncier: "bg-indigo-100 text-indigo-800",
  cloturee: "bg-neutral-200 text-neutral-700",
  planifiee: "bg-neutral-200 text-neutral-700",
  actif: "bg-green-100 text-green-800",
  suspendu: "bg-amber-100 text-amber-800",
  defaillant: "bg-red-100 text-red-800",
  livre: "bg-blue-100 text-blue-800",
  en_preparation: "bg-neutral-200 text-neutral-700",
  expedie: "bg-purple-100 text-purple-800",
};

export default function Badge({ statut }: { statut: string }) {
  const style = STYLES[statut] ?? "bg-neutral-200 text-neutral-700";
  return (
    <span className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${style}`}>
      {statut.replaceAll("_", " ")}
    </span>
  );
}
