import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { LocationObject } from '../helpers/types/LocationObject'
import { askLocationPermission } from '../helpers/scripts/permissions/askLocationPermission'
import { Alert } from 'react-native'
import { convertDDtoDMS } from '../helpers/scripts/convertDDtoDMSCoords'
import { getLocationName } from '../helpers/api/getLocationFromCoords'
import * as Location from 'expo-location'
import Toast from 'react-native-root-toast';
import { hideToast } from '../helpers/scripts/hideToast'

const AppSettingsContext = createContext<any>({})

export const useSettings = () => {
  return useContext(AppSettingsContext)
}

interface AppSettingsProviderProps {
  children: ReactNode
}

export function AppSettingsProvider({ children }: AppSettingsProviderProps) {

  const [isNightMode, setIsNightMode] = useState<boolean>(false)

  // Location related states
  const [locationPermissions, setLocationPermissions] = useState<boolean>(false)
  const [currentUserLocation, setCurrentUserLocation] = useState<LocationObject | null>(null)
  const [locationLoading, setLocationLoading] = useState<boolean>(true)

  useEffect(() => {
    let locationToast;
    (async () => {
      // Check if location permission is granted
      const hasLocationPermission = await askLocationPermission();
      if (!hasLocationPermission) {
        setLocationLoading(false);
        locationToast = Toast.show('Vous devez autoriser l\'accès à la localisation pour utiliser l\'application', { duration: Toast.durations.LONG, position: Toast.positions.BOTTOM });
        hideToast(locationToast);
        return;
      }

      setLocationPermissions(true);
      locationToast = Toast.show('Acquisition de votre position', { duration: Toast.durations.LONG, position: Toast.positions.BOTTOM });
      hideToast(locationToast);

      // Get user current position
      await getUserCurrentPosition();
    })();
  }, []);

  const getUserCurrentPosition = async () => {
    setLocationLoading(true);

    let toast = Toast.show('Acquisition de votre position', { duration: Toast.durations.LONG, position: Toast.positions.BOTTOM });
    setTimeout(() => {
      Toast.hide(toast);
    }, 3000)

    try {
      let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
      const coords: LocationObject = { lat: location.coords.latitude, lon: location.coords.longitude }
      let toast1 = Toast.show(`${location.coords.latitude} ${location.coords.longitude}`, { duration: Toast.durations.LONG, position: Toast.positions.BOTTOM });
      setTimeout(() => {
        Toast.hide(toast1);
      }, 8000)
      let name = await getLocationName(coords);

      const userCoords: LocationObject = {
        lat: location.coords.latitude,
        lon: location.coords.longitude,
        common_name: name.local_names.fr,
        country: name.country,
        state: name.state,
        dms: convertDDtoDMS(location.coords.latitude, location.coords.longitude)
      }
  
      setCurrentUserLocation(userCoords);
      setLocationLoading(false);
      let toast = Toast.show('Signal trouvé : ' + name.local_names.fr, { duration: Toast.durations.LONG, position: Toast.positions.BOTTOM });
      setTimeout(() => {
        Toast.hide(toast);
      }, 3000)
    } catch (error) {
      console.log("Error while getting location name : ", error);
      
      let toast = Toast.show('Erreur name...' + error, { duration: Toast.durations.LONG, position: Toast.positions.BOTTOM });
      setTimeout(() => {
        Toast.hide(toast);
      }, 3000)
      setLocationLoading(false);
    }
  }

  const values = {
    isNightMode,
    setIsNightMode,
    getUserCurrentPosition,
    currentUserLocation,
    setCurrentUserLocation,
    locationPermissions,
    locationLoading
  }

  return (
    <AppSettingsContext.Provider value={values}>
      {children}
    </AppSettingsContext.Provider>
  )
}
