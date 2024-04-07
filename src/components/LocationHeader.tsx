import React, { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Image, Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { locationHeaderStyles } from '../styles/components/locationHeader'
import { askLocationPermission } from '../helpers/scripts/permissions/askLocationPermission';
import * as Location from 'expo-location';
import { LocationObject } from '../helpers/types/LocationObject';
import { getLocationName } from '../helpers/api/convertCityName';
import { app_colors } from '../helpers/constants';
import LocationModal from './LocationModal';
import { convertDDtoDMS } from '../helpers/scripts/convertDDtoDMSCoords';
import { useSettings } from '../contexts/AppSettingsContext';

export default function LocationHeader({navigation}: any) {

  const [locationLoading, setLocationLoading] = useState<boolean>(true);

  const [isModalShown, setIsModalShown] = useState<boolean>(false);
  const {currentUserLocation, setCurrentUserLocation} = useSettings();

  useEffect(() => {
    (async () => {
      const hasLocationPermission = await askLocationPermission();
      if (!hasLocationPermission) {
        console.log("No location permission");
        return;
      }

      console.log("Location permission granted");

      let location = await Location.getCurrentPositionAsync({});
      const coords: LocationObject = {lat: location.coords.latitude, lon: location.coords.longitude}
      let name = await getLocationName(coords);

      const userCoords: LocationObject = {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        common_name: name[0].local_names.fr,
        country: name[0].country,
        dms: convertDDtoDMS(location.coords.latitude, location.coords.longitude)
      }
      
      setCurrentUserLocation(userCoords);
      setLocationLoading(false);
    })();
  }, []);

  const blinkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.linear
        }),
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.linear
        })
      ])
    ).start();
  }, []);

  const interpolated = blinkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0]
  });

  const handleModal = () => {
    if(!currentUserLocation) return;
    setIsModalShown(!isModalShown);
  }

  return (
    <TouchableWithoutFeedback onPress={() => handleModal()}>
      <View style={locationHeaderStyles.container}>
        <LocationModal visible={isModalShown} onClose={handleModal} coords={currentUserLocation!} />
        <TouchableOpacity style={locationHeaderStyles.container.location} onPress={() => handleModal()}>
          <View style={locationHeaderStyles.container.location.text}>
            <Text style={locationHeaderStyles.container.location.title}>Votre position</Text>
            {
              locationLoading ?
                <Animated.Text style={[locationHeaderStyles.container.location.value, {opacity: interpolated}]}>Acquisition GPS...</Animated.Text>
                :
                <Text style={locationHeaderStyles.container.location.value}>{currentUserLocation.common_name}</Text>
            }
          </View>
          <Image source={require('../../assets/icons/FiChevronDown.png')} />
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  )
}
