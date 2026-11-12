import { Text, TouchableOpacity, View } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { app_colors } from "../../../helpers/variables";
import { useAppUnits } from "../../../hooks/useAppUnits";
import { formatShortMonth } from "../../../helpers/format";
import { iconButtonCardStyles } from "./IconButtonCard.styles";

// Contenu de la pastille : une icône, ou une date (jour + mois abrégé) qui prend sa place. Au moins
// l'un des deux est requis ; si les deux sont fournis, la date l'emporte.
type IconButtonCardBadgeProps =
  | { icon: LucideIcon; date?: Date }
  | { icon?: LucideIcon; date: Date };

type IconButtonCardProps = IconButtonCardBadgeProps & {
  title: string;
  subtitle?: string;
  // Couleurs de la pastille : fond, et couleur de l'icône ou du texte de la date (défaut : violet
  // clair, contenu violet foncé).
  badgeBackgroundColor?: string;
  badgeContentColor?: string;
  onPress?: () => void;
  // Même logique que InputWithIcon / SelectInput — false (défaut) : largeur dictée par le parent
  // (pleine largeur dans une colonne) ; true : flex:1, pour partager une View flexDirection:"row"
  // avec d'autres cartes (ex: deux raccourcis côte à côte).
  fill?: boolean;
  // Carte choisie dans une liste à choix unique (ex: le lieu d'une session) : fond violet clair
  // bordé de violet, comme une CheckboxCard cochée.
  selected?: boolean;
};

/**
 * <IconButtonCard icon={ChartColumn} title="Statistiques" subtitle="Mois, lieux, ciel" onPress={…} fill />
 * <IconButtonCard date={session.date} title="La Sinne" subtitle="21:10 - 00:45" onPress={…} />
 *
 * Carte-bouton : pastille colorée (icône ou date), titre et sous-titre courts. Pensée pour mener
 * vers une autre page (pas de chevron : la carte entière est la cible). Sans `onPress`, elle
 * s'affiche sans réagir au toucher.
 */
const IconButtonCard = ({
  icon: Icon,
  date,
  title,
  subtitle,
  badgeBackgroundColor = app_colors.accent.light,
  badgeContentColor = app_colors.primary.main,
  onPress,
  fill = false,
  selected = false,
}: IconButtonCardProps) => {
  // Via useAppUnits (fuseau / UTC choisis par l'utilisateur) plutôt que dayjs() directement : le
  // jour affiché doit être celui de l'heure affichée partout ailleurs dans l'app.
  const { formatDate } = useAppUnits();

  const renderBadgeContent = () => {
    if (date) {
      const shown = formatDate(date);
      return (
        <>
          <Text style={[iconButtonCardStyles.card.badge.day, { color: badgeContentColor }]}>{shown.format("D")}</Text>
          <Text style={[iconButtonCardStyles.card.badge.month, { color: badgeContentColor }]}>{formatShortMonth(shown)}</Text>
        </>
      );
    }
    return Icon ? <Icon size={20} color={badgeContentColor} /> : null;
  };

  return (
    <TouchableOpacity
      style={[iconButtonCardStyles.card, selected && iconButtonCardStyles.card.selected, fill && { flex: 1 }]}
      onPress={onPress}
      disabled={!onPress}
      accessibilityRole={onPress ? "button" : undefined}
      accessibilityState={{ selected }}
    >
      <View style={[iconButtonCardStyles.card.badge, { backgroundColor: badgeBackgroundColor }]}>
        {renderBadgeContent()}
      </View>

      <View style={iconButtonCardStyles.card.texts}>
        <Text style={iconButtonCardStyles.card.texts.title} numberOfLines={1}>{title}</Text>
        {subtitle && <Text style={iconButtonCardStyles.card.texts.subtitle} numberOfLines={1}>{subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );
};

export default IconButtonCard;
