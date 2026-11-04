import { Image, Share, Text, TouchableOpacity, View } from "react-native"
import { useTranslation } from "react-i18next"
import { Rotate3D, Share2 } from "lucide-react-native"
import { app_colors } from "../../../../../../helpers/variables"
import { DEFAULT_MODEL_ILLUSTRATION, getModelLocalPath } from "../../../../../../helpers/tools/3dviewer"
import { isDownloadableModel, ThreeDModel } from "../../../../../../types/tools/3dViewer"
import { useRemoteFile } from "../../../../../../hooks/useRemoteFile"
import Badge from "../../../../../../components/Badges/Badge/Badge"
import DownloadButton from "../../../../../../components/DownloadButton/DownloadButton"
import Model3DViewer from "../../../../../../components/Model3DViewer/Model3DViewer"
import { viewerSectionStyles } from "./ViewerSection.styles"

interface ViewerSectionProps {
  model: ThreeDModel;
}

// Carte du visualiseur 3D : une fois le modèle téléchargé, affiche le rendu 3D (Model3DViewer) à
// la place de l'illustration statique — sinon le bouton de téléchargement, ou un message d'attente
// si ce modèle n'est pas encore téléchargeable.
const ViewerSection = ({ model }: ViewerSectionProps) => {
  const { t } = useTranslation("tools/3dviewer")

  const { status, progress, remoteSizeBytes, localUri, download } = useRemoteFile({
    url: isDownloadableModel(model) ? model.modelUrl : undefined,
    localPath: isDownloadableModel(model) ? getModelLocalPath(model) : undefined,
  })

  const handleShare = () => {
    Share.share({ message: t("shareMessage", { name: t(`modelNames.${model.id}`) }) })
  }

  // Rien à afficher en dessous de la scène une fois le modèle prêt (déjà affiché en 3D) : évite un
  // bloc de padding vide sous le visualiseur.
  const hasBottomContent = isDownloadableModel(model) ? status !== "ready" : true

  return (
    <View style={viewerSectionStyles.card}>
      <View style={viewerSectionStyles.scene}>
        {status === "ready" && localUri ? (
          <Model3DViewer uri={localUri} rotationY={model.rotationY} />
        ) : (
          <Image
            source={model.illustration || DEFAULT_MODEL_ILLUSTRATION}
            style={viewerSectionStyles.scene.image}
            resizeMode="contain"
          />
        )}

        <View style={viewerSectionStyles.scene.overlay}>
          <Badge text="3D" icon={Rotate3D} backgroundColor={app_colors.accent.main} />
          <TouchableOpacity onPress={handleShare}>
            <Share2 color={app_colors.white} size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {hasBottomContent && (
        <View style={viewerSectionStyles.bottomContent}>
          {isDownloadableModel(model) ? (
            <DownloadButton
              status={status}
              progress={progress}
              remoteSizeBytes={remoteSizeBytes}
              readyLabel={t("viewer.viewReady")}
              readyIcon={Rotate3D}
              onPress={download}
            />
          ) : (
            <Text style={viewerSectionStyles.caption}>{t("viewer.comingSoon")}</Text>
          )}
        </View>
      )}
    </View>
  )
}

export default ViewerSection
