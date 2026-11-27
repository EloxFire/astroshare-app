import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import type MapView from "react-native-maps";
import { CalendarPlus, ChevronLeft, Search } from "lucide-react-native";
import { app_colors } from "../../../../helpers/variables";
import { formatLatLon, formatLocaleNumber, formatUtcOffsetLabel } from "../../../../helpers/format";
import { useAppUnits } from "../../../../hooks/useAppUnits";
import { useLocation } from "../../../../context/LocationContext";
import { InputWithIcon } from "../../../../components/inputs/InputWithIcon/InputWithIcon";
import MapTargetMarker from "../../../../components/MapTargetMarker/MapTargetMarker";
import { getLunarEclipses } from "../../../../helpers/api/eclipses/eclipses";
import { getLunarEclipseShortTypeLabelKey, getLunarEclipseTypeLabelKey, getLunarEclipseVariant } from "../../../../helpers/eclipses/eclipseLabels";
import { getLunarContactsVisibility, isLunarEclipseVisibleFrom, type LunarContactVisibility } from "../../../../helpers/eclipses/lunarVisibility";
import { getAltitudeVisibilityRating } from "../../../../helpers/eclipses/visibilityRating";
import { clampMapRegionLatitude } from "../../../../helpers/map/mapRegion";
import type { LunarEclipse, LunarEclipseEventKey } from "../../../../types/eclipses/Eclipse";
import type { EclipseLineStyle, EclipsePathStyle } from "../components/EclipseVisibilityMap/EclipseVisibilityMap";
import EclipseVisibilityMap from "../components/EclipseVisibilityMap/EclipseVisibilityMap";
import EclipseWeatherForecast from "../components/EclipseWeatherForecast/EclipseWeatherForecast";
import EclipseTypeIcon from "../components/EclipseTypeIcon/EclipseTypeIcon";
import EclipseCircumstancesSheet from "../components/EclipseCircumstancesSheet/EclipseCircumstancesSheet";
import LunarContactGlyph from "../components/LunarContactGlyph/LunarContactGlyph";
import MoonShadowDiagram from "../components/MoonShadowDiagram/MoonShadowDiagram";
import NearestVisiblePoint from "../components/NearestVisiblePoint/NearestVisiblePoint";
import { lunarEclipseDetailsScreenStyles as styles } from "./LunarEclipseDetailsScreen.styles";

const LUNAR_LINE_STYLES: Record<string, EclipseLineStyle> = {
  maximumEclipse: { color: app_colors.red.main },
};

// Pas de style de remplissage : les 7 polygones (begin/end × pénombrale/partielle/totale) ne
// servent qu'à creuser les masques de visibilité (voir maskHoleFeatureNames), jamais rendus comme
// zones colorées à part entière.
const LUNAR_PATH_STYLES: Record<string, EclipsePathStyle> = {};

// Pictogramme par contact (liste des phases) — stage "full" = Lune entièrement dans l'ombre propre,
// "crescent" = contact pénombral/partiel avec un côté d'entrée/sortie (voir LunarContactGlyph).
const CONTACT_GLYPH: Partial<Record<LunarEclipseEventKey, { stage: "full" | "crescent"; side?: "entering" | "exiting" }>> = {
  P1: { stage: "crescent", side: "entering" },
  U1: { stage: "crescent", side: "entering" },
  U2: { stage: "full" },
  greatest: { stage: "full" },
  U3: { stage: "full" },
  U4: { stage: "crescent", side: "exiting" },
  P2: { stage: "crescent", side: "exiting" },
};

// La Lune n'est au-dessus de l'horizon que pendant une partie de l'éclipse : premier/dernier
// contact sous l'horizon alors qu'au moins un contact intermédiaire est visible — distingue "se
// lève déjà éclipsée" (début manqué) de "se couche avant la fin" (fin manquée).
const getLunarVisibilityHeadline = (contacts: LunarContactVisibility[]): "risesEclipsed" | "setsEclipsed" | "risesAndSetsEclipsed" | null => {
  if (contacts.length === 0 || !contacts.some((contact) => contact.aboveHorizon)) return null;
  const risesEclipsed = !contacts[0].aboveHorizon;
  const setsEclipsed = !contacts[contacts.length - 1].aboveHorizon;
  if (risesEclipsed && setsEclipsed) return "risesAndSetsEclipsed";
  if (risesEclipsed) return "risesEclipsed";
  if (setsEclipsed) return "setsEclipsed";
  return null;
};

const LunarEclipseDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const calendarDate = id.split(":")[1];
  const { t, i18n } = useTranslation("tools/eclipses");
  const { fetchLocation } = useLocation();
  const insets = useSafeAreaInsets();
  const mapRef = useRef<MapView>(null);
  const { formatDate } = useAppUnits();

  const [eclipse, setEclipse] = useState<LunarEclipse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedLocation, setSelectedLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [selectedLocationName, setSelectedLocationName] = useState("");
  const [isResolvingLocationName, setIsResolvingLocationName] = useState(false);
  const [sheetMinimized, setSheetMinimized] = useState(false);

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    (async () => {
      const year = Number(calendarDate.slice(0, 4));
      const list = await getLunarEclipses(year);
      if (cancelled) return;
      setEclipse(list?.find((candidate) => candidate.calendarDate === calendarDate) ?? null);
      setIsLoading(false);
    })();
    return () => { cancelled = true; };
  }, [calendarDate]);

  const selectLocation = async (latitude: number, longitude: number, name?: string) => {
    setSelectedLocation({ latitude, longitude });
    setSheetMinimized(false);
    if (name) {
      setSelectedLocationName(name);
      return;
    }
    setIsResolvingLocationName(true);
    const locationResult = await fetchLocation(`${latitude}::${longitude}`);
    setSelectedLocationName(locationResult?.local_names?.[i18n.language] || locationResult?.name || "");
    setIsResolvingLocationName(false);
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
    await selectLocation(result.latitude, result.longitude, result.name);
  };

  const clearSelection = () => {
    setSelectedLocation(null);
    setSelectedLocationName("");
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

  const greatestZenith = eclipse.events.greatest?.zenith?.geometry.coordinates;
  const { latitude: initialLatitude, latitudeDelta: initialLatitudeDelta } = clampMapRegionLatitude(
    greatestZenith ? greatestZenith[1] : 20,
    60
  );
  const initialRegion = {
    latitude: initialLatitude,
    longitude: greatestZenith ? greatestZenith[0] : 0,
    latitudeDelta: initialLatitudeDelta,
    longitudeDelta: 60,
  };

  const contacts = selectedLocation ? getLunarContactsVisibility(eclipse, selectedLocation.latitude, selectedLocation.longitude) : [];
  const isVisibleHere = contacts.some((contact) => contact.aboveHorizon);
  const headline = getLunarVisibilityHeadline(contacts);
  const referenceContact = contacts.find((contact) => contact.key === "greatest") ?? contacts.find((contact) => contact.aboveHorizon) ?? contacts[0];
  const visibilityRating = referenceContact?.aboveHorizon
    ? getAltitudeVisibilityRating(referenceContact.altitudeDeg, referenceContact.azimuthDeg)
    : null;
  // Les instants de contact sont géocentriques (voir lunarVisibility.ts) : la date de l'évènement
  // "greatest" convient pour la météo quel que soit le lieu sélectionné.
  const weatherEventDateIsoNoZ = eclipse.events.greatest?.date ?? eclipse.events.P1?.date ?? eclipse.events.P2?.date;

  const headerPercent = Math.round(eclipse.magnitude * 100);
  const lunarVariant = getLunarEclipseVariant(eclipse.type);
  const greatestContact = contacts.find((contact) => contact.key === "greatest");

  const headerContent = (
    <>
      {selectedLocation && (
        <Text style={styles.locationLine} numberOfLines={1}>
          {selectedLocationName ? `${selectedLocationName} · ` : ""}{formatLatLon(selectedLocation.latitude, selectedLocation.longitude, i18n.language)}
        </Text>
      )}
      {isVisibleHere && (
        headline ? (
          <Text style={styles.sentenceTitle}>{t(`details.header.${headline}`)}</Text>
        ) : (
          <View style={styles.header}>
            <View style={styles.header.iconRing}>
              <EclipseTypeIcon kind="lunar" variant={lunarVariant} size={44} />
            </View>
            <View style={styles.header.texts}>
              <Text style={styles.header.title}>
                {t(getLunarEclipseShortTypeLabelKey(eclipse.type))} · {headerPercent} %
              </Text>
            </View>
          </View>
        )
      )}
    </>
  );

  const showOverlayPanel = !!selectedLocation;

  return (
    <View style={styles.screen}>
      <EclipseVisibilityMap
        ref={mapRef}
        visibilityLines={eclipse.visibilityLines}
        visibilityPaths={eclipse.visibilityPaths}
        lineStyles={LUNAR_LINE_STYLES}
        pathStyles={LUNAR_PATH_STYLES}
        maskHoleFeatureNames={["beginPenumbralEclipse", "endPenumbralEclipse"]}
        initialRegion={initialRegion}
        maskOpacity={0.2}
        onPress={(coordinate) => selectLocation(coordinate.latitude, coordinate.longitude)}
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
          {isResolvingLocationName ? (
            <ActivityIndicator color={app_colors.accent.main} />
          ) : (
            <>
              {!isVisibleHere ? (
                <>
                  <Text style={styles.hint}>{t("details.moonNotVisible")}</Text>
                  {selectedLocation && (
                    <NearestVisiblePoint
                      origin={selectedLocation}
                      checkVisible={async (latitude, longitude) => isLunarEclipseVisibleFrom(eclipse, latitude, longitude)}
                      onSelect={(latitude, longitude, name) => selectLocation(latitude, longitude, name)}
                    />
                  )}
                </>
              ) : headline ? null : (
                <>
                  <View style={styles.metaRow}>
                    <Text style={styles.metaRow.altitude}>
                      {greatestContact?.aboveHorizon ? t("details.header.moonAltitudeAtMax", { altitude: Math.round(greatestContact.altitudeDeg) }) : ""}
                    </Text>
                    <Text style={styles.metaRow.time}>
                      {t("details.header.localTime")} · {formatUtcOffsetLabel(formatDate, referenceContact!.date)}
                    </Text>
                  </View>
                </>
              )}

              {isVisibleHere && (
                <>
                  <View style={styles.statsGrid}>
                    <ValueTile label={t("details.stats.magnitude")} value={formatLocaleNumber(eclipse.magnitude, i18n.language, 2)} />
                    <ValueTile label={t("details.stats.duration")} value={eclipse.duration.penumbral} />
                    {eclipse.duration.total && <ValueTile label={t("details.stats.totalDuration")} value={eclipse.duration.total} />}
                  </View>

                  {visibilityRating && (
                    <View style={styles.visibilityBadge}>
                      <Text style={styles.visibilityBadge.text}>
                        {t(`details.visibilityLunar.${visibilityRating.level}`, { altitude: visibilityRating.altitudeDeg.toFixed(0) })}
                      </Text>
                    </View>
                  )}

                  {selectedLocation && weatherEventDateIsoNoZ && (
                    <EclipseWeatherForecast
                      latitude={selectedLocation.latitude}
                      longitude={selectedLocation.longitude}
                      eventDateIsoNoZ={weatherEventDateIsoNoZ}
                    />
                  )}

                  <MoonShadowDiagram eclipse={eclipse} />
                </>
              )}

              <View style={styles.contactList}>
                {contacts.map((contact) => {
                  const glyph = CONTACT_GLYPH[contact.key] ?? { stage: "crescent" as const, side: "entering" as const };
                  const dimmed = !contact.aboveHorizon;
                  const highlighted = contact.key === "greatest" && !dimmed;
                  const rowBackgroundColor = highlighted ? app_colors.ambre.main : dimmed ? app_colors.background : app_colors.white;
                  return (
                    <View
                      key={contact.key}
                      style={[styles.contactRow, dimmed && styles.contactRow.dimmed, highlighted && styles.contactRow.highlighted]}
                    >
                      <LunarContactGlyph stage={glyph.stage} side={glyph.side} dimmed={dimmed} backgroundColor={rowBackgroundColor} />
                      <Text style={[styles.contactRow.label, dimmed && styles.contactRow.label.dimmed]}>
                        {t(`details.phases.lunar.${contact.key}`)}
                      </Text>
                      <Text style={styles.contactRow.meta}>
                        {dimmed ? t("details.belowHorizon") : t("details.header.moonAltitude", { altitude: Math.round(contact.altitudeDeg) })}
                      </Text>
                      <Text style={[styles.contactRow.time, dimmed && styles.contactRow.time.dimmed]}>
                        {formatDate(contact.date).format("HH:mm")}
                      </Text>
                    </View>
                  );
                })}
              </View>

              <View style={styles.ctaRow}>
                <TouchableOpacity style={styles.ctaRow.primary} onPress={() => {}}>
                  <Text style={styles.ctaRow.primary.text}>{t("details.notifyMoonrise")}</Text>
                </TouchableOpacity>
                {/* TODO : ajouter ce rendez-vous au calendrier — bouton de façade seulement pour l'instant. */}
                <TouchableOpacity style={styles.ctaRow.secondary} onPress={() => {}}>
                  <CalendarPlus size={18} color={app_colors.primary.main} />
                </TouchableOpacity>
              </View>
            </>
          )}
        </EclipseCircumstancesSheet>
      ) : (
        <View style={styles.idleCard}>
          <Text style={styles.idleCard.type}>{t(getLunarEclipseTypeLabelKey(eclipse.type))}</Text>
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

export default LunarEclipseDetailsScreen;
