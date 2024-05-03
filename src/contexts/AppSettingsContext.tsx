import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { LocationObject } from '../helpers/types/LocationObject'
import { askLocationPermission } from '../helpers/scripts/permissions/askLocationPermission'
import { Alert, Dimensions, View } from 'react-native'
import { convertDDtoDMS } from '../helpers/scripts/convertDDtoDMSCoords'
import { getLocationName } from '../helpers/api/getLocationFromCoords'
import * as Location from 'expo-location'
import Toast from 'react-native-root-toast';
import { hideToast } from '../helpers/scripts/hideToast'
import { showToast } from '../helpers/scripts/showToast'
import { app_colors } from '../helpers/constants'

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
  const [currentUserHorizon, setCurrentUserHorizon] = useState<number>(0)

  useEffect(() => {
    (async () => {
      // Check if location permission is granted
      const hasLocationPermission = await askLocationPermission();
      if (!hasLocationPermission) {
        setLocationLoading(false);
        showToast({ message: 'Vous devez autoriser l\'accès à la localisation pour utiliser l\'application', duration: Toast.durations.LONG, type: 'error' });
        return;
      }

      setLocationPermissions(true);
      showToast({ message: 'Acquisition de votre position', duration: Toast.durations.SHORT, type: 'success' });
      
      // Get user current position
      await getUserCurrentPosition();
    })();
  }, []);
  
  const getUserCurrentPosition = async () => {
    setLocationLoading(true);
    showToast({ message: 'Acquisition de votre position', duration: Toast.durations.SHORT, type: 'success' });

    try {
      let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
      const coords: LocationObject = { lat: location.coords.latitude, lon: location.coords.longitude }
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
      setCurrentUserHorizon(90 - userCoords.lat)
      setLocationLoading(false);
      showToast({ message: 'Signal trouvé : ' + userCoords.common_name, duration: Toast.durations.LONG, type: 'success' });
    } catch (error) {
      console.log("Error while getting location name : ", error);
      
      showToast({ message: 'Erreur lors de l\'acquisition de votre position', duration: Toast.durations.LONG, type: 'error' });
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
    locationLoading,
    currentUserHorizon,
  }

  return (
    <AppSettingsContext.Provider value={values}>
      {children}
      {
        isNightMode && (
          <View
            pointerEvents='none'
            style={{
              backgroundColor: app_colors.red_twenty,
              height: Dimensions.get('screen').height,
              width: Dimensions.get('screen').width,
              position: 'absolute',
              zIndex: 999,
            }}
          />
        )
      }
    </AppSettingsContext.Provider>
  )
}
