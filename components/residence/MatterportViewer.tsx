import { isValidMatterportUrl } from "@/lib/utils/matterport";

type MatterportViewerProps = {
  url: string | null | undefined;
  titre?: string;
};

export default function MatterportViewer({ url, titre = "Visite virtuelle 3D" }: MatterportViewerProps) {
  if (!isValidMatterportUrl(url)) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-neutral-100 text-neutral-400">
        Visite virtuelle non disponible
      </div>
    );
  }

  return (
    <div className="aspect-video w-full overflow-hidden rounded-lg">
      <iframe
        src={url}
        title={titre}
        allow="xr-spatial-tracking; gyroscope; accelerometer; fullscreen"
        allowFullScreen
        className="h-full w-full border-0"
      />
    </div>
  );
}
