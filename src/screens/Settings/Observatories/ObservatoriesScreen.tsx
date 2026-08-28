import { Platform, Text, TouchableOpacity, View } from "react-native"
import { useEffect, useRef, useState } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { observatoriesScreenStyles } from "./ObservatoriesScreen.styles";
import { ScreenHeader } from "../../../components/ScreenHeader/ScreenHeader";
import ChipsContainer from "../../../components/ChipsContainer/ChipsContainer";
import { LocateFixed, MapPinPlusIcon, Plus } from "lucide-react-native";
import { app_colors } from "../../../helpers/variables";
import SwitchButton from "../../../components/SwitchButton/SwitchButton";
import { useUserDataStore } from "../../../store/userData.store";
import ObservatoryCard from "./ObservatoryCard/ObservatoryCard";
import { globalStyles } from "../../../helpers/globalStyles";
import { router } from "expo-router";
import { useCurrentGpsPosition } from "../../../hooks/useCurrentGpsPosition";

const ObservatoriesScreen = () => {

  const userObservatories = useUserDataStore((state) => state.observatories);
  const activeObservatoryId = useUserDataStore((state) => state.activeObservatoryId);
  const setActiveObservatoryId = useUserDataStore((state) => state.setActiveObservatoryId);

  const currentUserLocation = useCurrentGpsPosition();

  const mapRef = useRef<MapView>(null);

  const [isEnabled, setIsEnabled] = useState(activeObservatoryId === null);
  const toggleGpsUsage = () => {
    if(userObservatories.length === 0){
      console.log("[ObservatoriesScreen] No observatory available, cannot disable GPS usage");
      return;
    }

    setIsEnabled(prev => !prev);
    setActiveObservatoryId(!isEnabled ? null : userObservatories.length > 0 ? userObservatories[0].id : null);
    console.log("[ObservatoriesScreen] "+ (!isEnabled ? "GPS usage enabled" : "GPS usage disabled, using first observatory as active : " + (userObservatories.length > 0 ? userObservatories[0].name : "No observatory available")));
  }

  const handleAddObservatory = () => {
    console.log("Add new observatory button pressed");
    router.push("/settings/observatories/addNewObservatory");
  }

  useEffect(() => {
    if (currentUserLocation.position) {
      mapRef.current?.animateToRegion({
        latitude: currentUserLocation.position.latitude,
        longitude: currentUserLocation.position.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }, 1000);
    }
  }, [currentUserLocation.position]);

  return (
    <View style={observatoriesScreenStyles.screen}>
      <ScreenHeader title="Vos observatoires" main={false} />
      <View style={observatoriesScreenStyles.content}>
        <View style={observatoriesScreenStyles.mapContainer}>
          <MapView
            ref={mapRef}
            style={observatoriesScreenStyles.mapContainer.map}
            provider={PROVIDER_GOOGLE}
            onMapReady={() => {console.log("Map is ready");}}

            initialRegion={{
              latitude: 0,
              longitude: 0,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}

            mapType="standard"
            showsCompass
            showsUserLocation={isEnabled}
          >
          </MapView>

        </View>

        <ChipsContainer
          chips={[
            {
              title: "Observatoires enregistrés",
              value: userObservatories.length.toString(),
            },
          ]}
        />

        <View style={observatoriesScreenStyles.useGpsContainer}>
          <View style={observatoriesScreenStyles.useGpsContainer.content}>
            <LocateFixed color={app_colors.yellow.light} size={24} />
            <View>
              <Text style={observatoriesScreenStyles.useGpsContainer.content.title}>Utiliser ma position actuelle</Text>
              <Text style={observatoriesScreenStyles.useGpsContainer.content.subtitle}>Priorité sur tous les autres lieux</Text>
            </View>
          </View>
          {/* Make a custom switch button component to enable/disable GPS usage */}
          <SwitchButton
            isEnabled={isEnabled}
            onToggle={toggleGpsUsage}
          />
        </View>

        <View style={observatoriesScreenStyles.observatoriesList}>
          <Text style={globalStyles.categoryTitle}>Vos observatoires</Text>
          {
            userObservatories.length === 0 && (
              <Text style={observatoriesScreenStyles.observatoriesList.emptyListText}>Vous n'avez pas encore ajouté d'observatoire.</Text>
            )
          }
          {
            userObservatories.map((observatory) => (
              <ObservatoryCard key={observatory.id} observatory={observatory} active={observatory.id === activeObservatoryId}/>
            ))
          }

          <TouchableOpacity style={observatoriesScreenStyles.observatoriesList.addObservatoryButton} onPress={handleAddObservatory}>
            <MapPinPlusIcon color={app_colors.accent.main} size={16} />
            <Text style={observatoriesScreenStyles.observatoriesList.addObservatoryButton.text}>Ajouter un observatoire</Text>
          </TouchableOpacity>
        </View>

      </View>
    </View>
  )
}

export default ObservatoriesScreen;