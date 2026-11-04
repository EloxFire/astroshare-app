import { ImageSourcePropType } from "react-native"
import { useRemoteFile } from "../../../../../hooks/useRemoteFile"
import { getModelLocalPath } from "../../../../../helpers/tools/3dviewer"
import { isDownloadableModel, ThreeDModel } from "../../../../../types/tools/3dViewer"
import IllustratedButtonCard from "../../../../../components/cards/IllustratedButtonCard/IllustratedButtonCard"

interface ModelGridCardProps {
  model: ThreeDModel;
  imageSource: ImageSourcePropType;
  title: string;
  color?: string;
  width?: number;
  onPress: () => void;
}

// Carte de la grille de modèles : branche le statut de téléchargement (useRemoteFile) sur la
// pastille de IllustratedButtonCard — séparé du composant générique pour ne pas le coupler à la
// logique de téléchargement d'un modèle en particulier (même principe que ModelDownloadButton,
// pour le bouton de la carte "à la une").
const ModelGridCard = ({ model, imageSource, title, color, width, onPress }: ModelGridCardProps) => {
  const { status, progress } = useRemoteFile({
    url: isDownloadableModel(model) ? model.modelUrl : undefined,
    localPath: isDownloadableModel(model) ? getModelLocalPath(model) : undefined,
  })

  return (
    <IllustratedButtonCard
      imageSource={imageSource}
      title={title}
      color={color}
      width={width}
      onPress={onPress}
      // Modèle pas encore téléchargeable (pas de .glb) : aucune pastille plutôt que "non téléchargé".
      downloadStatus={isDownloadableModel(model) ? status : undefined}
      downloadProgress={progress}
    />
  )
}

export default ModelGridCard
