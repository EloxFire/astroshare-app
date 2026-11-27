import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type MapView from "react-native-maps";
import { Bookmark, ChevronLeft, Eye, Search } from "lucide-react-native";
import { app_colors } from "../../../../helpers/variables";
import { formatLatLon, formatLocaleNumber, formatUtcOffsetLabel } from "../../../../helpers/format";
import { useAppUnits } from "../../../../hooks/useAppUnits";
import { useLocation } from "../../../../context/LocationContext";
import { InputWithIcon } from "../../../../components/inputs/InputWithIcon/InputWithIcon";
import MapTargetMarker from "../../../../components/MapTargetMarker/MapTargetMarker";
import { getLocalSolarEclipse, getSolarEclipses } from "../../../../helpers/api/eclipses/eclipses";
import { getSolarEclipseShortTypeLabelKey, getSolarEclipseTypeLabelKey, getSolarEclipseVariant } from "../../../../helpers/eclipses/eclipseLabels";
import { getAltitudeVisibilityRating } from "../../../../helpers/eclipses/visibilityRating";
import { distanceToCentralLineKm } from "../../../../helpers/eclipses/distanceToTotality";
import { clampMapRegionLatitude } from "../../../../helpers/map/mapRegion";
import type { SolarEclipse, SolarEclipseEvent } from "../../../../types/eclipses/Eclipse";
import type { EclipseLineStyle, EclipsePathStyle } from "../components/EclipseVisibilityMap/EclipseVisibilityMap";
import EclipseVisibilityMap from "../components/EclipseVisibilityMap/EclipseVisibilityMap";
import EclipseWeatherForecast from "../components/EclipseWeatherForecast/EclipseWeatherForecast";
import EclipseTypeIcon from "../components/EclipseTypeIcon/EclipseTypeIcon";
import EclipseCircumstancesSheet from "../components/EclipseCircumstancesSheet/EclipseCircumstancesSheet";
import MoonPathDiagram from "../components/MoonPathDiagram/MoonPathDiagram";
import NearestVisiblePoint from "../components/NearestVisiblePoint/NearestVisiblePoint";
import { solarEclipseDetailsScreenStyles as styles } from "./SolarEclipseDetailsScreen.styles";
import InfoCard from "../../../../components/cards/InfoCard/InfoCard";

const SOLAR_LINE_STYLES: Record<string, EclipseLineStyle> = {
  beginSunRise: { color: app_colors.green.main },
  endSunRise: { color: app_colors.green.main },
  beginSunSet: { color: app_colors.red.main },
  endSunSet: { color: app_colors.red.main },
  limitNorth: { color: app_colors.yellow.main },
  limitSouth: { color: app_colors.yellow.main },
  maximumSunRise: { color: "#FFA500" },
  maximumSunSet: { color: "#FFA500" },
  central: { color: app_colors.white, dashed: true },
};

const SOLAR_PATH_STYLES: Record<string, EclipsePathStyle> = {
  umbra: { fillColor: app_colors.yellow.main, fillOpacity: 0.35, strokeColor: app_colors.yellow.main, strokeWidth: 2 },
  penumbra: { fillColor: "#5a7bb8", fillOpacity: 0.12, strokeColor: "#5a7bb8", strokeWidth: 1 },
};

const SolarEclipseDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const calendarDate = id.split(":")[1];
  const { t, i18n } = useTranslation("tools/eclipses");
  const { fetchLocation } = useLocation();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const { formatDate } = useAppUnits();

  const [eclipse, setEclipse] = useState<SolarEclipse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedLocationName, setSelectedLocationName] = useState("");
  const [localCircumstances, setLocalCircumstances] = useState<SolarEclipse | null>(null);
  const [eclipseNotVisible, setEclipseNotVisible] = useState(false);
  const [isLoadingCircumstances, setIsLoadingCircumstances] = useState(false);
  const [sheetMinimized, setSheetMinimized] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    (async () => {
      const year = Number(calendarDate.slice(0, 4));
      const list = await getSolarEclipses(year);
      if (cancelled) return;
      setEclipse(list?.find((candidate) => candidate.calendarDate === calendarDate) ?? null);
      setIsLoading(false);
    })();
    return () => { cancelled = true; };
  }, [calendarDate]);

  const fetchCircumstancesAt = async (latitude: number, longitude: number, name?: string) => {
    if (!eclipse) return;
    setIsLoadingCircumstances(true);
    setSelectedLocation({ latitude, longitude });
    setSheetMinimized(false);

    let resolvedName = name;
    if (!resolvedName) {
      const locationResult = await fetchLocation(`${latitude}::${longitude}`);
      resolvedName = locationResult?.local_names?.[i18n.language] || locationResult?.name || "";
    }
    setSelectedLocationName(resolvedName ?? "");

    const local = await getLocalSolarEclipse(eclipse.calendarDate, latitude, longitude);
    setLocalCircumstances(local);
    setEclipseNotVisible(!local);
    setIsLoadingCircumstances(false);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    const result = await fetchLocation(searchQuery.trim());
    setIsSearching(false);
    if (!result) return;
    mapRef.current?.animateToRegion({ latitude: result.latitude, longitude: result.longitude, latitudeDelta: 4, longitudeDelta: 4 });
    setShowSearch(false);
    setSearchQuery("");
    await fetchCircumstancesAt(result.latitude, result.longitude, result.name);
  };

  const clearSelection = () => {
    setSelectedLocation(null);
    setSelectedLocationName("");
    setLocalCircumstances(null);
    setEclipseNotVisible(false);
  };

  if (isLoading) {
    return (
      <View style={[styles.screen, styles.loaderOverlay]}>
        <ActivityIndicator size="large" color={app_colors.white} />
      </View>
    );
  }

  if (!eclipse) {
    return (
      <View style={[styles.screen, styles.loaderOverlay]}>
        <Text style={[styles.hint, { color: app_colors.white }]}>{t("details.notFound")}</Text>
      </View>
    );
  }

  const greatest = eclipse.events.greatest ?? eclipse.events.P1 ?? eclipse.events.P4;
  const centralLineFeature = eclipse.visibilityLines?.features.find((feature) => feature.properties.name === "central");
  const hasCentralLine = !!centralLineFeature;

  const initialCenterCoords = greatest?.location?.geometry.coordinates;
  const { latitude: initialLatitude, latitudeDelta: initialLatitudeDelta } = clampMapRegionLatitude(
    initialCenterCoords ? initialCenterCoords[1] : 20,
    60
  );
  const initialRegion = {
    latitude: initialLatitude,
    longitude: initialCenterCoords ? initialCenterCoords[0] : 0,
    latitudeDelta: initialLatitudeDelta,
    longitudeDelta: 60,
  };

  const referenceEvent = localCircumstances?.events.greatest ?? localCircumstances?.events.P1 ?? localCircumstances?.events.P4;
  const visibilityRating = referenceEvent?.Sun?.elevation != null && referenceEvent?.Sun?.azimuth != null
    ? getAltitudeVisibilityRating(referenceEvent.Sun.elevation, referenceEvent.Sun.azimuth)
    : null;

  const localVariant = localCircumstances ? getSolarEclipseVariant(localCircumstances.type) : null;
  const headerPercent = localCircumstances
    ? Math.round(localCircumstances.obscuration ?? localCircumstances.magnitude * 100)
    : null;
  const distanceToTotalityKm = localVariant === "partial" && selectedLocation
    ? distanceToCentralLineKm(selectedLocation.latitude, selectedLocation.longitude, eclipse.visibilityLines)
    : null;

  const summaryTiles: { key: string; labelKey: string; event: SolarEclipseEvent; highlighted?: boolean }[] = localCircumstances
    ? [
        localCircumstances.events.P1 && { key: "start", labelKey: "details.header.tile.start", event: localCircumstances.events.P1 },
        localCircumstances.events.greatest && { key: "maximum", labelKey: "details.header.tile.maximum", event: localCircumstances.events.greatest, highlighted: true },
        localCircumstances.events.P4 && { key: "end", labelKey: "details.header.tile.end", event: localCircumstances.events.P4 },
      ].filter((tile): tile is NonNullable<typeof tile> => !!tile)
    : [];

  const headerContent = localCircumstances && selectedLocation ? (
    <View style={styles.header}>
      <View style={styles.header.iconRing}>
        <EclipseTypeIcon kind="solar" variant={localVariant!} size={44} />
      </View>
      <View style={styles.header.texts}>
        <Text style={styles.header.location} numberOfLines={1}>
          {selectedLocationName ? `${selectedLocationName} · ` : ""}{formatLatLon(selectedLocation.latitude, selectedLocation.longitude, i18n.language)}
        </Text>
        <Text style={styles.header.title}>
          {t(getSolarEclipseShortTypeLabelKey(localCircumstances.type))}
          {headerPercent != null ? ` · ${headerPercent} %` : ""}
        </Text>
      </View>
    </View>
  ) : (
    <Text style={styles.header.location} numberOfLines={1}>{selectedLocationName || t("details.unnamedLocation")}</Text>
  );

  const showOverlayPanel = !!selectedLocation;

  return (
    <View style={styles.screen}>
      <EclipseVisibilityMap
        maskOpacity={0.2}
        ref={mapRef}
        visibilityLines={eclipse.visibilityLines}
        visibilityPaths={eclipse.visibilityPaths}
        lineStyles={SOLAR_LINE_STYLES}
        pathStyles={SOLAR_PATH_STYLES}
        maskHoleFeatureNames={["penumbra"]}
        initialRegion={initialRegion}
        onPress={(coordinate) => fetchCircumstancesAt(coordinate.latitude, coordinate.longitude)}
      >
        {selectedLocation && <MapTargetMarker coordinate={selectedLocation} />}
      </EclipseVisibilityMap>

      <View style={[styles.topBar, { top: 10 + insets.top }]}>
        <TouchableOpacity style={styles.roundButton} onPress={() => router.back()}>
          <ChevronLeft size={22} color={app_colors.primary.main} />
        </TouchableOpacity>
        {!showSearch && (
          <TouchableOpacity style={styles.roundButton} onPress={() => setShowSearch(true)}>
            <Search size={18} color={app_colors.primary.main} />
          </TouchableOpacity>
        )}
        {showSearch && (
          <InputWithIcon
            fill
            icon={Search}
            placeholder={t("details.searchPlaceholder")}
            value={searchQuery}
            onChangeText={setSearchQuery}
            action={handleSearch}
          />
        )}
      </View>


      {showOverlayPanel ? (
        <EclipseCircumstancesSheet
          minimized={sheetMinimized}
          onExpand={() => setSheetMinimized(false)}
          onMinimize={() => setSheetMinimized(true)}
          onClose={clearSelection}
          header={headerContent}
          bottomInset={insets.bottom}
        >
          {isLoadingCircumstances ? (
            <ActivityIndicator color={app_colors.accent.main} />
          ) : eclipseNotVisible ? (
            <>
              <Text style={styles.hint}>{t("details.notVisibleHere")}</Text>
              {selectedLocation && (
                <NearestVisiblePoint
                  origin={selectedLocation}
                  checkVisible={async (latitude, longitude) => !!(await getLocalSolarEclipse(eclipse.calendarDate, latitude, longitude))}
                  onSelect={(latitude, longitude, name) => fetchCircumstancesAt(latitude, longitude, name)}
                />
              )}
            </>
          ) : localCircumstances && selectedLocation ? (
            <>
              {distanceToTotalityKm != null && (
                <View style={styles.pill}>
                  <Text style={styles.pill.text}>{t("details.header.distanceToTotality", { distance: Math.round(distanceToTotalityKm) })}</Text>
                </View>
              )}

              {summaryTiles.length > 0 && (
                <View style={styles.tilesRow}>
                  {summaryTiles.map((tile) => (
                    <View key={tile.key} style={[styles.tilesRow.tile, tile.highlighted && styles.tilesRow.tile.highlighted]}>
                      <Text style={styles.tilesRow.tile.label}>{t(tile.labelKey)}</Text>
                      <Text style={styles.tilesRow.tile.value}>{formatDate(new Date(`${tile.event.date}Z`)).format("HH:mm")}</Text>
                    </View>
                  ))}
                </View>
              )}

              {hasCentralLine && localCircumstances.events.U1 && localCircumstances.events.U4 && (
                <Text style={styles.totalityWindowText}>
                  {t("details.header.totalityWindow", {
                    start: formatDate(new Date(`${localCircumstances.events.U1.date}Z`)).format("HH:mm:ss"),
                    end: formatDate(new Date(`${localCircumstances.events.U4.date}Z`)).format("HH:mm:ss"),
                  })}
                </Text>
              )}

              <View style={styles.metaRow}>
                <Text style={styles.metaRow.altitude}>
                  {referenceEvent?.Sun?.elevation != null ? t("details.header.sunAltitudeAtMax", { altitude: Math.round(referenceEvent.Sun.elevation) }) : ""}
                </Text>
                <Text style={styles.metaRow.time}>
                  {referenceEvent ? `${t("details.header.localTime")} · ${formatUtcOffsetLabel(formatDate, `${referenceEvent.date}Z`)}` : ""}
                </Text>
              </View>

              <View style={styles.statsGrid}>
                <ValueTile label={t("details.stats.magnitude")} value={formatLocaleNumber(localCircumstances.magnitude, i18n.language, 2)} />
                {localCircumstances.obscuration != null && (
                  <ValueTile label={t("details.stats.obscuration")} value={`${formatLocaleNumber(localCircumstances.obscuration, i18n.language, 0)}%`} />
                )}
                <ValueTile label={t("details.stats.duration")} value={localCircumstances.duration.penumbral} />
                {hasCentralLine && localCircumstances.duration.umbral && (
                  <ValueTile label={t("details.stats.totalDuration")} value={localCircumstances.duration.umbral} />
                )}
              </View>

              {visibilityRating && (
                <View style={styles.visibilityBadge}>
                  <Text style={styles.visibilityBadge.text}>
                    {t(`details.visibilitySolar.${visibilityRating.level}`, { altitude: visibilityRating.altitudeDeg.toFixed(0) })}
                  </Text>
                </View>
              )}

              {referenceEvent && (
                <EclipseWeatherForecast
                  latitude={selectedLocation.latitude}
                  longitude={selectedLocation.longitude}
                  eventDateIsoNoZ={referenceEvent.date}
                />
              )}

              <MoonPathDiagram eclipse={localCircumstances} />

              <View style={styles.ctaRow}>
                <TouchableOpacity style={styles.ctaRow.primary} onPress={() => {}}>
                  <Text style={styles.ctaRow.primary.text}>{t("details.notifyMe")}</Text>
                </TouchableOpacity>
                {/* TODO : enregistrer ce lieu (favoris) — bouton de façade seulement pour l'instant. */}
                <TouchableOpacity style={styles.ctaRow.secondary} onPress={() => {}}>
                  <Bookmark size={18} color={app_colors.primary.main} />
                </TouchableOpacity>
              </View>

              <View style={styles.safetyBanner}>
                <Eye size={18} color={app_colors.white} />
                <Text style={styles.safetyBanner.text}>{t("details.eyeSafety")}</Text>
              </View>
            </>
          ) : (
            <Text style={styles.hint}>{t("details.tapHint")}</Text>
          )}
        </EclipseCircumstancesSheet>
      ) : (
        <View style={styles.idleCard}>
          <Text style={styles.idleCard.type}>{t(getSolarEclipseTypeLabelKey(eclipse.type))}</Text>
          <Text style={styles.hint}>{t("details.tapHint")}</Text>
        </View>
      )}
    </View>
  );
};

const ValueTile = ({ label, value }: { label: string; value: string }) => (
  <View style={{ minWidth: "30%" }}>
    <Text style={{ fontFamily: "DMMonoRegular", fontSize: 9.5, color: app_colors.primary.medium, textTransform: "uppercase" }}>{label}</Text>
    <Text style={{ fontFamily: "ZTNatureBold", fontSize: 15, color: app_colors.primary.main }}>{value}</Text>
  </View>
);

export default SolarEclipseDetailsScreen;
