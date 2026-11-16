import { Text, TouchableOpacity, View } from "react-native";
import { LucideIcon, X } from "lucide-react-native";
import { app_colors, icons } from "../../../helpers/variables";
import { objectCardLiteStyles } from "./ObjectCardLite.styles";

export type ObjectCardLiteToggle = {
  icon: LucideIcon;
  active: boolean;
  // Sans `onPress`, la pastille n'est qu'un indicateur d'état (ex: fiche d'une session enregistrée,
  // en lecture seule) : même rendu, mais elle ne réagit pas au toucher.
  onPress?: () => void;
  accessibilityLabel: string;
};

interface ObjectCardLiteProps {
  title: string;
  subtitle: string;
  toggles: ObjectCardLiteToggle[];
  // Sans `onPress`, la ligne ne réagit pas au toucher.
  onPress?: () => void;
  // Sans `onRemove`, pas de bouton de suppression (liste en lecture seule).
  onRemove?: () => void;
  withBorder?: boolean;
}

/**
 * <ObjectCardLite
 *   title="M31 · Andromède" subtitle="Galaxie · Messier"
 *   toggles={[{ icon: Eye, active, onPress, accessibilityLabel: "Observé à l'oculaire" }, ...]}
 *   onPress={() => {}} onRemove={() => {}}
 * />
 *
 * Ligne d'objet observé (liste "Objets observés" du formulaire de session et de la fiche d'une
 * session) : design dérivé de ListCard (carte-liste à lignes séparées par une bordure, voir
 * `withBorder`). L'item entier mène à la fiche détaillée de l'objet ; les boutons de bascule et de
 * suppression sont des TouchableOpacity imbriqués, dont React Native capte le toucher sans le
 * laisser remonter au conteneur.
 */
const ObjectCardLite = ({ title, subtitle, toggles, onPress, onRemove, withBorder = false }: ObjectCardLiteProps) => {
  return (
    <TouchableOpacity
      style={[objectCardLiteStyles.card, withBorder && objectCardLiteStyles.card.withBorder]}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
    >
      <View style={objectCardLiteStyles.card.texts}>
        <Text style={objectCardLiteStyles.card.texts.title} numberOfLines={1}>{title}</Text>
        <Text style={objectCardLiteStyles.card.texts.subtitle} numberOfLines={1}>{subtitle}</Text>
      </View>

      <View style={objectCardLiteStyles.card.actions}>
        {toggles.map((toggle, index) => {
          const toggleStyle = [objectCardLiteStyles.card.actions.toggle, toggle.active && objectCardLiteStyles.card.actions.toggle.active]
          const toggleIcon = <toggle.icon size={icons.badge32} color={toggle.active ? app_colors.ambre.main : app_colors.primary.medium} />

          return toggle.onPress ? (
            <TouchableOpacity
              key={index}
              style={toggleStyle}
              onPress={toggle.onPress}
              accessibilityRole="button"
              accessibilityLabel={toggle.accessibilityLabel}
              accessibilityState={{ selected: toggle.active }}
            >
              {toggleIcon}
            </TouchableOpacity>
          ) : (
            <View
              key={index}
              style={toggleStyle}
              accessible
              accessibilityLabel={toggle.accessibilityLabel}
              accessibilityState={{ selected: toggle.active }}
            >
              {toggleIcon}
            </View>
          )
        })}

        {onRemove && (
          <TouchableOpacity
            style={objectCardLiteStyles.card.actions.remove}
            onPress={onRemove}
            accessibilityRole="button"
            accessibilityLabel="Retirer de la liste"
            hitSlop={8}
          >
            <X size={18} color={app_colors.grey} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default ObjectCardLite;
