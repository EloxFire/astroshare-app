import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native"
import { CloudDownload } from "lucide-react-native"
import { app_colors } from "../../../helpers/variables"
import { RemoteFileStatus } from "../../../hooks/useRemoteFile"
import { illustratedButtonCardStyles } from "./IllustratedButtonCard.styles"

interface IllustratedButtonCardProps {
  imageSource: ImageSourcePropType;
  title: string;
  color?: string;
  subtitle?: string;
  // Largeur exacte calculée par le conteneur parent (même principe que ToolButton/ToolsSection) —
  // remplace la largeur par défaut, dictée par le contenu (image + texte), qui ne s'aligne pas en
  // grille à largeur fixe.
  width?: number;
  onPress?: () => void;
  // Pastille de statut de téléchargement sur l'image (coin supérieur droit) : absente si non
  // fournie, pour ne pas imposer ce concept aux usages futurs qui n'en ont pas besoin. "ready" ne
  // montre rien (déjà téléchargé, rien à signaler).
  downloadStatus?: RemoteFileStatus;
  downloadProgress?: number; // 0 à 1, utilisé seulement si downloadStatus === "downloading"
}

const IllustratedButtonCard = ({ imageSource, title, subtitle, color, width, onPress, downloadStatus, downloadProgress }: IllustratedButtonCardProps) => {
  return (
    <TouchableOpacity
      style={[illustratedButtonCardStyles.card, color && { backgroundColor: color }, width !== undefined && { width }]}
      onPress={onPress}
    >
      <View style={illustratedButtonCardStyles.card.imageContainer}>
        <Image
          source={imageSource}
          style={illustratedButtonCardStyles.card.image}
          resizeMode="cover"
        />
        {downloadStatus && downloadStatus !== "ready" && (
          <View style={illustratedButtonCardStyles.card.imageContainer.downloadBadge}>
            {downloadStatus === "downloading" ? (
              <Text style={illustratedButtonCardStyles.card.imageContainer.downloadBadge.text}>
                {Math.round((downloadProgress ?? 0) * 100)}%
              </Text>
            ) : (
              <CloudDownload size={12} color={app_colors.white} />
            )}
          </View>
        )}
      </View>
      <Text style={illustratedButtonCardStyles.card.title}>{title}</Text>
      {subtitle && <Text style={illustratedButtonCardStyles.card.subtitle}>{subtitle}</Text>}
    </TouchableOpacity>
  )
}

export default IllustratedButtonCard
