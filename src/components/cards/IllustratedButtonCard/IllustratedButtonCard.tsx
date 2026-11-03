import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native"
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
}

const IllustratedButtonCard = ({ imageSource, title, subtitle, color, width }: IllustratedButtonCardProps) => {
  return (
    <TouchableOpacity
      style={[illustratedButtonCardStyles.card, color && { backgroundColor: color }, width !== undefined && { width }]}
    >
      <View style={illustratedButtonCardStyles.card.imageContainer}>
        <Image
          source={imageSource}
          style={illustratedButtonCardStyles.card.image}
          resizeMode="cover"
        />
      </View>
      <Text style={illustratedButtonCardStyles.card.title}>{title}</Text>
      {subtitle && <Text style={illustratedButtonCardStyles.card.subtitle}>{subtitle}</Text>}
    </TouchableOpacity>
  )
}

export default IllustratedButtonCard