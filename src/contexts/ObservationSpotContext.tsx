import React, { ReactNode, createContext, useContext, useState } from 'react'
import { getObject, storeData, storeObject } from '../helpers/storage'
import { TViewPoint } from '../helpers/types/ViewPoint'
const ObservationSpotContext = createContext<any>({})

export const useSpot = () => {
  return useContext(ObservationSpotContext)
}

interface ObservationSpotProviderProps {
  children: ReactNode
}

export function ObservationSpotProvider({ children }: ObservationSpotProviderProps) {

  const [currentSpotElevation, setCurrentSpotElevation] = useState<number>(0)

  const handleCurrentSpotElevation = (newElevation: number) => {
    setCurrentSpotElevation(newElevation)
    storeData('hasChangedSpotElevation', 'true')
  }

  const addNewSpot = async (newSpot: TViewPoint) => {
    const temp = await getObject('viewPoints')
    console.log(temp);

    if (temp) {
      temp.push(newSpot)
      storeObject('viewPoints', temp)
    } else {
      storeObject('viewPoints', [newSpot])
    }
  }

  const deleteSpot = async (spotTitle: string) => {
    const temp = await getObject('viewPoints')
    if (temp) {
      const newSpots = temp.filter((spot: TViewPoint) => spot.title !== spotTitle)
      storeObject('viewPoints', newSpots)
    }
  }

  const values = {
    currentSpotElevation,
    handleCurrentSpotElevation,
    addNewSpot,
    deleteSpot,
  }

  return (
    <ObservationSpotContext.Provider value={values}>
      {children}
    </ObservationSpotContext.Provider>
  )
}
