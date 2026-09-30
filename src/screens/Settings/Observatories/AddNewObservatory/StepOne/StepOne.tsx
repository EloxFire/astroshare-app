import { Search, LocateFixedIcon, DraftingCompass, Lightbulb, ArrowRight } from "lucide-react-native"
import { Trans, useTranslation } from "react-i18next"
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native"
import MapView, { PROVIDER_GOOGLE } from "react-native-maps"
import MapTargetMarker from "../../../../../components/MapTargetMarker/MapTargetMarker"
import InfoCard from "../../../../../components/cards/InfoCard/InfoCard"
import { infoCardStyles } from "../../../../../components/cards/InfoCard/InfoCard.styles"
import ListCard from "../../../../../components/cards/ListCard/ListCard"
import { InputWithIcon } from "../../../../../components/InputWithIcon/InputWithIcon"
import { getLightPollutionIndicatorLabel } from "../../../../../helpers/api/geocoding/geocoding"
import { globalStyles } from "../../../../../helpers/globalStyles"
import { convertDecimalLatitudeToDMS, convertDecimalLongitudeToDMS } from "../../../../../helpers/location/convert"
import { app_colors } from "../../../../../helpers/variables"
import TabSwitch from "../../../../Tools/MoonCalendar/components/TabSwitch/TabSwitch"
import { addNewObservatoryScreenStyles } from "../addNewObservatoryScreen.styles"
import { useAddObservatoryForm } from "../AddObservatoryFormContext"
import { useEffect, useRef, useState } from "react"
import { useLocation } from "../../../../../context/GpsContext"
import { SelectInput } from "../../../../../components/SelectInput/SelectInput"
import { observatoriesAccessTypes, observatoriesEquipments, observatoriesTypes } from "../../../../../helpers/observatories/observatories"
import SwitchButton from "../../../../../components/SwitchButton/SwitchButton"
import { ObservatoryAccess, ObservatoryEquipment } from "../../../../../types/observatory"
import Badge from "../../../../../components/Badges/Badge/Badge"

const StepOne = () => {

  const { t } = useTranslation("settings/addObservatory");
  const { fetchGpsLocation, location, fetchLocation, gpsLoading, searchLoading } = useLocation();
  const { newObservatory, setNewObservatory, setCurrentFormStep } = useAddObservatoryForm();
  const mapRef = useRef<MapView>(null);


  const [observatoryName, setObservatoryName] = useState<string>("");
  const [observatoryElevation, setObservatoryElevation] = useState<string>("");
  const [observatoryAccessType, setObservatoryAccessType] = useState<ObservatoryAccess>("car");
  const [observatoryEquipments, setObservatoryEquipments] = useState<ObservatoryEquipment[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchLatitude, setSearchLatitude] = useState<string>("");
  const [searchLongitude, setSearchLongitude] = useState<string>("");


  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const locData = await fetchLocation(`${latitude}::${longitude}`);
    setNewObservatory(locData);

    setSearchLatitude(latitude.toFixed(5).toString());
    setSearchLongitude(longitude.toFixed(5).toString());

    if(observatoryName.trim() === ""){
      setObservatoryName(locData.display_name || locData.name || "");
    }
  }

  const handleFetchCurrentLocation = async () => {
    const loc = await fetchGpsLocation();

    if(loc){
      setNewObservatory(loc);
      mapRef.current?.animateToRegion({
        latitude: loc.latitude,
        longitude: loc.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    }
  }

  return (
    <ScrollView>
      <View style={[globalStyles.screen.content, {paddingBottom: 50}]}>

        <InputWithIcon
          fill
          label={t('stepOne.form.name.label')}
          // icon={Search}
          placeholder={t("stepOne.form.name.placeholder")}
          value={observatoryName}
          onChangeText={setObservatoryName}
          action={() => {}}
        />

        <View style={addNewObservatoryScreenStyles.mapContainer}>
          <MapView
            ref={mapRef}
            style={addNewObservatoryScreenStyles.mapContainer.map}
            provider={PROVIDER_GOOGLE}

            initialRegion={{
              latitude: location?.latitude || 48.856724859667835,
              longitude: location?.longitude || 2.349875271320343,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}

            mapType="standard"
            onPress={handleMapPress}
            rotateEnabled={false}
          >
            {
              newObservatory && (
                <MapTargetMarker
                  coordinate={{
                    latitude: newObservatory.latitude,
                    longitude: newObservatory.longitude,
                  }}
                  title={t("stepOne.selectedLocationMarker")}
                />
              )
            }
          </MapView>
        </View>

        <View style={addNewObservatoryScreenStyles.coordsContainer}>
          <InputWithIcon
            fill
            label={t("stepOne.form.location.latitude.label")}
            placeholder={t("stepOne.form.location.latitude.placeholder")}
            value={searchLatitude}
            onChangeText={setSearchLatitude}
            action={() => {}}
            keyboardType="numeric"
          />
          <InputWithIcon
            fill
            label={t("stepOne.form.location.longitude.label")}
            placeholder={t("stepOne.form.location.longitude.placeholder")}
            value={searchLongitude}
            onChangeText={setSearchLongitude}
            action={() => {}}
            keyboardType="numeric"
          />
          <InputWithIcon
            fill
            label={t("stepOne.form.location.altitude.label")}
            placeholder={t("stepOne.form.location.altitude.placeholder")}
            value={observatoryElevation}
            onChangeText={setObservatoryElevation}
            action={() => {}}
            keyboardType="numeric"
          />
        </View>

        <InfoCard
          icon={Lightbulb}
          title={
            <Trans i18nKey="stepOne.lightPollution.title" ns="settings/addObservatory" values={{ bortle: newObservatory?.light_pollution?.bortle ?? "?", sqm: newObservatory?.light_pollution?.mpsas ?? "?" }}>
              <Text style={infoCardStyles.card.infos.title.bortle}>{newObservatory?.light_pollution?.bortle ?? "?"}</Text>
              <Text style={infoCardStyles.card.infos.title.highlight}>{`(${newObservatory?.light_pollution?.mpsas ?? "?"}mag/arcsec²)`}</Text>
            </Trans>
          }
          description={
            <Trans
              i18nKey="stepOne.lightPollution.description"
              ns="settings/addObservatory"
              values={{
                source: newObservatory?.light_pollution?.source || t("stepOne.lightPollution.noSource"),
                indicator: newObservatory?.light_pollution ? getLightPollutionIndicatorLabel(newObservatory.light_pollution.bortle) : "",
              }}
            >
              <Text style={infoCardStyles.card.infos.description.highlight}>
                {newObservatory?.light_pollution ? getLightPollutionIndicatorLabel(newObservatory.light_pollution.bortle) : "?"}
              </Text>
            </Trans>
          }
          additionnalDescriptionStyle={{opacity: .8, fontFamily: 'DMMonoRegular', fontSize: 10}}
        />

        <Text style={[globalStyles.categoryTitle, {fontSize: 12}]}>{t("stepOne.form.type.label")}</Text>
        <View style={addNewObservatoryScreenStyles.caracteristicsContainer}>
          <SelectInput
            fill
            options={observatoriesTypes.map((type) => ({ value: type.id, label: type.label }))}
            // label={t("stepOne.form.type.label")}
            placeholder={t("stepOne.form.type.placeholder")}
            value={newObservatory?.type ?? null}
            presentation="sheet"
            onChange={(value) => {
              if (!newObservatory) return;
              setNewObservatory({ ...newObservatory, type: value });
            }}
          />

          <TabSwitch
            fitContent
            activeTabForegroundColor={app_colors.accent.main}
            tabs={observatoriesAccessTypes.map((accessType) => ({
              text: t(`stepOne.form.type.options.${accessType.id}`),
              icon: accessType.icon,
            }))}
            activeTab={observatoriesAccessTypes.findIndex((accessType) => accessType.id === observatoryAccessType)}
            onTabPress={(index) => {
              const selectedAccessType = observatoriesAccessTypes[index];
              setObservatoryAccessType(selectedAccessType.id as ObservatoryAccess);
              if (!newObservatory) return;
              setNewObservatory({ ...newObservatory, access: selectedAccessType.id as ObservatoryAccess });
            }}
          />
        </View>

        <View style={addNewObservatoryScreenStyles.equipmentsContainer}>
          <Text style={[globalStyles.categoryTitle, {fontSize: 12}]}>{t("stepOne.form.equipments.label")}</Text>
          <View style={addNewObservatoryScreenStyles.equipmentsContainer.badges}>
            {
              observatoriesEquipments.map((equipment) => (
                <Badge
                  key={equipment.id}
                  icon={equipment.icon}
                  text={equipment.label}
                  active={observatoryEquipments.includes(equipment.id as ObservatoryEquipment)}
                  backgroundColor={observatoryEquipments.includes(equipment.id as ObservatoryEquipment) ? app_colors.accent.main : app_colors.accent.light}
                  foregroundColor={observatoryEquipments.includes(equipment.id as ObservatoryEquipment) ? app_colors.white : app_colors.primary.main}
                  action={() => {
                    if (!newObservatory) return;
                    const updatedEquipment = observatoryEquipments.includes(equipment.id as ObservatoryEquipment)
                      ? observatoryEquipments.filter((id) => id !== equipment.id)
                      : [...observatoryEquipments, equipment.id as ObservatoryEquipment];
                    setObservatoryEquipments(updatedEquipment);
                  }}
                />
              ))
            }
          </View>
        </View>

        <TouchableOpacity style={addNewObservatoryScreenStyles.nextButton} onPress={() => {}}>
          <Text style={{color: app_colors.white, fontFamily: 'DMMonoMedium', fontSize: 16}}>{t("nextButton")}</Text>
          <ArrowRight color={app_colors.white} size={20} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default StepOne