import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Navigation, SearchCheck } from "lucide-react-native";
import { app_colors } from "../../../../../helpers/variables";
import { useLocation } from "../../../../../context/LocationContext";
import { findNearestVisiblePoint } from "../../../../../helpers/eclipses/findNearestVisiblePoint";
import { azimuthToCompass } from "../../../../../helpers/eclipses/visibilityRating";
import { nearestVisiblePointStyles as styles } from "./NearestVisiblePoint.styles";

interface NearestVisiblePointProps {
  origin: { latitude: number; longitude: number };
  checkVisible: (latitude: number, longitude: number) => Promise<boolean>;
  onSelect: (latitude: number, longitude: number, name: string) => void;
}

type Result = { latitude: number; longitude: number; distanceKm: number; compass: string; name: string };

/**
 * Bouton "voir le point visible le plus proche" — port de
 * astroshare-public-tools/src/components/NearestVisiblePoint.tsx, sans l'animation radar (nicété
 * visuelle, pas d'équivalent direct utile en React Native pour une recherche qui prend quelques
 * secondes au plus).
 */
const NearestVisiblePoint = ({ origin, checkVisible, onSelect }: NearestVisiblePointProps) => {
  const { t, i18n } = useTranslation("tools/eclipses");
  const { fetchLocation } = useLocation();
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "empty">("idle");
  const [result, setResult] = useState<Result | null>(null);

  const handleSearch = async () => {
    setStatus("loading");
    try {
      const point = await findNearestVisiblePoint(origin.latitude, origin.longitude, checkVisible);
      if (!point) {
        setStatus("empty");
        return;
      }
      const compass = azimuthToCompass(point.bearingDeg);
      const distanceKm = Math.round(point.distanceKm);
      const location = await fetchLocation(`${point.latitude}::${point.longitude}`);
      const name = location?.local_names?.[i18n.language] || location?.name || t("details.distanceCompass", { distance: distanceKm, compass });
      setResult({ latitude: point.latitude, longitude: point.longitude, distanceKm, compass, name });
      setStatus("done");
    } catch {
      setStatus("empty");
    }
  };

  if (status === "idle") {
    return (
      <TouchableOpacity style={styles.button} onPress={handleSearch}>
        <SearchCheck size={16} color={app_colors.primary.main} />
        <Text style={styles.button.text}>{t("details.nearestVisible.search")}</Text>
      </TouchableOpacity>
    );
  }

  if (status === "loading") {
    return (
      <View style={styles.button}>
        <ActivityIndicator size="small" color={app_colors.accent.main} />
        <Text style={styles.button.text}>{t("details.nearestVisible.loading")}</Text>
      </View>
    );
  }

  if (status === "empty" || !result) {
    return (
      <View style={styles.button}>
        <Text style={styles.button.text}>{t("details.nearestVisible.empty")}</Text>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.button} onPress={() => onSelect(result.latitude, result.longitude, result.name)}>
      <Navigation size={16} color={app_colors.primary.main} />
      <View style={{ flex: 1 }}>
        <Text style={styles.button.text}>{result.name}</Text>
        <Text style={styles.meta}>{t("details.distanceCompass", { distance: result.distanceKm, compass: result.compass })}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default NearestVisiblePoint;
