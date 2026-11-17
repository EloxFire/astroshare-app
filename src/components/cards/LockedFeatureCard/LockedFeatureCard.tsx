import { Text, View } from "react-native";
import { Lock, LucideIcon } from "lucide-react-native";
import { lockedFeatureCardStyles } from "./LockedFeatureCard.styles";
import { app_colors } from "../../../helpers/variables";
import Button from "../../buttons/Button/Button";

interface LockedFeatureCardProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  ctaLabel: string;
  onPressCta?: () => void;
}

/**
 * <LockedFeatureCard title={t(...)} description={t(...)} ctaLabel={t(...)} onPressCta={...} />
 *
 * Carte "fonctionnalité PRO verrouillée" : pastille cadenas, titre, description, bouton vers
 * Astroshare PRO. Généralisée à partir du TODO laissé dans SpaceWeatherScreen ("créer les cartes
 * locker") — premier usage ici (Satellites, "Mes satellites"), à réutiliser pour les prochains
 * écrans qui gatent une fonctionnalité derrière un abonnement plutôt que d'en refaire une par écran.
 */
const LockedFeatureCard = ({ icon: Icon = Lock, title, description, ctaLabel, onPressCta }: LockedFeatureCardProps) => {
  return (
    <View style={lockedFeatureCardStyles.card}>
      <View style={lockedFeatureCardStyles.badge}>
        <Icon size={18} color={app_colors.yellow.main} />
      </View>
      <Text style={lockedFeatureCardStyles.title}>{title}</Text>
      <Text style={lockedFeatureCardStyles.description}>{description}</Text>
      <Button label={ctaLabel} onPress={onPressCta} style={lockedFeatureCardStyles.cta} />
    </View>
  );
};

export default LockedFeatureCard;
