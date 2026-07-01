type ProgressBarProps = {
  actuel: number;
  cible: number;
  label?: string;
};

export default function ProgressBar({ actuel, cible, label }: ProgressBarProps) {
  const pourcentage = cible > 0 ? Math.min(100, Math.floor((actuel / cible) * 100)) : 0;

  return (
    <div>
      {label && (
        <div className="mb-1 flex items-center justify-between text-sm text-neutral-600">
          <span>{label}</span>
          <span className="font-medium text-neutral-900">
            {actuel}/{cible}
          </span>
        </div>
      )}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-neutral-200">
        <div
          className="h-full rounded-full bg-amber-700 transition-all"
          style={{ width: `${pourcentage}%` }}
        />
      </div>
    </div>
  );
}
