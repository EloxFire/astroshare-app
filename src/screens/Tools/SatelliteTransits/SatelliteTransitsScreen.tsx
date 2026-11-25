import { useMemo, useState } from "react";
import { ActivityIndicator, InteractionManager, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import dayjs from "dayjs";
import { Info, MapPin, Moon, Sun } from "lucide-react-native";
import { globalStyles } from "../../../helpers/globalStyles";
import { app_colors } from "../../../helpers/variables";
import { useLocation } from "../../../context/LocationContext";
import { ScreenHeader } from "../../../components/layout/ScreenHeader/ScreenHeader";
import SectionHeader from "../../../components/layout/SectionHeader/SectionHeader";
import InfoCard from "../../../components/cards/InfoCard/InfoCard";
import Button from "../../../components/buttons/Button/Button";
import TabSwitch from "../../../components/inputs/TabSwitch/TabSwitch";
import { InputWithIcon } from "../../../components/inputs/InputWithIcon/InputWithIcon";
import DateRangeField from "../../../components/inputs/DateRangeField/DateRangeField";
import MapTargetMarker from "../../../components/MapTargetMarker/MapTargetMarker";
import { getSatelliteTle } from "../../../helpers/api/satellites/tracking";
import { parseTle } from "../../../helpers/satellites/propagation";
import {
  findNextBodyTransit,
  findBodyTransits,
  TARGET_BODIES,
  TRANSIT_SATELLITES,
  type BodyTransit,
  type SatelliteKey,
  type TargetBodyKey,
} from "../../../helpers/satellites/transits";
import type { GpsLocation } from "../../../types/gpsLocation";
import TransitCard from "./components/TransitCard/TransitCard";
import { satelliteTransitsScreenStyles } from "./SatelliteTransitsScreen.styles";

type SearchMode = "range" | "next";
type TargetBodySelection = TargetBodyKey | "both";

// Fenêtre maximale explorée par "trouver le prochain transit" : assez large pour presque toujours
// aboutir (un transit exact depuis un point fixe reste rare mais pas exceptionnel sur plusieurs
// mois), sans laisser le calcul s'étendre indéfiniment — voir le disclaimer affiché à l'écran.
const NEXT_TRANSIT_MAX_DAYS = 180;

// Ordre d'affichage des deux switches (corps visé, satellite) — un simple tableau plutôt qu'un enum :
// TabSwitch est piloté par index, ces tableaux font à la fois office de source de vérité pour les
// libellés (clé de traduction) et de table index ↔ valeur.
const TARGET_BODY_OPTIONS: { value: TargetBodySelection; icon?: typeof Sun }[] = [
  { value: "sun", icon: Sun },
  { value: "moon", icon: Moon },
  { value: "both" },
];
const SATELLITE_OPTIONS: SatelliteKey[] = ["iss", "tiangong"];

const SatelliteTransitsScreen = () => {
  const { t, i18n } = useTranslation("tools/satelliteTransits");
  const { location, fetchLocation } = useLocation();

  // Lieu choisi sur la carte pour cette recherche uniquement : jamais persisté (pas de nouvel
  // observatoire créé), prime simplement sur la position effective de l'app (`location`) tant qu'il
  // est défini. L'altitude est saisie à part : la géocodification inverse d'un point tapé au hasard
  // ne la fournit pas (voir fetchLocation dans LocationContext, cas "::" → elevation: null).
  const [customLocation, setCustomLocation] = useState<GpsLocation | null>(null);
  const [customAltitudeInput, setCustomAltitudeInput] = useState<string>("");
  const [showMapPicker, setShowMapPicker] = useState(false);

  const [targetBodySelection, setTargetBodySelection] = useState<TargetBodySelection>("sun");
  const [satelliteKey, setSatelliteKey] = useState<SatelliteKey>("iss");

  const [startDate, setStartDate] = useState<Date>(() => new Date());
  const [endDate, setEndDate] = useState<Date>(() => dayjs().add(7, "day").toDate());

  const [transits, setTransits] = useState<BodyTransit[] | null>(null);
  const [searchMode, setSearchMode] = useState<SearchMode | null>(null);

  const effectiveLocation: GpsLocation | null = useMemo(() => {
    if (!customLocation) return location;
    const parsedAltitude = customAltitudeInput.trim() !== "" ? parseFloat(customAltitudeInput) : customLocation.elevation;
    return { ...customLocation, elevation: parsedAltitude != null && Number.isFinite(parsedAltitude) ? parsedAltitude : null };
  }, [customLocation, customAltitudeInput, location]);

  const locationLabel = effectiveLocation
    ? effectiveLocation.local_names?.[i18n.language] || effectiveLocation.name || `${effectiveLocation.latitude.toFixed(3)}, ${effectiveLocation.longitude.toFixed(3)}`
    : t("screen.location.unknown");

  const handleMapPress = async (event: { nativeEvent: { coordinate: { latitude: number; longitude: number } } }) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const locationData = await fetchLocation(`${latitude}::${longitude}`);
    setCustomLocation(locationData ?? { latitude, longitude, elevation: null });
    setCustomAltitudeInput("");
  };

  const handleUseCurrentLocation = () => {
    setCustomLocation(null);
    setCustomAltitudeInput("");
  };

  const runSearch = (mode: SearchMode) => {
    if (!effectiveLocation) return;
    setSearchMode(mode);
    setTransits(null);

    const observer = {
      latitude: effectiveLocation.latitude,
      longitude: effectiveLocation.longitude,
      elevation: effectiveLocation.elevation ?? 0,
    };
    // "both" lance une recherche par corps (Soleil puis Lune) et fusionne les résultats triés par
    // date — pas une recherche unique qui testerait les deux en même temps, les deux corps n'ayant
    // ni la même position ni le même diamètre apparent.
    const bodies: TargetBodyKey[] = targetBodySelection === "both" ? ["sun", "moon"] : [targetBodySelection];
    const satellite = TRANSIT_SATELLITES[satelliteKey];

    // Recherche différée (voir le pattern déjà utilisé partout dans l'app pour un calcul astro
    // lourd) : "trouver le prochain transit" peut explorer jusqu'à NEXT_TRANSIT_MAX_DAYS jours et
    // prendre plusieurs secondes (voir le disclaimer), pas la peine de bloquer l'interaction en cours.
    InteractionManager.runAfterInteractions(async () => {
      const tle = await getSatelliteTle({ name: satellite.nameQuery });
      const satrec = tle ? parseTle(tle.tle) : null;
      if (!satrec) {
        setTransits([]);
        return;
      }

      if (mode === "range") {
        const results = bodies
          .flatMap((bodyKey) => findBodyTransits(satrec, observer, { startDate, endDate }, TARGET_BODIES[bodyKey], satellite.physicalSizeMeters))
          .sort((a, b) => a.midDate.getTime() - b.midDate.getTime());
        setTransits(results);
      } else {
        // "both" : une recherche "prochain transit" par corps (chacune peut prendre plusieurs
        // secondes), on garde le plus proche des deux dans le temps plutôt que le premier trouvé.
        const candidates = bodies
          .map((bodyKey) => findNextBodyTransit(satrec, observer, { maxDays: NEXT_TRANSIT_MAX_DAYS }, TARGET_BODIES[bodyKey], satellite.physicalSizeMeters))
          .filter((transit): transit is BodyTransit => transit !== null)
          .sort((a, b) => a.midDate.getTime() - b.midDate.getTime());
        setTransits(candidates.length > 0 ? [candidates[0]] : []);
      }
    });
  };

  // Le lieu utilisé pour trouver ce transit n'est pas forcément `location` (contexte) — il peut
  // s'agir d'un lieu choisi sur la carte pour cette recherche. Transmis en query params (et non
  // juste l'id/horodatage), de même que le corps visé et le satellite, pour que la fiche détail
  // réaffine le même transit avec le même observateur/corps/satellite plutôt que de retomber sur
  // des valeurs par défaut.
  const handleTransitPress = (transit: BodyTransit) => {
    if (!effectiveLocation) return;
    const params = new URLSearchParams({
      lat: effectiveLocation.latitude.toString(),
      lon: effectiveLocation.longitude.toString(),
      elev: (effectiveLocation.elevation ?? 0).toString(),
      body: transit.body,
      satellite: satelliteKey,
    });
    router.push(`/tools/satellite-transits/${transit.midDate.getTime()}?${params.toString()}`);
  };

  const isSearching = searchMode !== null && transits === null;

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("screen.title")} subtitle={t("screen.subtitle")} main={false} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={globalStyles.content}>

            <View style={satelliteTransitsScreenStyles.section}>
              <SectionHeader title={t("screen.location.title")} />

              <View style={satelliteTransitsScreenStyles.locationSummary}>
                <MapPin size={16} color={app_colors.accent.main} />
                <Text style={satelliteTransitsScreenStyles.locationSummary.text}>{locationLabel}</Text>
              </View>

              <View style={satelliteTransitsScreenStyles.locationActions}>
                <TouchableOpacity onPress={() => setShowMapPicker((visible) => !visible)}>
                </TouchableOpacity>
                {customLocation && (
                  <TouchableOpacity onPress={handleUseCurrentLocation}>
                    <Text style={satelliteTransitsScreenStyles.locationActions.link}>{t("screen.location.useCurrent")}</Text>
                  </TouchableOpacity>
                )}
              </View>

              <>
                <View style={satelliteTransitsScreenStyles.mapContainer}>
                  <MapView
                    style={satelliteTransitsScreenStyles.mapContainer.map}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={{
                      latitude: effectiveLocation?.latitude ?? 48.856724859667835,
                      longitude: effectiveLocation?.longitude ?? 2.349875271320343,
                      latitudeDelta: 0.5,
                      longitudeDelta: 0.5,
                    }}
                    mapType="standard"
                    onPress={handleMapPress}
                    rotateEnabled={false}
                  >
                    {effectiveLocation && (
                      <MapTargetMarker coordinate={{ latitude: effectiveLocation.latitude, longitude: effectiveLocation.longitude }} />
                    )}
                  </MapView>
                </View>

                <InputWithIcon
                  fill
                  label={t("screen.location.altitudeLabel")}
                  placeholder={t("screen.location.altitudePlaceholder")}
                  value={customAltitudeInput}
                  onChangeText={setCustomAltitudeInput}
                  action={() => {}}
                  keyboardType="numeric"
                />
              </>
            </View>

            <View style={satelliteTransitsScreenStyles.section}>
              <SectionHeader title={t("screen.options.title")} />

              <Text style={satelliteTransitsScreenStyles.optionLabel}>{t("screen.options.targetBodyLabel")}</Text>
              <TabSwitch
                tabs={TARGET_BODY_OPTIONS.map((option) => ({ text: t(`screen.targetBody.${option.value}`), icon: option.icon }))}
                activeTab={TARGET_BODY_OPTIONS.findIndex((option) => option.value === targetBodySelection)}
                onTabPress={(index) => setTargetBodySelection(TARGET_BODY_OPTIONS[index].value)}
              />

              <Text style={satelliteTransitsScreenStyles.optionLabel}>{t("screen.options.satelliteLabel")}</Text>
              <TabSwitch
                tabs={SATELLITE_OPTIONS.map((key) => ({ text: t(`screen.satellite.${key}`) }))}
                activeTab={SATELLITE_OPTIONS.indexOf(satelliteKey)}
                onTabPress={(index) => setSatelliteKey(SATELLITE_OPTIONS[index])}
              />
            </View>

            <View style={satelliteTransitsScreenStyles.section}>
              <SectionHeader title={t("screen.dateRange.title")} />

              <DateRangeField
                startDate={startDate}
                endDate={endDate}
                onChangeStart={setStartDate}
                onChangeEnd={setEndDate}
                startLabel={t("screen.dateRange.start")}
                endLabel={t("screen.dateRange.end")}
                pickerStartTitle={t("screen.dateRange.picker.startTitle")}
                pickerEndTitle={t("screen.dateRange.picker.endTitle")}
                doneLabel={t("screen.dateRange.picker.done")}
              />

              <Button
                label={t("screen.search")}
                onPress={() => runSearch("range")}
                disabled={!effectiveLocation || isSearching}
                loading={searchMode === "range" && isSearching}
              />
            </View>

            <View style={satelliteTransitsScreenStyles.section}>
              <Button
                label={t("screen.findNext.button")}
                variant="info"
                onPress={() => runSearch("next")}
                disabled={!effectiveLocation || isSearching}
                loading={searchMode === "next" && isSearching}
              />
              <Text style={satelliteTransitsScreenStyles.disclaimer}>{t("screen.findNext.disclaimer")}</Text>
            </View>

            {
              isSearching ? (
                <ActivityIndicator size="large" color={app_colors.accent.main} style={satelliteTransitsScreenStyles.loader} />
              ) : transits === null ? (
                <Text style={satelliteTransitsScreenStyles.emptyState}>
                  {searchMode === "next" ? t("screen.emptyNext", { days: NEXT_TRANSIT_MAX_DAYS }) : t("screen.empty")}
                </Text>
              ) : transits.length > 0 ? (
                <View style={satelliteTransitsScreenStyles.list}>
                  {transits.map((transit) => (
                    <TransitCard key={`${transit.body}-${transit.midDate.getTime()}`} transit={transit} onPress={() => handleTransitPress(transit)} />
                  ))}
                </View>
              ) : (
                <Text style={satelliteTransitsScreenStyles.emptyState}>
                  {searchMode === "next" ? t("screen.emptyNext", { days: NEXT_TRANSIT_MAX_DAYS }) : t("screen.empty")}
                </Text>
              )
            }

            <View style={satelliteTransitsScreenStyles.section}>
                  <InfoCard icon={Info} title={t("screen.explanation.whatTitle")} description={t("screen.explanation.whatDescription")} />

                  <SectionHeader title={t("screen.explanation.paramsTitle")} />
                  <View style={satelliteTransitsScreenStyles.explanationCard}>
                    {([
                      ["angularSize", "details.stats.angularSize"],
                      ["position", "details.stats.position"],
                      ["duration", "details.stats.duration"],
                      ["missDistance", "details.stats.missDistance"],
                    ] as const).map(([paramKey, titleKey], index) => (
                      <View
                        key={paramKey}
                        style={[satelliteTransitsScreenStyles.explanationCard.item, index < 3 && satelliteTransitsScreenStyles.explanationCard.item.withBorder]}
                      >
                        <Text style={satelliteTransitsScreenStyles.explanationCard.item.title}>{t(titleKey)}</Text>
                        <Text style={satelliteTransitsScreenStyles.explanationCard.item.description}>{t(`screen.explanation.params.${paramKey}`)}</Text>
                      </View>
                    ))}
                  </View>
                </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default SatelliteTransitsScreen;
