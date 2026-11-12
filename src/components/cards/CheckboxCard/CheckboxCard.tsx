import { Text, TouchableOpacity, View } from "react-native";
import Checkbox from "../../Checkbox/Checkbox";
import { checkboxCardStyles } from "./CheckboxCard.styles";

interface CheckboxCardProps {
  title: string;
  // Ligne de détails, déjà formatée par l'appelant (ex: "Lunette 80/560 · AZ-GTi · 2 oculaires").
  subtitle?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

/**
 * <CheckboxCard title="Lunette nomade" subtitle="Lunette 80/560 · AZ-GTi · 2 oculaires" checked={…} onChange={…} />
 *
 * Carte sélectionnable : Checkbox à gauche, titre et sous-titre. Toute la carte coche ou décoche,
 * et elle passe en violet clair bordé de violet quand elle est cochée. Composant contrôlé, comme
 * Checkbox : l'état vit chez le parent (`checked` / `onChange`).
 */
const CheckboxCard = ({ title, subtitle, checked, onChange }: CheckboxCardProps) => {
  return (
    <TouchableOpacity
      style={[checkboxCardStyles.card, checked && checkboxCardStyles.card.checked]}
      onPress={() => onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      accessibilityLabel={subtitle ? `${title}, ${subtitle}` : title}
    >
      {/* La carte entière est la cible : la Checkbox n'est ici qu'un indicateur visuel. Sans
          pointerEvents="none", un appui pile sur la case serait capté par elle seule ; et sans
          masquage d'accessibilité, les lecteurs d'écran annonceraient deux cases à cocher. */}
      <View pointerEvents="none" importantForAccessibility="no-hide-descendants" accessibilityElementsHidden>
        <Checkbox checked={checked} onChange={onChange} />
      </View>

      <View style={checkboxCardStyles.card.texts}>
        <Text style={checkboxCardStyles.card.texts.title}>{title}</Text>
        {subtitle && <Text style={checkboxCardStyles.card.texts.subtitle}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
};

export default CheckboxCard;
