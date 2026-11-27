import { TouchableOpacity, type StyleProp, type ViewStyle } from "react-native";
import type { LucideIcon } from "lucide-react-native";
import { DARK_GLASS_ICON, DARK_GLASS_ICON_ACTIVE } from "../../../helpers/planetarium/utils/darkGlass";
import { planetariumIconButtonStyles as styles } from "./PlanetariumIconButton.styles";

interface PlanetariumIconButtonProps {
  icon: LucideIcon;
  active?: boolean;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
}

/**
 * Bouton carré "verre sombre" — brique de base de tous les boutons flottants du planétarium (retour,
 * calques, recherche, champ, horloge). Statique, pas d'animation : simple bouton toujours visible,
 * comme sur `main` (pas de dock/éventail — retour explicite de l'utilisateur contre ce genre
 * d'animation ajoutée).
 */
const PlanetariumIconButton = ({ icon: Icon, active, onPress, style }: PlanetariumIconButtonProps) => (
  <TouchableOpacity style={[styles.button, active && styles.buttonActive, style]} onPress={onPress}>
    <Icon size={20} color={active ? DARK_GLASS_ICON_ACTIVE : DARK_GLASS_ICON} />
  </TouchableOpacity>
);

export default PlanetariumIconButton;
