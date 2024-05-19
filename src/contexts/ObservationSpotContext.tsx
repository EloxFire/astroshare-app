import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { getObject, storeData, storeObject } from '../helpers/storage'
import { TViewPoint } from '../helpers/types/ViewPoint'
import { storageKeys } from '../helpers/constants'
const ObservationSpotContext = createContext<any>({})

export const useSpot = () => {
  return useContext(ObservationSpotContext)
}

interface ObservationSpotProviderProps {
  children: ReactNode
}

export function ObservationSpotProvider({ children }: ObservationSpotProviderProps) {

  const [currentSpotElevation, setCurrentSpotElevation] = useState<number>(0)
  const [viewPoints, setViewPoints] = useState<TViewPoint[]>([])
  const [selectedSpot, setSelectedSpot] = useState<TViewPoint | null>(null)

  useEffect(() => {
    (async () => {
      const spots = await getObject(storageKeys.viewPoints)
      const spot = await getObject(storageKeys.selectedSpot)
      if (spots) setViewPoints(spots)
      if (spot) setSelectedSpot(spot)
    })()
  }, [])


  const handleCurrentSpotElevation = (newElevation: number) => {
    setCurrentSpotElevation(newElevation)
    storeData(storageKeys.hasChangedCurrentSpotElevation, 'true')
  }

  const addNewSpot = async (newSpot: TViewPoint) => {
    const temp = await getObject(storageKeys.viewPoints)
    console.log(temp);

    if (temp) {
      temp.push(newSpot)
      storeObject(storageKeys.viewPoints, temp)
    } else {
      storeObject(storageKeys.viewPoints, [newSpot])
    }

    storeData(storageKeys.hasAddedSpot, 'true')
    refreshViewPoints()
  }

  const refreshViewPoints = async () => {
    const temp = await getObject(storageKeys.viewPoints)
    if (temp) {
      setViewPoints(temp)
    }
  }

  const deleteSpot = async (spotTitle: string) => {
    const temp = await getObject(storageKeys.viewPoints)
    if (temp) {
      const newSpots = temp.filter((spot: TViewPoint) => spot.title !== spotTitle)
      storeObject(storageKeys.viewPoints, newSpots)
    }

    refreshViewPoints()
  }

  const changeSelectedSpot = (spot: TViewPoint) => {
    setSelectedSpot(spot)
    storeObject(storageKeys.selectedSpot, spot)
  }

  const values = {
    currentSpotElevation,
    handleCurrentSpotElevation,
    addNewSpot,
    deleteSpot,
    viewPoints,
    refreshViewPoints,
    changeSelectedSpot,
    selectedSpot,
  }

  return (
    <ObservationSpotContext.Provider value={values}>
      {children}
    </ObservationSpotContext.Provider>
  )
}
