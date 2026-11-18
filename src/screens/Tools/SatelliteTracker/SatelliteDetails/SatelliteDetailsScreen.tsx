import { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams, useFocusEffect } from "expo-router";
import { useTranslation } from "react-i18next";
import { globalStyles } from "../../../../helpers/globalStyles";
import { app_colors, withOpacity } from "../../../../helpers/variables";
import { useLocation } from "../../../../context/LocationContext";
import { useAppUnits } from "../../../../hooks/useAppUnits";
import { formatLocaleNumber } from "../../../../helpers/format";
import { formatLatitude, formatLongitude } from "../../../../helpers/satellites/coordinates";
import { formatPassDayLabel } from "../../../../helpers/satellites/passLabel";
import { getSubPoint, getGroundTrack, parseTle, type SatrecHandle, type GroundTrackPoint, type SubPoint } from "../../../../helpers/satellites/propagation";
import { getNoradSatellite } from "../../../../helpers/api/satellites/norad";
import { getSatellitePasses, getSatelliteTle } from "../../../../helpers/api/satellites/tracking";
import { isOperationalStatus, resolveObjectTypeKey, resolveOpsStatusKey, resolvePassQualityKey } from "../../../../helpers/satellites/labels";
import { ScreenHeader } from "../../../../components/layout/ScreenHeader/ScreenHeader";
import SectionHeader from "../../../../components/layout/SectionHeader/SectionHeader";
import Badge from "../../../../components/Badges/Badge/Badge";
import ListCard from "../../../../components/cards/ListCard/ListCard";
import SatelliteGroundTrackMap from "../../../../components/charts/SatelliteGroundTrackMap/SatelliteGroundTrackMap";
import PassArcChart from "../../../../components/charts/PassArcChart/PassArcChart";
import SatellitePassRow from "../../../../components/Satellites/SatellitePassRow/SatellitePassRow";
import type { NoradSatellite } from "../../../../types/satellites/NoradSatellite";
import type { SatellitePass } from "../../../../types/satellites/SatelliteTracking";
import { satelliteDetailsScreenStyles } from "./SatelliteDetailsScreen.styles";
import ValueCard from "../../../../components/cards/ValueCard/ValueCard";
import { Orbit, Radio } from "lucide-react-native";
import InfoCard from "../../../../components/cards/InfoCard/InfoCard";

// Fenêtre de la trace au sol (voir SatelliteGroundTrackMap) et cadence de ses rafraîchissements —
// pas besoin de la recalculer chaque seconde comme la position live, sa forme ne bouge
// perceptiblement qu'à l'échelle de la minute.
const GROUND_TRACK_PAST_MINUTES = 45;
const GROUND_TRACK_FUTURE_MINUTES = 90;
const GROUND_TRACK_STEP_MINUTES = 1;
const GROUND_TRACK_REFRESH_MS = 60_000;
const LIVE_POSITION_REFRESH_MS = 1_000;

const SatelliteDetailsScreen = () => {
  const noradId = useLocalSearchParams().id as string;
  const { t, i18n } = useTranslation("tools/satelliteTracker");
  const { location } = useLocation();
  const { formatDate, formatDistanceKm } = useAppUnits();

  const [catalog, setCatalog] = useState<NoradSatellite | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [satrec, setSatrec] = useState<SatrecHandle | null>(null);
  const [livePosition, setLivePosition] = useState<SubPoint | null>(null);
  const [groundTrack, setGroundTrack] = useState<GroundTrackPoint[]>([]);
  const [passes, setPasses] = useState<SatellitePass[] | null>(null);

  // Catalogue + TLE : propre à cet écran, pas dérivable d'une liste déjà en mémoire (contrairement
  // aux lancements) — même logique que LauncherDetailsScreen/PadDetailsScreen.
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      const [catalogResult, tleResult] = await Promise.all([
        getNoradSatellite(noradId),
        getSatelliteTle({ noradId: Number(noradId) }),
      ]);
      setCatalog(catalogResult);
      setSatrec(tleResult ? parseTle(tleResult.tle) : null);
      setIsLoading(false);
    })();
  }, [noradId]);

  // Position live : propagée localement (SGP4) seconde par seconde tant que l'écran a le focus —
  // voir la note d'architecture de propagation.ts (pas de ré-appel réseau à cette cadence).
  useFocusEffect(
    useCallback(() => {
      if (!satrec) return;

      const update = () => setLivePosition(getSubPoint(satrec, new Date()));
      update();
      const interval = setInterval(update, LIVE_POSITION_REFRESH_MS);
      return () => clearInterval(interval);
    }, [satrec])
  );

  // Trace au sol : recalculée chaque minute (pas chaque seconde, sa forme ne change pas assez vite
  // pour le justifier) tant que l'écran a le focus.
  useFocusEffect(
    useCallback(() => {
      if (!satrec) return;

      const update = () => setGroundTrack(getGroundTrack(satrec, new Date(), {
        pastMinutes: GROUND_TRACK_PAST_MINUTES,
        futureMinutes: GROUND_TRACK_FUTURE_MINUTES,
        stepMinutes: GROUND_TRACK_STEP_MINUTES,
      }));
      update();
      const interval = setInterval(update, GROUND_TRACK_REFRESH_MS);
      return () => clearInterval(interval);
    }, [satrec])
  );

  // Passages : via l'API (N2YO), pas de calcul local — voir la doc de l'API et la décision prise
  // avec l'utilisateur (visibilité/magnitude trop complexes à recalculer soi-même de façon fiable).
  useEffect(() => {
    if (!location || !catalog) return;
    (async () => {
      const result = await getSatellitePasses({
        identifier: { noradId: catalog.norad_id },
        latitude: location.latitude,
        longitude: location.longitude,
        altitude: location.elevation ?? 0,
      });
      setPasses(result?.passes ?? []);
    })();
  }, [location?.latitude, location?.longitude, catalog?.norad_id]);

  const observer = useMemo(
    () => location ? { latitude: location.latitude, longitude: location.longitude, label: location.name } : null,
    [location?.latitude, location?.longitude, location?.name]
  );

  if (isLoading) {
    return (
      <View style={globalStyles.screen}>
        <ScreenHeader title={t("details.screenTitle")} main={false} />
        <ActivityIndicator size="large" color={app_colors.accent.main} style={satelliteDetailsScreenStyles.loader} />
      </View>
    );
  }

  if (!catalog) {
    return (
      <View style={globalStyles.screen}>
        <ScreenHeader title={t("details.screenTitle")} main={false} />
        <Text style={satelliteDetailsScreenStyles.notFound}>{t("details.notFound")}</Text>
      </View>
    );
  }

  const [nextPass, ...otherPasses] = passes ?? [];
  const revsPerDay = catalog.period ? 1440 / catalog.period : null;
  const hasOrbitSpread = catalog.perigee != null && catalog.apogee != null;
  const orbitSpread = hasOrbitSpread ? Math.round((catalog.apogee as number) - (catalog.perigee as number)) : null;

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={catalog.object_name} subtitle={t("details.subtitle", { noradId: catalog.norad_id })} compact />

      <ScrollView>
        <View style={satelliteDetailsScreenStyles.heroHeader}>
          <View style={satelliteDetailsScreenStyles.tags}>
            <Badge
              text={t(`opsStatus.${resolveOpsStatusKey(catalog.ops_status.label)}`)}
              backgroundColor={isOperationalStatus(catalog.ops_status.label) ? app_colors.yellow.main : app_colors.red.light}
              foregroundColor={isOperationalStatus(catalog.ops_status.label) ? app_colors.primary.main : app_colors.red.main}
            />
            {livePosition && (
              <Badge icon={Radio} text={t("screen.live")} backgroundColor="transparent" borderColor={app_colors.red.main} foregroundColor={app_colors.red.main} />
            )}
          </View>

          {groundTrack.length > 0 && (
            <SatelliteGroundTrackMap
              trackPoints={groundTrack}
              currentPosition={livePosition}
              observer={observer}
              embedded
            />
          )}

          <View style={satelliteDetailsScreenStyles.statsGrid}>
            <View style={satelliteDetailsScreenStyles.statsGrid.statsRow}>
              <ValueCard
                reverse
                title={t("details.stats.latitude")}
                value={livePosition ? formatLatitude(livePosition.latitude, i18n.language, t) : "--"}
                valueStyle={{color: app_colors.yellow.main}}
                titleStyle={{color: app_colors.white}}
                containerStyle={{backgroundColor: withOpacity(app_colors.white, 0.1)}}
              />
              <ValueCard
                reverse
                title={t("details.stats.longitude")}
                value={livePosition ? formatLongitude(livePosition.longitude, i18n.language, t) : "--"}
                valueStyle={{color: app_colors.yellow.main}}
                titleStyle={{color: app_colors.white}}
                containerStyle={{backgroundColor: withOpacity(app_colors.white, 0.1)}}
              />
            </View>
            <View style={satelliteDetailsScreenStyles.statsGrid.statsRow}>
              <ValueCard
                reverse
                title={t("details.stats.altitude")}
                value={livePosition ? formatDistanceKm(livePosition.altitude) : "--"}
                containerStyle={{backgroundColor: withOpacity(app_colors.white, 0.1)}}
                valueStyle={{color: app_colors.white}}
                titleStyle={{color: app_colors.white}}
              />
              <ValueCard
                reverse
                title={t("details.stats.speed")}
                value={livePosition ? `${formatLocaleNumber(livePosition.speedKmh, i18n.language, 0)} km/h` : "--"}
                containerStyle={{backgroundColor: withOpacity(app_colors.white, 0.1)}}
                valueStyle={{color: app_colors.white}}
                titleStyle={{color: app_colors.white}}
              />
            </View>
          </View>
        </View>

        <View style={globalStyles.content}>

          <View style={satelliteDetailsScreenStyles.section}>
            <SectionHeader title={t("details.passes.title")} subtitle={location?.name} />

            {passes === null && <ActivityIndicator color={app_colors.accent.main} />}

            {passes !== null && passes.length === 0 && (
              <Text style={satelliteDetailsScreenStyles.noPasses}>{t("details.passes.none")}</Text>
            )}

            {nextPass && (
              <View style={satelliteDetailsScreenStyles.nextPassCard}>
                <View style={satelliteDetailsScreenStyles.nextPassCard.topRow}>
                  <Text style={satelliteDetailsScreenStyles.nextPassCard.label}>{t("details.passes.nextVisible")}</Text>
                  <Badge
                    text={t(`passQuality.${resolvePassQualityKey(nextPass.quality)}`)}
                    backgroundColor={app_colors.primary.main}
                    foregroundColor={app_colors.white}
                  />
                </View>
                <Text style={satelliteDetailsScreenStyles.nextPassCard.title}>
                  {`${formatPassDayLabel(new Date(nextPass.startUTC * 1000), formatDate, t)} → ${formatDate(nextPass.endUTC * 1000).format("HH:mm")}`}
                </Text>
                <PassArcChart pass={nextPass} color={app_colors.primary.main} />
              </View>
            )}

            {otherPasses.map((pass, index) => (
              <SatellitePassRow key={`${pass.startUTC}-${index}`} pass={pass} />
            ))}
          </View>

          <View style={satelliteDetailsScreenStyles.section}>
            <SectionHeader title={t("details.orbit.title")} />

            <View style={satelliteDetailsScreenStyles.orbitRow}>
              <ValueCard
                reverse
                value={catalog.period != null ? t("details.orbit.periodValue", { value: formatLocaleNumber(catalog.period, i18n.language, 1) }) : "--"}
                title={revsPerDay != null ? t("details.orbit.revsPerDay", { value: formatLocaleNumber(revsPerDay, i18n.language, 1) }) : t("details.orbit.period")}
              />
              <ValueCard
                reverse
                value={catalog.inclination != null ? `${formatLocaleNumber(catalog.inclination, i18n.language, 1)}°` : "--"}
                title={t("details.orbit.inclination")}
              />
            </View>

            <ListCard
              items={[
                {
                  title: t("details.orbit.perigee"),
                  value: catalog.perigee != null ? formatDistanceKm(catalog.perigee) : "--",
                },
                {
                  title: t("details.orbit.apogee"),
                  value: catalog.apogee != null ? formatDistanceKm(catalog.apogee) : "--",
                },
                {
                  title: t("details.orbit.rcs"),
                  value: catalog.rcs != null ? `${formatLocaleNumber(catalog.rcs, i18n.language, 2)} m²` : t("details.orbit.rcsUnavailable"),
                },
              ]}
            />

            {orbitSpread != null && (
              <InfoCard title={t("details.orbit.title")} description={t("details.orbit.spreadNote", { value: orbitSpread })} icon={Orbit} />
            )}
          </View>

          <View style={satelliteDetailsScreenStyles.section}>
            <SectionHeader title={t("details.identity.title")} />
            <ListCard
              items={[
                { title: t("details.identity.type"), value: t(`objectType.${resolveObjectTypeKey(catalog.object_type.label)}`) },
                {
                  title: t("details.identity.launch"),
                  value: catalog.launch_date
                    ? `${formatDate(catalog.launch_date).format("DD/MM/YYYY")}${catalog.launch_site ? ` · ${catalog.launch_site}` : ""}`
                    : "--",
                },
                { title: t("details.identity.designator"), value: catalog.object_id ?? "--" },
                { title: t("details.identity.owner"), value: catalog.owner ?? "--" },
                ...(catalog.decay_date
                  ? [{ title: t("details.identity.decayDate"), value: formatDate(catalog.decay_date).format("DD/MM/YYYY") }]
                  : []),
                { title: t("details.identity.catalogUpdate"), value: formatDate(catalog.imported_at).format("DD/MM/YYYY HH:mm") },
              ]}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SatelliteDetailsScreen;
