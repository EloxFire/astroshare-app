import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { LocationObject } from '../helpers/types/LocationObject'
import { askLocationPermission } from '../helpers/scripts/permissions/askLocationPermission'
import { Alert } from 'react-native'

const AppSettingsContext = createContext<any>({})

export const useSettings = () => {
  return useContext(AppSettingsContext)
}

interface AppSettingsProviderProps {
  children: ReactNode
}

export function AppSettingsProvider({ children }: AppSettingsProviderProps) {

  const [isNightMode, setIsNightMode] = useState<boolean>(false)
  const [locationPermissions, setLocationPermissions] = useState<boolean>(false)
  const [currentUserLocation, setCurrentUserLocation] = useState<LocationObject | null>(null)

  useEffect(() => {
    (async () => {
      const hasLocationPermission = await askLocationPermission();
      if (!hasLocationPermission) {
        console.log("No location permission");
        Alert.alert("Accès à la localisation", "L'application a besoin de votre localisation pour fonctionner correctement. Veuillez autoriser l'accès à votre localisation dans les paramètres de l'application.")
        return;
      }

      console.log("Location permission granted");
      setLocationPermissions(true);
    })();
  }, []);

  const values = {
    isNightMode,
    setIsNightMode,
    currentUserLocation,
    setCurrentUserLocation,
    locationPermissions
  }

  return (
    <AppSettingsContext.Provider value={values}>
      {children}
    </AppSettingsContext.Provider>
  )
}
