import { Text, TouchableOpacity, View } from "react-native";
import { LucideIcon, X } from "lucide-react-native";
import { app_colors, icons } from "../../../helpers/variables";
import { objectCardLiteStyles } from "./ObjectCardLite.styles";

export type ObjectCardLiteToggle = {
  icon: LucideIcon;
  active: boolean;
  onPress: () => void;
  accessibilityLabel: string;
};

interface ObjectCardLiteProps {
  title: string;
  subtitle: string;
  toggles: ObjectCardLiteToggle[];
  onPress: () => void;
  onRemove: () => void;
  withBorder?: boolean;
}

/**
 * <ObjectCardLite
 *   title="M31 · Andromède" subtitle="Galaxie · Messier"
 *   toggles={[{ icon: Eye, active, onPress, accessibilityLabel: "Observé à l'oculaire" }, ...]}
 *   onPress={() => {}} onRemove={() => {}}
 * />
 *
 * Ligne d'objet observé (liste "Objets observés" du formulaire de session) : design dérivé de
 * ListCard (carte-liste à lignes séparées par une bordure, voir `withBorder`). L'item entier mène
 * à la fiche détaillée de l'objet ; les boutons de bascule et de suppression sont des TouchableOpacity
 * imbriqués, dont React Native capte le toucher sans le laisser remonter au conteneur.
 */
const ObjectCardLite = ({ title, subtitle, toggles, onPress, onRemove, withBorder = false }: ObjectCardLiteProps) => {
  return (
    <TouchableOpacity
      style={[objectCardLiteStyles.card, withBorder && objectCardLiteStyles.card.withBorder]}
      onPress={onPress}
      accessibilityRole="button"
    >
      <View style={objectCardLiteStyles.card.texts}>
        <Text style={objectCardLiteStyles.card.texts.title} numberOfLines={1}>{title}</Text>
        <Text style={objectCardLiteStyles.card.texts.subtitle} numberOfLines={1}>{subtitle}</Text>
      </View>

      <View style={objectCardLiteStyles.card.actions}>
        {toggles.map((toggle, index) => (
          <TouchableOpacity
            key={index}
            style={[objectCardLiteStyles.card.actions.toggle, toggle.active && objectCardLiteStyles.card.actions.toggle.active]}
            onPress={toggle.onPress}
            accessibilityRole="button"
            accessibilityLabel={toggle.accessibilityLabel}
            accessibilityState={{ selected: toggle.active }}
          >
            <toggle.icon size={icons.badge32} color={toggle.active ? app_colors.ambre.main : app_colors.primary.medium} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={objectCardLiteStyles.card.actions.remove}
          onPress={onRemove}
          accessibilityRole="button"
          accessibilityLabel="Retirer de la liste"
          hitSlop={8}
        >
          <X size={18} color={app_colors.grey} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ObjectCardLite;
