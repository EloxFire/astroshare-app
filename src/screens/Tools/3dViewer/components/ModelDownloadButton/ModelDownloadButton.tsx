import { LucideIcon } from "lucide-react-native"
import { useRemoteFile } from "../../../../../hooks/useRemoteFile"
import DownloadButton from "../../../../../components/DownloadButton/DownloadButton"
import { getModelLocalPath } from "../../../../../helpers/tools/3dviewer"
import { DownloadableThreeDModel } from "../../../../../types/tools/3dViewer"

interface ModelDownloadButtonProps {
  model: DownloadableThreeDModel;
  readyLabel: string;
  readyIcon: LucideIcon;
  // Appelé quand on appuie sur le bouton alors que le modèle est déjà téléchargé (fichier local prêt).
  onReady: (localUri: string) => void;
}

// Relie le module générique de téléchargement (useRemoteFile) à un modèle 3D précis : construit
// l'URL et le chemin local à partir de ses métadonnées, et décide quoi faire selon l'état
// (télécharger, ou ouvrir le modèle déjà en cache).
const ModelDownloadButton = ({ model, readyLabel, readyIcon, onReady }: ModelDownloadButtonProps) => {
  const { status, progress, remoteSizeBytes, localUri, download } = useRemoteFile({
    url: model.modelUrl,
    localPath: getModelLocalPath(model),
  })

  const handlePress = () => {
    if (status === "ready" && localUri) {
      onReady(localUri)
    } else if (status === "missing" || status === "error") {
      download()
    }
  }

  return (
    <DownloadButton
      status={status}
      progress={progress}
      remoteSizeBytes={remoteSizeBytes}
      readyLabel={readyLabel}
      readyIcon={readyIcon}
      onPress={handlePress}
    />
  )
}

export default ModelDownloadButton
