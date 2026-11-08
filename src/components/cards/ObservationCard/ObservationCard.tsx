import { Image, ImageSourcePropType, Text, TouchableOpacity, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { app_colors } from "../../../helpers/variables";
import { observationCardStyles } from "./ObservationCard.styles";

interface ObservationCardProps {
  // Désignation de l'objet (ex: "M31").
  title: string;
  // Nom courant de l'objet (ex: "Galaxie d'Andromède").
  name?: string;
  // Surtitre en majuscules au-dessus du titre (ex: "Dernier objet observé").
  label?: string;
  // Ligne de détails sous le nom, déjà formatée par l'appelant (ex: "12 jan. - Plateau de Valensole").
  details?: string;
  // Illustration ronde de l'objet. Absente : disque sombre de repli.
  image?: ImageSourcePropType;
  onPress?: () => void;
}

/**
 * <ObservationCard label="Dernier objet observé" title="M31" name="Galaxie d'Andromède" details="12 jan. - Plateau de Valensole" onPress={…} />
 *
 * Carte d'une observation du Journal : illustration ronde de l'objet, désignation, nom et détails,
 * avec un chevron. Le chevron est toujours affiché (la carte est pensée comme un lien vers
 * l'observation) ; la carte ne réagit au toucher que si `onPress` est fourni.
 */
const ObservationCard = ({ title, name, label, details, image, onPress }: ObservationCardProps) => {
  return (
    <TouchableOpacity
      style={observationCardStyles.card}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
    >
      {image ? (
        <Image source={image} style={observationCardStyles.card.illustration} />
      ) : (
        <View style={observationCardStyles.card.illustration} />
      )}

      <View style={observationCardStyles.card.content}>
        {label && <Text style={observationCardStyles.card.content.label}>{label}</Text>}
        <View>
          <Text style={observationCardStyles.card.content.title}>{title}</Text>
          {name && <Text style={observationCardStyles.card.content.name}>{name}</Text>}
        </View>
        {details && <Text style={observationCardStyles.card.content.details}>{details}</Text>}
      </View>

      <View style={observationCardStyles.card.chevronContainer}>
        <ChevronRight size={20} color={app_colors.accent.main} />
      </View>
    </TouchableOpacity>
  );
};

export default ObservationCard;
