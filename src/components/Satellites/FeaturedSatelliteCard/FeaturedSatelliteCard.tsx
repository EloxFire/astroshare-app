import { Text, TouchableOpacity, View } from "react-native";
import { featuredSatelliteCardStyles } from "./FeaturedSatelliteCard.styles";
import Badge from "../../Badges/Badge/Badge";

interface FeaturedSatelliteCardProps {
  title: string;
  subtitle: string;
  noradId: number;
  statusLabel: string;
  statusColor: { background: string; foreground: string };
  onPress?: () => void;
}

/**
 * <FeaturedSatelliteCard title="Hubble" subtitle="Charge utile · télescope" noradId={20580} statusLabel="Opérationnel" statusColor={{...}} onPress={...} />
 *
 * Tuile légère (grille 2 colonnes) pour un satellite mis en avant sans suivi live — juste sa fiche
 * catalogue (type, statut). Contraste avec SatelliteStationCard, réservée aux satellites avec
 * position/trace calculées (stations spatiales).
 */
const FeaturedSatelliteCard = ({ title, subtitle, noradId, statusLabel, statusColor, onPress }: FeaturedSatelliteCardProps) => {
  return (
    <TouchableOpacity style={featuredSatelliteCardStyles.card} onPress={onPress} disabled={!onPress} activeOpacity={0.85}>
      <View style={featuredSatelliteCardStyles.topRow}>
        <Text style={featuredSatelliteCardStyles.noradId}>{`#${noradId}`}</Text>
      </View>

      <View style={featuredSatelliteCardStyles.texts}>
        <Text style={featuredSatelliteCardStyles.texts.title} numberOfLines={1}>{title}</Text>
        <Text style={featuredSatelliteCardStyles.texts.subtitle} numberOfLines={1}>{subtitle}</Text>
      </View>

      <Badge text={statusLabel} backgroundColor={statusColor.background} foregroundColor={statusColor.foreground} />
    </TouchableOpacity>
  );
};

export default FeaturedSatelliteCard;
