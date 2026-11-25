import { useMemo, useState } from "react";
import { ActivityIndicator, InteractionManager, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import dayjs from "dayjs";
import { Info, MapPin } from "lucide-react-native";
import { globalStyles } from "../../../helpers/globalStyles";
import { app_colors } from "../../../helpers/variables";
import { formatLocaleNumber } from "../../../helpers/format";
import { useLocation } from "../../../context/LocationContext";
import { ScreenHeader } from "../../../components/layout/ScreenHeader/ScreenHeader";
import SectionHeader from "../../../components/layout/SectionHeader/SectionHeader";
import InfoCard from "../../../components/cards/InfoCard/InfoCard";
import Button from "../../../components/buttons/Button/Button";
import { InputWithIcon } from "../../../components/inputs/InputWithIcon/InputWithIcon";
import DateRangeField from "../../../components/inputs/DateRangeField/DateRangeField";
import MapTargetMarker from "../../../components/MapTargetMarker/MapTargetMarker";
import { getObjectEquatorialCoordinateResolver } from "../../../helpers/catalog/objectEphemeris";
import {
  findConjunctions,
  findNextConjunction,
  getStaticSeparationDeg,
  isStaticConjunctionPair,
  type Conjunction,
} from "../../../helpers/catalog/conjunctions";
import type { CatalogObjectDetail } from "../../../types/catalog/CatalogObject";
import type { GpsLocation } from "../../../types/gpsLocation";
import ObjectPicker from "./components/ObjectPicker/ObjectPicker";
import ConjunctionCard from "./components/ConjunctionCard/ConjunctionCard";
import { conjunctionsScreenStyles } from "./ConjunctionsScreen.styles";

type SearchMode = "range" | "next";

// Fenêtre maximale explorée par "trouver la prochaine conjonction" : généreuse mais bon marché (voir
// conjunctions.ts, un pas d'1h sur plusieurs années reste un calcul de quelques secondes) — une
// grande conjonction entre deux planètes lentes (ex: Jupiter-Saturne, ~20 ans) peut malgré tout
// dépasser cette fenêtre, auquel cas "aucune trouvée", assumé et annoncé par le disclaimer.
const NEXT_CONJUNCTION_MAX_DAYS = 250; // ~8 mois, ~0.7 an
const DEFAULT_MAX_SEPARATION_DEG = "5";

const ConjunctionsScreen = () => {
  const { t, i18n } = useTranslation("tools/conjunctions");
  const { location, fetchLocation } = useLocation();

  const [objectA, setObjectA] = useState<CatalogObjectDetail | null>(null);
  const [objectB, setObjectB] = useState<CatalogObjectDetail | null>(null);

  // Lieu choisi sur la carte pour cette recherche uniquement : jamais persisté, prime simplement sur
  // la position effective de l'app tant qu'il est défini — même bloc que SatelliteTransitsScreen.
  const [customLocation, setCustomLocation] = useState<GpsLocation | null>(null);
  const [customAltitudeInput, setCustomAltitudeInput] = useState<string>("");
  const [showMapPicker, setShowMapPicker] = useState(false);

  const [startDate, setStartDate] = useState<Date>(() => new Date());
  const [endDate, setEndDate] = useState<Date>(() => dayjs().add(30, "day").toDate());
  const [maxSeparationInput, setMaxSeparationInput] = useState<string>(DEFAULT_MAX_SEPARATION_DEG);

  const [conjunctions, setConjunctions] = useState<Conjunction[] | null>(null);
  const [staticSeparationDeg, setStaticSeparationDeg] = useState<number | null>(null);
  const [searchMode, setSearchMode] = useState<SearchMode | null>(null);

  const effectiveLocation: GpsLocation | null = useMemo(() => {
    if (!customLocation) return location;
    const parsedAltitude = customAltitudeInput.trim() !== "" ? parseFloat(customAltitudeInput) : customLocation.elevation;
    return { ...customLocation, elevation: parsedAltitude != null && Number.isFinite(parsedAltitude) ? parsedAltitude : null };
  }, [customLocation, customAltitudeInput, location]);

  const locationLabel = effectiveLocation
    ? effectiveLocation.local_names?.[i18n.language] || effectiveLocation.name || `${effectiveLocation.latitude.toFixed(3)}, ${effectiveLocation.longitude.toFixed(3)}`
    : t("screen.location.unknown");

  const maxSeparationDeg = parseFloat(maxSeparationInput);
  const canSearch = !!effectiveLocation && !!objectA && !!objectB && Number.isFinite(maxSeparationDeg) && maxSeparationDeg > 0;
  const isSearching = searchMode !== null && conjunctions === null && staticSeparationDeg === null;

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
    if (!effectiveLocation || !objectA || !objectB || !Number.isFinite(maxSeparationDeg) || maxSeparationDeg <= 0) return;

    const observer = {
      latitude: effectiveLocation.latitude,
      longitude: effectiveLocation.longitude,
      elevation: effectiveLocation.elevation ?? 0,
    };

    const resolverA = getObjectEquatorialCoordinateResolver(objectA, observer);
    const resolverB = getObjectEquatorialCoordinateResolver(objectB, observer);
    if (!resolverA || !resolverB) {
      setSearchMode(mode);
      setStaticSeparationDeg(null);
      setConjunctions([]);
      return;
    }

    // Deux objets à position fixe (étoiles/DSO, aucune éphéméride) : leur séparation ne varie
    // jamais, pas la peine de scanner la période choisie — voir conjunctions.ts.
    if (isStaticConjunctionPair(resolverA, resolverB)) {
      setSearchMode(mode);
      setConjunctions(null);
      setStaticSeparationDeg(getStaticSeparationDeg(resolverA, resolverB));
      return;
    }

    setSearchMode(mode);
    setStaticSeparationDeg(null);
    setConjunctions(null);

    // Recherche différée (pattern déjà utilisé partout dans l'app pour un calcul astro un peu
    // lourd) : purement locale (pas d'appel réseau, contrairement aux transits ISS et leur TLE),
    // mais "trouver la prochaine conjonction" peut explorer jusqu'à NEXT_CONJUNCTION_MAX_DAYS jours.
    InteractionManager.runAfterInteractions(() => {
      if (mode === "range") {
        setConjunctions(findConjunctions(resolverA, resolverB, observer, { startDate, endDate, maxSeparationDeg }));
      } else {
        const next = findNextConjunction(resolverA, resolverB, observer, { maxDays: NEXT_CONJUNCTION_MAX_DAYS, maxSeparationDeg });
        setConjunctions(next ? [next] : []);
      }
    });
  };

  // Les deux objets ne sont pas forcément retrouvables depuis `location` (contexte) côté fiche
  // détail — un lieu choisi sur la carte est transmis en query params, même principe que les
  // transits ISS, pour réaffiner la même conjonction avec le même observateur.
  const handleConjunctionPress = (conjunction: Conjunction) => {
    if (!effectiveLocation || !objectA || !objectB) return;
    const params = new URLSearchParams({
      objA: objectA.id,
      objB: objectB.id,
      lat: effectiveLocation.latitude.toString(),
      lon: effectiveLocation.longitude.toString(),
      elev: (effectiveLocation.elevation ?? 0).toString(),
    });
    router.push(`/tools/conjunctions-calculator/${conjunction.midDate.getTime()}?${params.toString()}`);
  };

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("screen.title")} subtitle={t("screen.subtitle")} main={false} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={globalStyles.content}>

            <View style={conjunctionsScreenStyles.section}>
              <SectionHeader title={t("screen.objects.title")} />
              <View style={conjunctionsScreenStyles.objectsRow}>
                <ObjectPicker
                  label={t("screen.objects.labelA")}
                  placeholder={t("screen.objects.placeholder")}
                  changeLabel={t("screen.objects.change")}
                  selected={objectA}
                  onSelect={setObjectA}
                  onClear={() => setObjectA(null)}
                />
                <ObjectPicker
                  label={t("screen.objects.labelB")}
                  placeholder={t("screen.objects.placeholder")}
                  changeLabel={t("screen.objects.change")}
                  selected={objectB}
                  onSelect={setObjectB}
                  onClear={() => setObjectB(null)}
                />
              </View>
            </View>

            <View style={conjunctionsScreenStyles.section}>
              <SectionHeader title={t("screen.location.title")} />

              <View style={conjunctionsScreenStyles.locationSummary}>
                <MapPin size={16} color={app_colors.accent.main} />
                <Text style={conjunctionsScreenStyles.locationSummary.text}>{locationLabel}</Text>
              </View>

              <View style={conjunctionsScreenStyles.locationActions}>
                <TouchableOpacity onPress={() => setShowMapPicker((visible) => !visible)}>
                  <Text style={conjunctionsScreenStyles.locationActions.link}>
                    {showMapPicker ? t("screen.location.hideMap") : t("screen.location.chooseOnMap")}
                  </Text>
                </TouchableOpacity>
                {customLocation && (
                  <TouchableOpacity onPress={handleUseCurrentLocation}>
                    <Text style={conjunctionsScreenStyles.locationActions.link}>{t("screen.location.useCurrent")}</Text>
                  </TouchableOpacity>
                )}
              </View>

              {showMapPicker && (
                <>
                  <View style={conjunctionsScreenStyles.mapContainer}>
                    <MapView
                      style={conjunctionsScreenStyles.mapContainer.map}
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
              )}
            </View>

            <View style={conjunctionsScreenStyles.section}>
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

              <InputWithIcon
                fill
                label={t("screen.maxSeparationLabel")}
                placeholder={t("screen.maxSeparationPlaceholder")}
                value={maxSeparationInput}
                onChangeText={setMaxSeparationInput}
                action={() => {}}
                keyboardType="numeric"
              />

              <Button
                label={t("screen.search")}
                onPress={() => runSearch("range")}
                disabled={!canSearch || isSearching}
                loading={searchMode === "range" && isSearching}
              />
            </View>

            <View style={conjunctionsScreenStyles.section}>
              <Button
                label={t("screen.findNext.button")}
                variant="info"
                onPress={() => runSearch("next")}
                disabled={!canSearch || isSearching}
                loading={searchMode === "next" && isSearching}
              />
              <Text style={conjunctionsScreenStyles.disclaimer}>{t("screen.findNext.disclaimer")}</Text>
            </View>

            {
              isSearching ? (
                <ActivityIndicator size="large" color={app_colors.accent.main} style={conjunctionsScreenStyles.loader} />
              ) : staticSeparationDeg !== null ? (
                <View style={conjunctionsScreenStyles.staticPairCard}>
                  <Text style={conjunctionsScreenStyles.staticPairCard.title}>{t("screen.staticPair.title")}</Text>
                  <Text style={conjunctionsScreenStyles.staticPairCard.description}>
                    {t("screen.staticPair.description", { value: formatLocaleNumber(staticSeparationDeg, i18n.language, 2) })}
                  </Text>
                </View>
              ) : conjunctions === null ? (
                <View style={conjunctionsScreenStyles.section}>
                  <InfoCard icon={Info} title={t("screen.explanation.whatTitle")} description={t("screen.explanation.whatDescription")} />

                  <SectionHeader title={t("screen.explanation.paramsTitle")} />
                  <View style={conjunctionsScreenStyles.explanationCard}>
                    {([
                      ["separation", "list.separationLabel"],
                      ["position", "details.stats.position"],
                      ["time", "details.stats.time"],
                    ] as const).map(([paramKey, titleKey], index) => (
                      <View
                        key={paramKey}
                        style={[conjunctionsScreenStyles.explanationCard.item, index < 2 && conjunctionsScreenStyles.explanationCard.item.withBorder]}
                      >
                        <Text style={conjunctionsScreenStyles.explanationCard.item.title}>{t(titleKey)}</Text>
                        <Text style={conjunctionsScreenStyles.explanationCard.item.description}>{t(`screen.explanation.params.${paramKey}`)}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              ) : conjunctions.length > 0 && objectA && objectB ? (
                <View style={conjunctionsScreenStyles.list}>
                  {conjunctions.map((conjunction) => (
                    <ConjunctionCard
                      key={conjunction.midDate.getTime()}
                      conjunction={conjunction}
                      objectA={objectA}
                      objectB={objectB}
                      onPress={() => handleConjunctionPress(conjunction)}
                    />
                  ))}
                </View>
              ) : (
                <Text style={conjunctionsScreenStyles.emptyState}>
                  {searchMode === "next" ? t("screen.emptyNext", { days: NEXT_CONJUNCTION_MAX_DAYS }) : t("screen.empty")}
                </Text>
              )
            }
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ConjunctionsScreen;
