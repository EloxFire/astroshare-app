import { Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { MapPin } from "lucide-react-native";
import { useTranslation } from "react-i18next";
import { locationBannerStyles } from "./LocationBanner.styles";
import { app_colors } from "../../../helpers/variables";
import { useLocation } from "../../../context/LocationContext";

interface LocationBannerProps {
  // Texte déjà traduit par l'appelant (ex: "Transits visibles depuis Paris"), pour s'adapter au
  // vocabulaire de chaque outil (passages, transits...) — sans ce prop, retombe sur le libellé
  // générique "Passages vus depuis..." (namespace tools/satelliteTracker, comportement d'origine,
  // premier appelant de ce composant partagé).
  message?: string;
}

/**
 * Bandeau "<message> · Changer" : utilisé par tout écran dont les calculs dépendent de la position
 * effective de l'utilisateur (observatoire actif ou GPS, voir LocationContext). "Changer" renvoie
 * vers les observatoires : c'est le seul endroit de l'app où l'utilisateur choisit explicitement un
 * lieu actif, il n'y a pas d'écran "position" dédié.
 */
const LocationBanner = ({ message }: LocationBannerProps) => {
  const { t } = useTranslation("tools/satelliteTracker");
  const { location } = useLocation();

  const defaultMessage = location?.name
    ? t("screen.locationBanner", { location: location.name })
    : t("screen.locationBannerUnknown");

  return (
    <View style={locationBannerStyles.banner}>
      <MapPin size={14} color={app_colors.primary.main} />
      <Text style={locationBannerStyles.text}>{message ?? defaultMessage}</Text>
      <TouchableOpacity onPress={() => router.push("/settings/observatories")}>
        <Text style={locationBannerStyles.link}>{t("screen.changeLocation")}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LocationBanner;
