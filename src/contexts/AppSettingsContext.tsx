import React, { ReactNode, createContext, useContext, useState } from 'react'
import { Dimensions, View } from 'react-native'

const AppSettingsContext = createContext<any>({})

export const useSettings = () => {
  return useContext(AppSettingsContext)
}

interface AppSettingsProviderProps {
  children: ReactNode
}

export function AppSettingsProvider({ children }: AppSettingsProviderProps) {

  const [isNightMode, setIsNightMode] = useState<boolean>(false)

  const values = {
    isNightMode,
    setIsNightMode,
  }

  return (
    <AppSettingsContext.Provider value={values}>
        {children}
      <View style={{position: 'absolute', backgroundColor: 'red', height: Dimensions.get('screen').height, width: Dimensions.get('screen').width, opacity: isNightMode ? .6 : 0}}/>
    </AppSettingsContext.Provider>
  )
}
