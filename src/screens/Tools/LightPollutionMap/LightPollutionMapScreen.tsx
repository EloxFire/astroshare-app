import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { PROVIDER_GOOGLE, UrlTile, type MapPressEvent } from "react-native-maps";
import { ChevronLeft, LocateFixed, Search, X } from "lucide-react-native";
import { ScreenHeader } from "../../../components/layout/ScreenHeader/ScreenHeader";
import { InputWithIcon } from "../../../components/inputs/InputWithIcon/InputWithIcon";
import LockedFeatureCard from "../../../components/cards/LockedFeatureCard/LockedFeatureCard";
import Badge from "../../../components/Badges/Badge/Badge";
import BortleScaleBar from "./components/BortleScaleBar/BortleScaleBar";
import OpacitySlider from "./components/OpacitySlider/OpacitySlider";
import MapTargetMarker from "../../../components/MapTargetMarker/MapTargetMarker";
import { useAuth } from "../../../context/AuthContext";
import { useLocation } from "../../../context/LocationContext";
import { isProUser } from "../../../helpers/auth/subscription";
import { formatLocationLabel } from "../../../helpers/format";
import { getLightPollutionIndicatorDescription, getLightPollutionIndicatorLabel } from "../../../helpers/api/geocoding/geocoding";
import { getLightPollutionLimitingMagnitude, isMilkyWayVisible } from "../../../helpers/lightPollution/lightPollution";
import { DARK_MAP_STYLE } from "../../../helpers/map/darkMapStyle";
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
// ce niveau de zoom — maximumNativeZ agrandit la dernière tuile disponible plutôt que de redemander
// des tuiles qui n'existent pas (la couche disparaissait en zoomant plus loin). Pas pu vérifier en
// direct depuis cet environnement (hôte injoignable d'ici) : à ajuster si le serveur va en fait plus
// loin. Une seule variante de tuiles disponible côté serveur (confirmé) : pas d'alternative de style
// à proposer ici.
const LIGHT_POLLUTION_TILES_URL = "https://bucket.astroshare.fr/lightpollution/tiles/{z}/{x}/{y}.webp";
const LIGHT_POLLUTION_TILES_MAX_ZOOM = 8;
const DEFAULT_TILES_OPACITY = 0.75;

const LightPollutionMapScreen = () => {
  const { t } = useTranslation("tools/lightPollutionMap");
  const { authUser } = useAuth();
  const userIsPro = isProUser(authUser);
  const insets = useSafeAreaInsets();

  const { location, searchLoading, fetchLocation } = useLocation();
  const [tileOpacity, setTileOpacity] = useState(DEFAULT_TILES_OPACITY);

  // Pas de sélection au départ : la carte s'ouvre neutre (pas de marqueur ni de carte de
  // résultat), seule une recherche, un appui sur la carte ou "ma position" en choisit une.
  const [displayedLocation, setDisplayedLocation] = useState<GpsLocation | null>(null);
  const [query, setQuery] = useState("");
  const [notFound, setNotFound] = useState(false);

  const mapRef = useRef<MapView>(null);
  const shownCoordinatesRef = useRef<{ latitude: number; longitude: number } | null>(null);
  const hasCenteredOnStartRef = useRef(false);

  // Centre la carte sur la position "effective" de l'app (observatoire actif ou GPS) dès qu'elle
  // est connue, une seule fois au démarrage — uniquement pour orienter la vue, sans en faire une
  // sélection (pas de marqueur ni de carte de résultat tant que rien n'a été choisi explicitement).
  useEffect(() => {
    if (hasCenteredOnStartRef.current || !location) return;
    hasCenteredOnStartRef.current = true;
    shownCoordinatesRef.current = { latitude: location.latitude, longitude: location.longitude };
    mapRef.current?.animateToRegion({
      latitude: location.latitude,
      longitude: location.longitude,
      latitudeDelta: REGION_DELTA,
      longitudeDelta: REGION_DELTA,
    });
  }, [location]);

  // Recentre la carte quand le lieu sélectionné change vraiment (recherche, appui sur la carte,
  // "ma position") — même principe que LocationMapCard : initialRegion n'agit qu'au premier rendu.
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

  const handleClearSelection = () => {
    setNotFound(false);
    setQuery("");
    setDisplayedLocation(null);
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

  // Carte de départ : la position "effective" de l'app si déjà connue au premier rendu, sinon
  // Paris — indépendant de la sélection (voir l'effet de centrage ci-dessus pour le cas où elle
  // arrive après coup).
  const initialMapRegion = {
    latitude: location?.latitude ?? DEFAULT_REGION.latitude,
    longitude: location?.longitude ?? DEFAULT_REGION.longitude,
    latitudeDelta: REGION_DELTA,
    longitudeDelta: REGION_DELTA,
  };

  const bortle = displayedLocation?.light_pollution?.bortle;
  const bortleColor = bortle ? app_colors.bortleScale[bortle as keyof typeof app_colors.bortleScale] : app_colors.yellow.main;
  const locationLabel = displayedLocation ? formatLocationLabel(displayedLocation, t("result.unknownLocation")) : "";
  const showResultCard = displayedLocation !== null || searchLoading;

  return (
    <View style={lightPollutionMapScreenStyles.screen}>
      <MapView
        ref={mapRef}
        style={lightPollutionMapScreenStyles.map}
        provider={PROVIDER_GOOGLE}
        mapType="standard"
        customMapStyle={DARK_MAP_STYLE}
        initialRegion={initialMapRegion}
        rotateEnabled={false}
        pitchEnabled={false}
        onPress={handleMapPress}
      >
        <UrlTile
          urlTemplate={LIGHT_POLLUTION_TILES_URL}
          // maximumZ (pas utilisé ici) arrête complètement l'affichage de la couche au-delà de ce
          // zoom. maximumNativeZ, lui, continue de demander la dernière tuile disponible et
          // l'agrandit (légèrement floue, mais toujours visible) au lieu de faire disparaître la
          // couche en zoomant plus que la résolution d'origine de l'atlas.
          maximumNativeZ={LIGHT_POLLUTION_TILES_MAX_ZOOM}
          tileSize={256}
          zIndex={1}
          opacity={tileOpacity}
          // Les tuiles tombaient au mauvais endroit : très probablement une pyramide TMS (origine
          // en bas à gauche, typique d'un export gdal2tiles.py sans --xyz) plutôt que XYZ (origine
          // en haut à gauche, attendu par défaut). flipY convertit l'index Y demandé.
          flipY
        />

        {displayedLocation && (
          // key forcé sur la couleur : react-native-maps convertit un Marker à enfants personnalisés
          // en bitmap natif une seule fois (tracksViewChanges ne suit pas en continu, trop coûteux) —
          // la position (coordinate, prop native à part) suit bien les changements, mais pas la
          // couleur de l'intérieur de ce bitmap. Remonter le composant force une nouvelle capture.
          <MapTargetMarker
            key={bortleColor}
            coordinate={{ latitude: displayedLocation.latitude, longitude: displayedLocation.longitude }}
            color={bortleColor}
          />
        )}
      </MapView>

      <View style={[lightPollutionMapScreenStyles.topBar, { top: 10 + insets.top }]}>
        <TouchableOpacity style={lightPollutionMapScreenStyles.roundButton} onPress={() => router.back()}>
          <ChevronLeft size={22} color={app_colors.primary.main} />
        </TouchableOpacity>

        <InputWithIcon
          fill
          icon={Search}
          placeholder={t("search.placeholder")}
          value={query}
          onChangeText={(text) => { setQuery(text); setNotFound(false); }}
          action={handleSearch}
        />

        <TouchableOpacity
          style={lightPollutionMapScreenStyles.roundButton}
          onPress={handleUseCurrentLocation}
        >
          <LocateFixed size={18} color={app_colors.primary.main} />
        </TouchableOpacity>
      </View>

      {notFound && (
        <Text style={[lightPollutionMapScreenStyles.searchError, { top: 58 + insets.top }]}>{t("search.notFound")}</Text>
      )}

      <View style={[lightPollutionMapScreenStyles.legendRow, { top: 68 + insets.top }]}>
        <View style={lightPollutionMapScreenStyles.legendRow.row}>
          <Text style={lightPollutionMapScreenStyles.legendRow.label}>{t("legend.darkSky")}</Text>
          <View style={lightPollutionMapScreenStyles.legendRow.bar}>
            <BortleScaleBar height={6} />
          </View>
          <Text style={lightPollutionMapScreenStyles.legendRow.label}>{t("legend.city")}</Text>
        </View>

        <View style={globalStyles.separator} />

        <View style={lightPollutionMapScreenStyles.legendRow.row}>
          <Text style={lightPollutionMapScreenStyles.legendRow.label}>{t("legend.opacity")}</Text>
          <OpacitySlider value={tileOpacity} onChange={setTileOpacity} />
          <Text style={lightPollutionMapScreenStyles.legendRow.percentage}>{Math.round(tileOpacity * 100)}%</Text>
        </View>
      </View>

      {showResultCard && (
        <View style={lightPollutionMapScreenStyles.resultCard}>
          <TouchableOpacity style={lightPollutionMapScreenStyles.resultCard.closeButton} onPress={handleClearSelection}>
            <X size={16} color={app_colors.primary.main} />
          </TouchableOpacity>

          {
            searchLoading ? (
              <View style={lightPollutionMapScreenStyles.resultCard.loading}>
                <ActivityIndicator color={app_colors.accent.main} />
                <Text style={lightPollutionMapScreenStyles.resultCard.loadingText}>{t("result.loading")}</Text>
              </View>
            ) : !displayedLocation?.light_pollution ? (
              <Text style={lightPollutionMapScreenStyles.resultCard.noData}>{t("result.noData")}</Text>
            ) : (
              <>
                <View style={lightPollutionMapScreenStyles.resultCard.header}>
                  <View style={lightPollutionMapScreenStyles.resultCard.header.bortleBadge}>
                    <Text style={lightPollutionMapScreenStyles.resultCard.header.bortleBadge.value}>{displayedLocation.light_pollution.bortle}</Text>
                  </View>
                  <View style={lightPollutionMapScreenStyles.resultCard.header.texts}>
                    <Text style={lightPollutionMapScreenStyles.resultCard.header.texts.location} numberOfLines={1}>
                      {locationLabel}
                    </Text>
                    <Text style={lightPollutionMapScreenStyles.resultCard.header.texts.indicator}>
                      {getLightPollutionIndicatorLabel(displayedLocation.light_pollution.bortle)}
                    </Text>
                    <Text style={lightPollutionMapScreenStyles.resultCard.header.texts.sqm}>
                      {t("result.sqm", { value: displayedLocation.light_pollution.mpsas })}
                    </Text>
                  </View>
                </View>

                <View style={lightPollutionMapScreenStyles.resultCard.scaleSection}>
                  <BortleScaleBar height={8} currentBortle={displayedLocation.light_pollution.bortle} />
                  <View style={lightPollutionMapScreenStyles.resultCard.scaleSection.labels}>
                    <Text style={lightPollutionMapScreenStyles.resultCard.scaleSection.labels.text}>{t("result.scaleLow")}</Text>
                    <Text style={lightPollutionMapScreenStyles.resultCard.scaleSection.labels.text}>{t("result.scaleHigh")}</Text>
                  </View>
                </View>

                <Text style={lightPollutionMapScreenStyles.resultCard.description}>
                  {getLightPollutionIndicatorDescription(displayedLocation.light_pollution.bortle)}
                </Text>

                <View style={lightPollutionMapScreenStyles.resultCard.badgesRow}>
                  <Badge
                    text={isMilkyWayVisible(displayedLocation.light_pollution.bortle) ? t("result.milkyWayVisible") : t("result.milkyWayInvisible")}
                    backgroundColor={app_colors.accent.light}
                    foregroundColor={app_colors.primary.main}
                  />
                  <Badge
                    text={t("result.limitingMagnitude", { value: getLightPollutionLimitingMagnitude(displayedLocation.light_pollution.bortle) })}
                    backgroundColor={app_colors.accent.light}
                    foregroundColor={app_colors.primary.main}
                  />
                </View>
              </>
            )
          }
        </View>
      )}
    </View>
  );
};

export default LightPollutionMapScreen;
