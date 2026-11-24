import { useCallback, useState } from "react";
import { ActivityIndicator, InteractionManager, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { TriangleAlert } from "lucide-react-native";
import MapView, { PROVIDER_GOOGLE, Polygon, Polyline } from "react-native-maps";
import { globalStyles } from "../../../../helpers/globalStyles";
import { app_colors, withOpacity } from "../../../../helpers/variables";
import { formatLocaleNumber } from "../../../../helpers/format";
import { useLocation } from "../../../../context/LocationContext";
import { useAppUnits } from "../../../../hooks/useAppUnits";
import { ScreenHeader } from "../../../../components/layout/ScreenHeader/ScreenHeader";
import SectionHeader from "../../../../components/layout/SectionHeader/SectionHeader";
import ValueCard from "../../../../components/cards/ValueCard/ValueCard";
import ListCard from "../../../../components/cards/ListCard/ListCard";
import MapTargetMarker from "../../../../components/MapTargetMarker/MapTargetMarker";
import { getSatelliteTle } from "../../../../helpers/api/satellites/tracking";
import { parseTle } from "../../../../helpers/satellites/propagation";
import { refineSolarTransitAround, type SolarTransit } from "../../../../helpers/satellites/solarTransits";
import { getTransitGroundPath, type TransitGroundPath } from "../../../../helpers/satellites/transitGroundPath";
import TransitDiagram from "../components/TransitDiagram/TransitDiagram";
import { issTransitDetailsScreenStyles } from "./IssTransitDetailsScreen.styles";

// Calcule une région englobant la ligne de visibilité + l'observateur, avec une marge — pas de
// fitToCoordinates (qui demande une ref + un appel après montage) : plus simple à dériver
// directement, et suffisant pour une carte qui ne bouge pas une fois affichée.
const getGroundPathRegion = (groundPath: TransitGroundPath, observer: { latitude: number; longitude: number }) => {
  const points = [...groundPath.centerLine, ...groundPath.leftEdge, ...groundPath.rightEdge, observer];
  const latitudes = points.map((point) => point.latitude);
  const longitudes = points.map((point) => point.longitude);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLon = Math.min(...longitudes);
  const maxLon = Math.max(...longitudes);
  const latSpan = maxLat - minLat;
  const lonSpan = maxLon - minLon;

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLon + maxLon) / 2,
    latitudeDelta: Math.max(latSpan * 1.6, 0.3),
    longitudeDelta: Math.max(lonSpan * 1.6, 0.3),
  };
};

const IssTransitDetailsScreen = () => {
  const { id, lat, lon, elev } = useLocalSearchParams<{ id: string; lat?: string; lon?: string; elev?: string }>();
  const midDateMs = Number(id);
  const { t, i18n } = useTranslation("tools/issTransits");
  const { location } = useLocation();
  const { formatDate } = useAppUnits();

  const [transit, setTransit] = useState<SolarTransit | null>(null);
  const [groundPath, setGroundPath] = useState<TransitGroundPath | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Le lieu utilisé pour trouver ce transit depuis l'écran liste n'est pas forcément `location`
  // (contexte) : il peut s'agir d'un lieu choisi sur la carte pour cette recherche, transmis en
  // query params — voir handleTransitPress dans IssTransitsScreen.tsx. Sans ces params (lien direct,
  // ancien historique de navigation), on retombe sur le lieu courant de l'app.
  const observer = lat && lon
    ? { latitude: Number(lat), longitude: Number(lon), elevation: elev ? Number(elev) : 0 }
    : location
      ? { latitude: location.latitude, longitude: location.longitude, elevation: location.elevation ?? 0 }
      : null;

  // Ne refait que l'affinage (étapes 3-4, quelques secondes autour de l'instant déjà connu), pas la
  // recherche complète sur plusieurs jours — voir refineSolarTransitAround dans solarTransits.ts.
  useFocusEffect(
    useCallback(() => {
      if (!observer || !Number.isFinite(midDateMs)) return;
      let cancelled = false;
      setIsLoading(true);

      const task = InteractionManager.runAfterInteractions(async () => {
        const tle = await getSatelliteTle({ name: "ISS (ZARYA)" });
        if (cancelled) return;
        const satrec = tle ? parseTle(tle.tle) : null;
        if (!satrec) {
          setTransit(null);
          setGroundPath(null);
          setIsLoading(false);
          return;
        }

        const refined = refineSolarTransitAround(satrec, observer, new Date(midDateMs));
        setTransit(refined);
        setGroundPath(refined ? getTransitGroundPath(satrec, refined) : null);
        setIsLoading(false);
      });

      return () => {
        cancelled = true;
        task.cancel();
      };
    }, [observer?.latitude, observer?.longitude, observer?.elevation, midDateMs])
  );

  if (isLoading) {
    return (
      <View style={globalStyles.screen}>
        <ScreenHeader title={t("details.screenTitle")} main={false} />
        <ActivityIndicator size="large" color={app_colors.accent.main} style={issTransitDetailsScreenStyles.loader} />
      </View>
    );
  }

  if (!transit) {
    return (
      <View style={globalStyles.screen}>
        <ScreenHeader title={t("details.screenTitle")} main={false} />
        <Text style={issTransitDetailsScreenStyles.notFound}>{t("details.notFound")}</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader
        title={formatDate(transit.midDate).format("dddd DD MMMM YYYY")}
        subtitle={formatDate(transit.midDate).format("HH:mm:ss")}
        compact
      />

      <ScrollView>
        <View style={issTransitDetailsScreenStyles.heroHeader}>
          {/* accent.light (et non la couleur primary.main par défaut) : le fond de ce bloc héros est
              déjà primary.main, le trait doit donc contraster dessus plutôt que s'y fondre sur sa
              portion prolongée hors du disque solaire. */}
          <TransitDiagram transit={transit} size={220} lineColor={app_colors.accent.light} />
        </View>

        <View style={globalStyles.content}>
          <View style={issTransitDetailsScreenStyles.section}>
            <View style={issTransitDetailsScreenStyles.statsGrid}>
              <View style={issTransitDetailsScreenStyles.statsGrid.statsRow}>
                <ValueCard
                  reverse
                  title={t("details.stats.angularSize")}
                  value={`${formatLocaleNumber(transit.angularSizeArcsec, i18n.language, 1)}″`}
                />
                <ValueCard
                  reverse
                  title={t("details.stats.position")}
                  value={`${transit.azimuth.toFixed(0)}° / ${transit.altitude.toFixed(0)}°`}
                />
              </View>
              <View style={issTransitDetailsScreenStyles.statsGrid.statsRow}>
                <ValueCard
                  reverse
                  title={t("details.stats.duration")}
                  value={t("details.stats.durationValue", { value: formatLocaleNumber(transit.durationMs / 1000, i18n.language, 1) })}
                />
                <ValueCard
                  reverse
                  title={t("details.stats.missDistance")}
                  value={`${formatLocaleNumber(transit.missDistanceArcmin, i18n.language, 1)}′`}
                />
              </View>
            </View>
          </View>

          <View style={issTransitDetailsScreenStyles.warningCard}>
            <TriangleAlert size={18} color={app_colors.red.main} />
            <Text style={issTransitDetailsScreenStyles.warningCard.text}>{t("details.eyeSafety")}</Text>
          </View>

          {groundPath && observer && (
            <View style={issTransitDetailsScreenStyles.section}>
              <SectionHeader title={t("details.groundPath.title")} />
              <Text style={issTransitDetailsScreenStyles.groundPathHint}>{t("details.groundPath.hint")}</Text>

              <View style={issTransitDetailsScreenStyles.mapContainer}>
                <MapView
                  style={issTransitDetailsScreenStyles.mapContainer.map}
                  provider={PROVIDER_GOOGLE}
                  initialRegion={getGroundPathRegion(groundPath, observer)}
                  mapType="satellite"
                  rotateEnabled={false}
                >
                  <Polygon
                    coordinates={[...groundPath.leftEdge, ...[...groundPath.rightEdge].reverse()]}
                    fillColor={withOpacity(app_colors.red.main, 0.35)}
                    strokeColor="transparent"
                  />
                  <Polyline coordinates={groundPath.centerLine} strokeColor={app_colors.red.main} strokeWidth={2} lineDashPattern={[6, 4]} />
                  <MapTargetMarker coordinate={{ latitude: observer.latitude, longitude: observer.longitude }} color={app_colors.accent.main} />
                </MapView>
              </View>
            </View>
          )}

          <View style={issTransitDetailsScreenStyles.section}>
            <SectionHeader title={t("details.technical.title")} />
            <ListCard
              items={[
                { title: t("details.technical.chord"), value: `${formatLocaleNumber(transit.chordArcmin, i18n.language, 1)}′` },
                { title: t("details.technical.sunRadius"), value: `${formatLocaleNumber(transit.sunAngularRadiusArcmin, i18n.language, 1)}′` },
                { title: t("details.technical.midTime"), value: formatDate(transit.midDate).format("HH:mm:ss") },
              ]}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default IssTransitDetailsScreen;
