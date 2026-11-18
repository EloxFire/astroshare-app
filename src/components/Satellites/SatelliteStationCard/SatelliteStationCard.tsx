import { Text, TouchableOpacity, View } from "react-native";
import { Radio, Satellite } from "lucide-react-native";
import { satelliteStationCardStyles } from "./SatelliteStationCard.styles";
import { app_colors } from "../../../helpers/variables";
import Badge from "../../Badges/Badge/Badge";

interface SatelliteStationCardProps {
  title: string;
  subtitle: string;
  // null tant que la position live n'a pas encore été calculée (TLE en cours de chargement).
  altitudeLabel: string | null;
  liveLabel: string;
  nextPassLabel?: string | null;
  onPress?: () => void;
}

/**
 * <SatelliteStationCard title="ISS" subtitle="ISS (ZARYA) · NORAD 25544" altitudeLabel="418 km" liveLabel="EN DIRECT" nextPassLabel="Demain 18:42 · 67° · visible" onPress={...} />
 *
 * Grande carte sombre "station spatiale" (ISS, Tiangong) : position live (altitude) et résumé du
 * prochain passage visible. Réservé aux quelques satellites mis en avant par l'app (featured.ts) —
 * voir FeaturedSatelliteCard pour les autres satellites suivis sans données live.
 */
const SatelliteStationCard = ({ title, subtitle, altitudeLabel, liveLabel, nextPassLabel, onPress }: SatelliteStationCardProps) => {
  return (
    <TouchableOpacity style={satelliteStationCardStyles.card} onPress={onPress} disabled={!onPress} activeOpacity={0.85}>
      <View style={satelliteStationCardStyles.card.illustrationContainer}>
        <Satellite size={40} color={app_colors.white} />
      </View>

      <View style={satelliteStationCardStyles.card.infos}>
        <View style={{display: "flex", flexDirection: "row", gap: 10, alignItems: "center"}}>
          <Badge
            icon={Radio}
            text={liveLabel}
            backgroundColor={app_colors.red.main}
            foregroundColor={app_colors.red.light}
          />
          <Text style={satelliteStationCardStyles.card.infos.label}>{altitudeLabel}</Text>
        </View>
        <View>
          <Text style={satelliteStationCardStyles.card.infos.title}>{title}</Text>
          <Text style={satelliteStationCardStyles.card.infos.subtitle}>{subtitle}</Text>
        </View>

        <View style={satelliteStationCardStyles.card.infos.nextPassBadge}>
          <Text style={satelliteStationCardStyles.card.infos.nextPassBadge.text}>{nextPassLabel}</Text>
        </View>
      </View>
      {/* <View style={satelliteStationCardStyles.topRow}>
        <View style={satelliteStationCardStyles.badge}>
          <Satellite size={20} color={app_colors.white} />
        </View>

        {altitudeLabel && (
          <View style={satelliteStationCardStyles.liveBadge}>
            <View style={satelliteStationCardStyles.liveBadge.dot} />
            <Text style={satelliteStationCardStyles.liveBadge.text}>{`${liveLabel} · ${altitudeLabel}`}</Text>
          </View>
        )}
      </View>

      <View style={satelliteStationCardStyles.texts}>
        <Text style={satelliteStationCardStyles.texts.title}>{title}</Text>
        <Text style={satelliteStationCardStyles.texts.subtitle}>{subtitle}</Text>
      </View>

      {nextPassLabel && (
        <View style={satelliteStationCardStyles.nextPassBadge}>
          <Text style={satelliteStationCardStyles.nextPassBadge.text}>{nextPassLabel}</Text>
        </View>
      )} */}
    </TouchableOpacity>
  );
};

export default SatelliteStationCard;
