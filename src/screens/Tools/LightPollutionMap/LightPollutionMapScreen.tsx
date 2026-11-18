import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { PROVIDER_GOOGLE, UrlTile, type MapPressEvent } from "react-native-maps";
import { ChevronLeft, LocateFixed, Search } from "lucide-react-native";
import { ScreenHeader } from "../../../components/layout/ScreenHeader/ScreenHeader";
import { InputWithIcon } from "../../../components/inputs/InputWithIcon/InputWithIcon";
import LockedFeatureCard from "../../../components/cards/LockedFeatureCard/LockedFeatureCard";
import MapTargetMarker from "../../../components/MapTargetMarker/MapTargetMarker";
import { useAuth } from "../../../context/AuthContext";
import { useLocation } from "../../../context/LocationContext";
import { isProUser } from "../../../helpers/auth/subscription";
import { formatLocationLabel } from "../../../helpers/format";
import { getLightPollutionIndicatorDescription, getLightPollutionIndicatorLabel } from "../../../helpers/api/geocoding/geocoding";
import { app_colors } from "../../../helpers/variables";
import { globalStyles } from "../../../helpers/globalStyles";
import { GpsLocation } from "../../../types/gpsLocation";
import { lightPollutionMapScreenStyles } from "./LightPollutionMapScreen.styles";

// Même écart que la mini-carte de LocationMapCard, en un peu plus large : assez serré pour une
// échelle "ville", pertinente pour juger de la pollution lumineuse alentour.
const REGION_DELTA = 0.3;
// Repli si aucune position n'est encore connue (GPS pas encore résolu) — même valeur que StepOne.tsx.
const DEFAULT_REGION = { latitude: 48.856724859667835, longitude: 2.349875271320343 };

// World Atlas 2015 (voir /v3/lightpollution) : résolution d'origine ~1km, pas de tuiles au-delà de
// ce niveau de zoom — maximumZ fait tenir la dernière tuile disponible plutôt que de redemander des
// tuiles qui n'existent pas. Pas pu vérifier en direct depuis cet environnement (hôte injoignable
// d'ici) : à ajuster si le serveur va en fait plus loin.
const LIGHT_POLLUTION_TILES_URL = "https://bucket.astroshare.fr/lightpollution/tiles/{z}/{x}/{y}.webp";
const LIGHT_POLLUTION_TILES_MAX_ZOOM = 8;

const LightPollutionMapScreen = () => {
  const { t } = useTranslation("tools/lightPollutionMap");
  const { authUser } = useAuth();
  const userIsPro = isProUser(authUser);
  const insets = useSafeAreaInsets();

  const { location, gpsLoading, searchLoading, fetchLocation } = useLocation();

  const [displayedLocation, setDisplayedLocation] = useState<GpsLocation | null>(null);
  const [query, setQuery] = useState("");
  const [notFound, setNotFound] = useState(false);

  // Position de départ : celle "effective" de l'app (observatoire actif ou GPS, voir
  // LocationContext), déjà enrichie de sa pollution lumineuse — pas de nouvel appel nécessaire.
  useEffect(() => {
    if (!displayedLocation && location) setDisplayedLocation(location);
  }, [location, displayedLocation]);

  const mapRef = useRef<MapView>(null);
  const shownCoordinatesRef = useRef<{ latitude: number; longitude: number } | null>(null);

  // Recentre la carte quand le lieu affiché change vraiment (recherche, retour à la position
  // actuelle) — même principe que LocationMapCard : initialRegion n'agit qu'au premier rendu.
  useEffect(() => {
    if (!displayedLocation) return;
    const shown = shownCoordinatesRef.current;
    if (shown?.latitude === displayedLocation.latitude && shown?.longitude === displayedLocation.longitude) return;

    shownCoordinatesRef.current = { latitude: displayedLocation.latitude, longitude: displayedLocation.longitude };
    mapRef.current?.animateToRegion({
      latitude: displayedLocation.latitude,
      longitude: displayedLocation.longitude,
      latitudeDelta: REGION_DELTA,
      longitudeDelta: REGION_DELTA,
    });
  }, [displayedLocation]);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setNotFound(false);
    const result = await fetchLocation(query.trim());
    if (!result) {
      setNotFound(true);
      return;
    }
    setDisplayedLocation(result);
  };

  const handleUseCurrentLocation = () => {
    setNotFound(false);
    setQuery("");
    if (location) setDisplayedLocation(location);
  };

  // fetchLocation accepte aussi des coordonnées directes via "lat::lon" (voir LocationContext) :
  // même chemin que la recherche par nom, mais avec géocodage inverse (nom du lieu) + pollution
  // lumineuse pour le point tapé, sans réécrire cette logique ici.
  const handleMapPress = async (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setNotFound(false);
    setQuery("");
    const result = await fetchLocation(`${latitude}::${longitude}`);
    if (result) setDisplayedLocation(result);
  };

  if (!userIsPro) {
    return (
      <View style={globalStyles.screen}>
        <ScreenHeader title={t("locked.title")} main={false} />
        <View style={globalStyles.content}>
          <LockedFeatureCard
            title={t("locked.title")}
            description={t("locked.description")}
            ctaLabel={t("locked.cta")}
            // Pas encore d'écran PRO/abonnement dans l'app (voir le TODO équivalent dans
            // SpaceWeatherScreen et le même choix pour "Mes satellites") : le bouton n'a pas encore
            // de destination.
            onPressCta={() => {}}
          />
        </View>
      </View>
    );
  }

  const mapRegion = {
    latitude: displayedLocation?.latitude ?? DEFAULT_REGION.latitude,
    longitude: displayedLocation?.longitude ?? DEFAULT_REGION.longitude,
    latitudeDelta: REGION_DELTA,
    longitudeDelta: REGION_DELTA,
  };

  const bortle = displayedLocation?.light_pollution?.bortle;
  const bortleColor = bortle ? app_colors.bortleScale[bortle as keyof typeof app_colors.bortleScale] : app_colors.yellow.main;

  return (
    <View style={lightPollutionMapScreenStyles.screen}>
      <MapView
        ref={mapRef}
        style={lightPollutionMapScreenStyles.map}
        provider={PROVIDER_GOOGLE}
        mapType="standard"
        initialRegion={mapRegion}
        rotateEnabled={false}
        pitchEnabled={false}
        onPress={handleMapPress}
      >
        <UrlTile
          urlTemplate={LIGHT_POLLUTION_TILES_URL}
          maximumZ={LIGHT_POLLUTION_TILES_MAX_ZOOM}
          tileSize={256}
          zIndex={1}
          opacity={0.65}
          // Les tuiles tombaient au mauvais endroit : très probablement une pyramide TMS (origine
          // en bas à gauche, typique d'un export gdal2tiles.py sans --xyz) plutôt que XYZ (origine
          // en haut à gauche, attendu par défaut). flipY convertit l'index Y demandé.
          flipY
        />

        {displayedLocation && (
          <MapTargetMarker
            coordinate={{ latitude: displayedLocation.latitude, longitude: displayedLocation.longitude }}
            color={bortleColor}
          />
        )}
      </MapView>

      <TouchableOpacity
        style={[lightPollutionMapScreenStyles.backButton, { top: 10 + insets.top }]}
        onPress={() => router.back()}
      >
        <ChevronLeft size={22} color={app_colors.white} />
      </TouchableOpacity>

      <View style={[lightPollutionMapScreenStyles.searchRow, { top: 10 + insets.top }]}>
        <InputWithIcon
          icon={Search}
          placeholder={t("search.placeholder")}
          value={query}
          onChangeText={(text) => { setQuery(text); setNotFound(false); }}
          action={handleSearch}
        />
        {notFound && <Text style={lightPollutionMapScreenStyles.searchError}>{t("search.notFound")}</Text>}
      </View>

      <TouchableOpacity
        style={[lightPollutionMapScreenStyles.useLocationButton, { top: 60 + insets.top }]}
        onPress={handleUseCurrentLocation}
      >
        <LocateFixed size={18} color={app_colors.white} />
      </TouchableOpacity>

      <View style={[lightPollutionMapScreenStyles.resultCard, { bottom: 20 + insets.bottom }]}>
        {
          searchLoading || (!displayedLocation && gpsLoading) ? (
            <View style={lightPollutionMapScreenStyles.resultCard.loading}>
              <ActivityIndicator color={app_colors.white} />
              <Text style={lightPollutionMapScreenStyles.resultCard.loadingText}>{t("result.loading")}</Text>
            </View>
          ) : !displayedLocation?.light_pollution ? (
            <Text style={lightPollutionMapScreenStyles.resultCard.noData}>{t("result.noData")}</Text>
          ) : (
            <>
              <View style={lightPollutionMapScreenStyles.resultCard.header}>
                <View style={[lightPollutionMapScreenStyles.resultCard.header.bortleBadge, { backgroundColor: bortleColor }]}>
                  <Text style={lightPollutionMapScreenStyles.resultCard.header.bortleBadge.value}>{displayedLocation.light_pollution.bortle}</Text>
                </View>
                <View style={lightPollutionMapScreenStyles.resultCard.header.texts}>
                  <Text style={lightPollutionMapScreenStyles.resultCard.header.texts.indicator}>
                    {getLightPollutionIndicatorLabel(displayedLocation.light_pollution.bortle)}
                  </Text>
                  <Text style={lightPollutionMapScreenStyles.resultCard.header.texts.sqm}>
                    {t("result.sqm", { value: displayedLocation.light_pollution.mpsas })}
                  </Text>
                </View>
              </View>

              <Text style={lightPollutionMapScreenStyles.resultCard.location}>
                {formatLocationLabel(displayedLocation, t("result.unknownLocation"))}
              </Text>

              <Text style={lightPollutionMapScreenStyles.resultCard.description}>
                {getLightPollutionIndicatorDescription(displayedLocation.light_pollution.bortle)}
              </Text>
            </>
          )
        }
      </View>
    </View>
  );
};

export default LightPollutionMapScreen;
