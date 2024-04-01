import React, { useEffect, useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { locationHeaderStyles } from '../styles/components/locationHeader'
import { askLocationPermission } from '../helpers/scripts/permissions/askLocationPermission';
import * as Location from 'expo-location';
import { LocationObject } from '../helpers/types/LocationObject';
import { getLocationName } from '../helpers/api/convertCityName';

export default function LocationHeader({navigation}: any) {

  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [locationName, setLocationName] = useState<string | null>(null);
  const [locationCoords, setLocationCoords] = useState<LocationObject | null>(null);

  useEffect(() => {
    (async () => {
      
      const hasLocationPermission = await askLocationPermission();
      if (!hasLocationPermission) {
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      const coords: LocationObject = {lat: location.coords.latitude, lon: location.coords.longitude}
      let name = await getLocationName(coords);
      
      setLocationName(name[0].local_names.fr);
      setLocation(location);
    })();
  }, []);

  return (
    <View style={locationHeaderStyles.container}>
      <TouchableOpacity style={locationHeaderStyles.container.location}>
        <Text style={locationHeaderStyles.container.location.title}>Votre position</Text>
        <Text style={locationHeaderStyles.container.location.value}>{locationName}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => {console.log('Settings pressed')}} style={locationHeaderStyles.container.location}>
        <Image source={require('../../assets/icons/FiSettings.png')}/>
      </TouchableOpacity>
    </View>
  )
}
