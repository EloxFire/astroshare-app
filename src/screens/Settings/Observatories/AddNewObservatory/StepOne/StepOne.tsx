import { Search, LocateFixedIcon, DraftingCompass, Lightbulb, ArrowRight } from "lucide-react-native"
import { Trans, useTranslation } from "react-i18next"
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native"
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
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

const StepOne = () => {

  const { t } = useTranslation("settings");
  const { fetchGpsLocation, location, fetchLocation, gpsLoading, searchLoading } = useLocation();
  const { newObservatory, setNewObservatory, setCurrentFormStep } = useAddObservatoryForm();
  const mapRef = useRef<MapView>(null);

  const [activeTab, setActiveTab] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchLatitude, setSearchLatitude] = useState<string>("");
  const [searchLongitude, setSearchLongitude] = useState<string>("");


  const handleMapPress = async (event: any) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const locData = await fetchLocation(`${latitude}::${longitude}`);
    setNewObservatory(locData);
  }

  const handleSearch = async () => {
    if(activeTab === 0){
      
      if(searchQuery.trim() === "") return;
      
      console.log("[StepOne] Recherche de localisation par nom :", searchQuery);
      const locData = await fetchLocation(searchQuery.trim());
      setNewObservatory(locData);
      if(locData){
        mapRef.current?.animateToRegion({
          latitude: locData.latitude,
          longitude: locData.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }, 1000);
      }
    }else {
      if(searchLatitude.trim() === "" || searchLongitude.trim() === "") return;
      const lat = parseFloat(searchLatitude);
      const lon = parseFloat(searchLongitude);

      if(isNaN(lat) || isNaN(lon)) return;

      console.log("[StepOne] Recherche de localisation par coordonnées :", lat, lon);
      

      const locData = await fetchLocation(`${lat}::${lon}`);
      setNewObservatory(locData);
      if(locData){
        mapRef.current?.animateToRegion({
          latitude: locData.latitude,
          longitude: locData.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }, 1000);
      }
    }
    return;
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

  const handleNextStep = () => {
    if(!newObservatory?.latitude || !newObservatory?.longitude) {
      console.log("[StepOne] Cannot proceed to next step, no valid location selected.");
      return;
    }

    console.log("[StepOne] Proceeding to next step with observatory:", newObservatory);
    setCurrentFormStep(2);
  }

  return (
    <ScrollView>
      <View style={[globalStyles.screen.content, {paddingBottom: 50}]}>
          <TabSwitch
            tabs={[
              t('addObservatory.stepOne.tabs.map'),
              t('addObservatory.stepOne.tabs.coords')
            ]}

            activeTab={activeTab}
            onTabPress={setActiveTab}
          />

          {
            activeTab === 0 && (
              <View style={{display: "flex", flexDirection: "column", gap: 10}}>
                <Text style={globalStyles.categoryTitle}>{t("addObservatory.stepOne.searchPrompt")}</Text>
                <View style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 5, marginBottom: 10}}>
                  <InputWithIcon
                    fill
                    icon={Search}
                    placeholder={t("addObservatory.stepOne.searchPlaceholder")}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    action={() => handleSearch()}
                    // suggestions={results?.map((result) => result.name) || []}
                    // onSuggestionPress={(suggestion) => {
                    //   setSearchQuery(suggestion);
                    //   setSubmittedQuery(suggestion);
                    // }}
                  />
                  <TouchableOpacity
                    onPress={() => handleSearch()}
                    disabled={searchLoading}
                    style={{ marginLeft: 5, padding: 10, backgroundColor: app_colors.primary.main, borderRadius: 5 }}
                  >
                    {
                      searchLoading ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <Search color="white" size={20} />
                      )
                    }
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleFetchCurrentLocation()}
                    disabled={gpsLoading}
                    style={{ marginLeft: 5, padding: 10, backgroundColor: app_colors.primary.main, borderRadius: 5 }}
                  >
                    {
                      gpsLoading ? (
                        <ActivityIndicator color="white" size="small" />
                      ) : (
                        <LocateFixedIcon color="white" size={20} />
                      )
                    }
                  </TouchableOpacity>
                </View>
              </View>
            )
          }

          {
            activeTab === 1 && (
              <View style={{display: "flex", flexDirection: "column", gap: 10}}>
                <Text style={globalStyles.categoryTitle}>{t("addObservatory.stepOne.searchCoordsPrompt")}</Text>

                <InputWithIcon
                  icon={DraftingCompass}
                  placeholder={t("addObservatory.stepOne.searchCoordsLatitudePlaceholder")}
                  value={searchLatitude}
                  onChangeText={setSearchLatitude}
                  action={() => {}}
                  keyboardType="numeric"
                />
                <InputWithIcon
                  icon={DraftingCompass}
                  placeholder={t("addObservatory.stepOne.searchCoordsLongitudePlaceholder")}
                  value={searchLongitude}
                  onChangeText={setSearchLongitude}
                  action={() => {}}
                  keyboardType="numeric"
                />

                <TouchableOpacity style={addNewObservatoryScreenStyles.validateButton} onPress={() => handleSearch()}>
                  <Text style={addNewObservatoryScreenStyles.validateButton.text}>{t("addObservatory.stepOne.searchCoords")}</Text>
                </TouchableOpacity>
              </View>
            )
          }

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
                  <Marker
                    coordinate={{
                      latitude: newObservatory.latitude,
                      longitude: newObservatory.longitude,
                    }}
                    title={t("addObservatory.stepOne.selectedLocationMarker")}
                  >
                    <View style={addNewObservatoryScreenStyles.mapContainer.map.marker.outer}>
                      <View style={addNewObservatoryScreenStyles.mapContainer.map.marker.inner} />
                    </View>
                  </Marker>
                )
              }
            </MapView>
          </View>

          <ListCard 
            items={[
              {
                title: t("addObservatory.stepOne.name"),
                value: newObservatory?.name || t("addObservatory.stepOne.noName", "Sans nom"),
              },
              {
                title: t("addObservatory.stepOne.latitude"),
                value: newObservatory ? convertDecimalLatitudeToDMS(newObservatory.latitude) : "...",
              },
              {
                title: t("addObservatory.stepOne.longitude"),
                value: newObservatory ? convertDecimalLongitudeToDMS(newObservatory.longitude) : "...",
              },
              {
                title: t("addObservatory.stepOne.altitude"),
                value: newObservatory ? (newObservatory.elevation ? t("common:units.meters", { value: Math.round(newObservatory.elevation) }) : t("addObservatory.stepOne.noAltitude")) : "...",
              }
            ]}
          />

          <InfoCard
            icon={Lightbulb}
            title={
              <Trans i18nKey="addObservatory.stepOne.lightPollution.title" ns="settings" values={{ bortle: newObservatory?.light_pollution?.bortle ?? "?", sqm: newObservatory?.light_pollution?.mpsas ?? "?" }}>
                <Text style={infoCardStyles.card.infos.title.bortle}>{newObservatory?.light_pollution?.bortle ?? "?"}</Text>
                <Text style={infoCardStyles.card.infos.title.highlight}>{`(${newObservatory?.light_pollution?.mpsas ?? "?"}mag/arcsec²)`}</Text>
              </Trans>
            }
            description={
              <Trans
                i18nKey="addObservatory.stepOne.lightPollution.description"
                ns="settings"
                values={{
                  source: newObservatory?.light_pollution?.source || t("addObservatory.stepOne.lightPollution.noSource"),
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

          <TouchableOpacity style={addNewObservatoryScreenStyles.nextButton} onPress={() => handleNextStep()}>
            <Text style={{color: app_colors.white, fontFamily: 'DMMonoMedium', fontSize: 16}}>{t("addObservatory.nextButton")}</Text>
            <ArrowRight color={app_colors.white} size={20} />
          </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

export default StepOne