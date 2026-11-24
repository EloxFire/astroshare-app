import { useMemo, useState } from "react";
import { ActivityIndicator, InteractionManager, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import DateTimePicker, { DateTimePickerChangeEvent } from "@react-native-community/datetimepicker";
import dayjs from "dayjs";
import { Info, MapPin, X } from "lucide-react-native";
import { globalStyles } from "../../../helpers/globalStyles";
import { app_colors, spacing } from "../../../helpers/variables";
import { useLocation } from "../../../context/LocationContext";
import { ScreenHeader } from "../../../components/layout/ScreenHeader/ScreenHeader";
import SectionHeader from "../../../components/layout/SectionHeader/SectionHeader";
import InfoCard from "../../../components/cards/InfoCard/InfoCard";
import Button from "../../../components/buttons/Button/Button";
import { InputWithIcon } from "../../../components/inputs/InputWithIcon/InputWithIcon";
import MapTargetMarker from "../../../components/MapTargetMarker/MapTargetMarker";
import { getSatelliteTle } from "../../../helpers/api/satellites/tracking";
import { parseTle } from "../../../helpers/satellites/propagation";
import { findNextSolarTransit, findSolarTransits, type SolarTransit } from "../../../helpers/satellites/solarTransits";
import type { GpsLocation } from "../../../types/gpsLocation";
import TransitCard from "./components/TransitCard/TransitCard";
import { issTransitsScreenStyles } from "./IssTransitsScreen.styles";

type DateRangeTarget = "start" | "end";
type SearchMode = "range" | "next";

// Fenêtre maximale explorée par "trouver le prochain transit" : assez large pour presque toujours
// aboutir (un transit exact depuis un point fixe reste rare mais pas exceptionnel sur plusieurs
// mois), sans laisser le calcul s'étendre indéfiniment — voir le disclaimer affiché à l'écran.
const NEXT_TRANSIT_MAX_DAYS = 180;

const IssTransitsScreen = () => {
  const { t, i18n } = useTranslation("tools/issTransits");
  const { location, fetchLocation } = useLocation();
  const insets = useSafeAreaInsets();

  // Lieu choisi sur la carte pour cette recherche uniquement : jamais persisté (pas de nouvel
  // observatoire créé), prime simplement sur la position effective de l'app (`location`) tant qu'il
  // est défini. L'altitude est saisie à part : la géocodification inverse d'un point tapé au hasard
  // ne la fournit pas (voir fetchLocation dans LocationContext, cas "::" → elevation: null).
  const [customLocation, setCustomLocation] = useState<GpsLocation | null>(null);
  const [customAltitudeInput, setCustomAltitudeInput] = useState<string>("");
  const [showMapPicker, setShowMapPicker] = useState(false);

  const [startDate, setStartDate] = useState<Date>(() => new Date());
  const [endDate, setEndDate] = useState<Date>(() => dayjs().add(7, "day").toDate());
  const [activeDatePicker, setActiveDatePicker] = useState<DateRangeTarget | null>(null);

  const [transits, setTransits] = useState<SolarTransit[] | null>(null);
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

    // Recherche différée (voir le pattern déjà utilisé partout dans l'app pour un calcul astro
    // lourd) : "trouver le prochain transit" peut explorer jusqu'à NEXT_TRANSIT_MAX_DAYS jours et
    // prendre plusieurs secondes (voir le disclaimer), pas la peine de bloquer l'interaction en cours.
    InteractionManager.runAfterInteractions(async () => {
      const tle = await getSatelliteTle({ name: "ISS (ZARYA)" });
      const satrec = tle ? parseTle(tle.tle) : null;
      if (!satrec) {
        setTransits([]);
        return;
      }

      if (mode === "range") {
        setTransits(findSolarTransits(satrec, observer, { startDate, endDate }));
      } else {
        const next = findNextSolarTransit(satrec, observer, { maxDays: NEXT_TRANSIT_MAX_DAYS });
        setTransits(next ? [next] : []);
      }
    });
  };

  const openDatePicker = (target: DateRangeTarget) => setActiveDatePicker(target);
  const closeIosDatePicker = () => setActiveDatePicker(null);

  const handleDatePickerChange = (_event: DateTimePickerChangeEvent, selectedDate: Date) => {
    if (!activeDatePicker) return;

    if (activeDatePicker === "start") {
      setStartDate(selectedDate);
      // La fin ne peut jamais précéder le début.
      if (selectedDate >= endDate) setEndDate(dayjs(selectedDate).add(1, "day").toDate());
    } else {
      setEndDate(selectedDate < startDate ? startDate : selectedDate);
    }

    // Android : la boîte de dialogue se ferme déjà seule après sélection, contrairement au panneau
    // iOS (fermé explicitement via son bouton "Valider").
    if (Platform.OS === "android") setActiveDatePicker(null);
  };

  // Le lieu utilisé pour trouver ce transit n'est pas forcément `location` (contexte) — il peut
  // s'agir d'un lieu choisi sur la carte pour cette recherche. Transmis en query params (et non
  // juste l'id/horodatage) pour que la fiche détail réaffine le même transit avec le même
  // observateur, plutôt que de retomber sur le lieu courant de l'app.
  const handleTransitPress = (transit: SolarTransit) => {
    if (!effectiveLocation) return;
    const params = new URLSearchParams({
      lat: effectiveLocation.latitude.toString(),
      lon: effectiveLocation.longitude.toString(),
      elev: (effectiveLocation.elevation ?? 0).toString(),
    });
    router.push(`/tools/iss-transits/${transit.midDate.getTime()}?${params.toString()}`);
  };

  const isSearching = searchMode !== null && transits === null;

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("screen.title")} subtitle={t("screen.subtitle")} main={false} />

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={globalStyles.content}>

            <View style={issTransitsScreenStyles.section}>
              <SectionHeader title={t("screen.location.title")} />

              <View style={issTransitsScreenStyles.locationSummary}>
                <MapPin size={16} color={app_colors.accent.main} />
                <Text style={issTransitsScreenStyles.locationSummary.text}>{locationLabel}</Text>
              </View>

              <View style={issTransitsScreenStyles.locationActions}>
                <TouchableOpacity onPress={() => setShowMapPicker((visible) => !visible)}>
                </TouchableOpacity>
                {customLocation && (
                  <TouchableOpacity onPress={handleUseCurrentLocation}>
                    <Text style={issTransitsScreenStyles.locationActions.link}>{t("screen.location.useCurrent")}</Text>
                  </TouchableOpacity>
                )}
              </View>

              <>
                <View style={issTransitsScreenStyles.mapContainer}>
                  <MapView
                    style={issTransitsScreenStyles.mapContainer.map}
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

            <View style={issTransitsScreenStyles.section}>
              <SectionHeader title={t("screen.dateRange.title")} />

              <View style={issTransitsScreenStyles.dateRow}>
                <TouchableOpacity style={issTransitsScreenStyles.dateRow.field} onPress={() => openDatePicker("start")}>
                  <Text style={issTransitsScreenStyles.dateRow.field.label}>{t("screen.dateRange.start")}</Text>
                  <Text style={issTransitsScreenStyles.dateRow.field.value}>{dayjs(startDate).format("DD/MM/YYYY")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={issTransitsScreenStyles.dateRow.field} onPress={() => openDatePicker("end")}>
                  <Text style={issTransitsScreenStyles.dateRow.field.label}>{t("screen.dateRange.end")}</Text>
                  <Text style={issTransitsScreenStyles.dateRow.field.value}>{dayjs(endDate).format("DD/MM/YYYY")}</Text>
                </TouchableOpacity>
              </View>

              {Platform.OS === "android" && activeDatePicker && (
                <DateTimePicker
                  value={activeDatePicker === "start" ? startDate : endDate}
                  mode="date"
                  display="default"
                  minimumDate={activeDatePicker === "end" ? startDate : undefined}
                  onValueChange={handleDatePickerChange}
                  onDismiss={() => setActiveDatePicker(null)}
                />
              )}

              {Platform.OS === "ios" && (
                <Modal
                  visible={activeDatePicker !== null}
                  animationType="slide"
                  transparent
                  statusBarTranslucent
                  navigationBarTranslucent
                  onRequestClose={closeIosDatePicker}
                >
                  <View style={issTransitsScreenStyles.pickerSheet.backdrop}>
                    <Pressable style={issTransitsScreenStyles.pickerSheet.dismissArea} onPress={closeIosDatePicker} />

                    <View style={[issTransitsScreenStyles.pickerSheet.container, { paddingBottom: spacing.modalSheet.bottom + insets.bottom }]}>
                      <View style={issTransitsScreenStyles.pickerSheet.container.header}>
                        <Text style={issTransitsScreenStyles.pickerSheet.container.header.title}>
                          {activeDatePicker === "start" ? t("screen.dateRange.picker.startTitle") : t("screen.dateRange.picker.endTitle")}
                        </Text>
                        <TouchableOpacity onPress={closeIosDatePicker} accessibilityRole="button" hitSlop={10}>
                          <X color={app_colors.primary.main} size={20} />
                        </TouchableOpacity>
                      </View>

                      {activeDatePicker && (
                        <DateTimePicker
                          value={activeDatePicker === "start" ? startDate : endDate}
                          mode="date"
                          display="spinner"
                          minimumDate={activeDatePicker === "end" ? startDate : undefined}
                          onValueChange={handleDatePickerChange}
                        />
                      )}

                      <TouchableOpacity style={issTransitsScreenStyles.pickerSheet.container.doneButton} onPress={closeIosDatePicker}>
                        <Text style={issTransitsScreenStyles.pickerSheet.container.doneButton.text}>{t("screen.dateRange.picker.done")}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Modal>
              )}

              <Button
                label={t("screen.search")}
                onPress={() => runSearch("range")}
                disabled={!effectiveLocation || isSearching}
                loading={searchMode === "range" && isSearching}
              />
            </View>

            <View style={issTransitsScreenStyles.section}>
              <Button
                label={t("screen.findNext.button")}
                variant="info"
                onPress={() => runSearch("next")}
                disabled={!effectiveLocation || isSearching}
                loading={searchMode === "next" && isSearching}
              />
              <Text style={issTransitsScreenStyles.disclaimer}>{t("screen.findNext.disclaimer")}</Text>
            </View>

            {
              isSearching ? (
                <ActivityIndicator size="large" color={app_colors.accent.main} style={issTransitsScreenStyles.loader} />
              ) : transits === null ? (
                <Text style={issTransitsScreenStyles.emptyState}>
                  {searchMode === "next" ? t("screen.emptyNext", { days: NEXT_TRANSIT_MAX_DAYS }) : t("screen.empty")}
                </Text>
              ) : transits.length > 0 ? (
                <View style={issTransitsScreenStyles.list}>
                  {transits.map((transit) => (
                    <TransitCard key={transit.midDate.getTime()} transit={transit} onPress={() => handleTransitPress(transit)} />
                  ))}
                </View>
              ) : (
                <Text style={issTransitsScreenStyles.emptyState}>
                  {searchMode === "next" ? t("screen.emptyNext", { days: NEXT_TRANSIT_MAX_DAYS }) : t("screen.empty")}
                </Text>
              )
            }

            <View style={issTransitsScreenStyles.section}>
                  <InfoCard icon={Info} title={t("screen.explanation.whatTitle")} description={t("screen.explanation.whatDescription")} />

                  <SectionHeader title={t("screen.explanation.paramsTitle")} />
                  <View style={issTransitsScreenStyles.explanationCard}>
                    {([
                      ["angularSize", "details.stats.angularSize"],
                      ["position", "details.stats.position"],
                      ["duration", "details.stats.duration"],
                      ["missDistance", "details.stats.missDistance"],
                    ] as const).map(([paramKey, titleKey], index) => (
                      <View
                        key={paramKey}
                        style={[issTransitsScreenStyles.explanationCard.item, index < 3 && issTransitsScreenStyles.explanationCard.item.withBorder]}
                      >
                        <Text style={issTransitsScreenStyles.explanationCard.item.title}>{t(titleKey)}</Text>
                        <Text style={issTransitsScreenStyles.explanationCard.item.description}>{t(`screen.explanation.params.${paramKey}`)}</Text>
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

export default IssTransitsScreen;
