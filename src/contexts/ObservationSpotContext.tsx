import React, { ReactNode, createContext, useContext, useState } from 'react'
import { storeData } from '../helpers/storage'
const ObservationSpotContext = createContext<any>({})

export const useSpot = () => {
  return useContext(ObservationSpotContext)
}

interface ObservationSpotProviderProps {
  children: ReactNode
}

export function ObservationSpotProvider({ children }: ObservationSpotProviderProps) {

  const [spotElevation, setSpotElevation] = useState<number>(0)

  const values = {
    spotElevation,
    handleSpotElevation: (newElevation: number) => {
      setSpotElevation(newElevation)
      storeData('hasChangedSpotElevation', 'true')
    }
  }

  return (
    <ObservationSpotContext.Provider value={values}>
      {children}
    </ObservationSpotContext.Provider>
  )
}
