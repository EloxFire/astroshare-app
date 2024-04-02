import React, { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Image, Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { locationHeaderStyles } from '../styles/components/locationHeader'
import { askLocationPermission } from '../helpers/scripts/permissions/askLocationPermission';
import * as Location from 'expo-location';
import { LocationObject } from '../helpers/types/LocationObject';
import { getLocationName } from '../helpers/api/convertCityName';
import { app_colors } from '../helpers/constants';
import LocationModal from './LocationModal';

export default function LocationHeader({navigation}: any) {

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [locationCoords, setLocationCoords] = useState<LocationObject | null>(null);
  const [locationLoading, setLocationLoading] = useState<boolean>(true);

  const [isModalShown, setIsModalShown] = useState<boolean>(false);

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
      
      setLocationName(name[0].local_names.fr);
      setLocation(location);
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
    console.log("Modal" + isModalShown);
    setIsModalShown(!isModalShown);
  }

  return (
    <TouchableWithoutFeedback onPress={() => handleModal()}>
      <View style={locationHeaderStyles.container}>
        <LocationModal visible={isModalShown} onClose={handleModal} />
        <TouchableOpacity style={locationHeaderStyles.container.location} onPress={() => handleModal()}>
          <Text style={locationHeaderStyles.container.location.title}>Votre position</Text>
          {
            locationLoading ?
              <Animated.Text style={[locationHeaderStyles.container.location.value, {opacity: interpolated}]}>Acquisition GPS...</Animated.Text>
              :
              <Text style={locationHeaderStyles.container.location.value}>{locationName}</Text>
          }
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {console.log('Settings pressed')}} style={locationHeaderStyles.container.location}>
          <Image source={require('../../assets/icons/FiSettings.png')}/>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
  )
}
