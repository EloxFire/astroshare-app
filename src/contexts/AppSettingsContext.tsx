import React, { ReactNode, createContext, useContext, useState } from 'react'
import { Dimensions, View } from 'react-native'
import { LocationObject } from '../helpers/types/LocationObject'

const AppSettingsContext = createContext<any>({})

export const useSettings = () => {
  return useContext(AppSettingsContext)
}

interface AppSettingsProviderProps {
  children: ReactNode
}

export function AppSettingsProvider({ children }: AppSettingsProviderProps) {

  const [isNightMode, setIsNightMode] = useState<boolean>(false)
  const [currentUserLocation, setCurrentUserLocation] = useState<LocationObject | null>(null)

  const values = {
    isNightMode,
    setIsNightMode,
    currentUserLocation,
    setCurrentUserLocation,
  }

  return (
    <AppSettingsContext.Provider value={values}>
      {children}
    </AppSettingsContext.Provider>
  )
}
