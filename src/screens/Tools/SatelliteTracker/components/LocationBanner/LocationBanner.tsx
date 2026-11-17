import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { MapPin } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { locationBannerStyles } from "./LocationBanner.styles";
import { app_colors } from "../../../../../helpers/variables";
import { useLocation } from "../../../../../context/LocationContext";

/**
 * Bandeau "Passages vus depuis <lieu> · Changer" : les passages (comme la position live) sont
 * calculés pour la position effective de l'utilisateur (observatoire actif ou GPS, voir
 * LocationContext). "Changer" renvoie vers les observatoires : c'est le seul endroit de l'app où
 * l'utilisateur choisit explicitement un lieu actif, il n'y a pas d'écran "position" dédié.
 */
const LocationBanner = () => {
  const { t } = useTranslation("tools/satelliteTracker");
  const { location } = useLocation();

  return (
    <View style={locationBannerStyles.banner}>
      <MapPin size={14} color={app_colors.primary.main} />
      <Text style={locationBannerStyles.text}>
        {location?.name ? t("screen.locationBanner", { location: location.name }) : t("screen.locationBannerUnknown")}
      </Text>
      <TouchableOpacity onPress={() => router.push("/settings/observatories")}>
        <Text style={locationBannerStyles.link}>{t("screen.changeLocation")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LocationBanner;
