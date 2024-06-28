import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { getObject, storeData, storeObject } from '../helpers/storage'
import { TViewPoint } from '../helpers/types/ViewPoint'
import { storageKeys } from '../helpers/constants'
import { Barometer } from 'expo-sensors'
const ObservationSpotContext = createContext<any>({})

export const useSpot = () => {
  return useContext(ObservationSpotContext)
}

interface ObservationSpotProviderProps {
  children: ReactNode
}

export function ObservationSpotProvider({ children }: ObservationSpotProviderProps) {

  const [viewPoints, setViewPoints] = useState<TViewPoint[]>([])
  const [selectedSpot, setSelectedSpot] = useState<TViewPoint | null>(null)
  const [defaultAltitude, setDefaultAltitude] = useState<string>('+341m')

  const [barometerSubscription, setBarometerSubscription] = useState<any>(null);

  useEffect(() => {
    (async () => {
      const spots = await getObject(storageKeys.viewPoints)
      const spot = await getObject(storageKeys.selectedSpot)
      if (spots) setViewPoints(spots)
      if (spot) setSelectedSpot(spot)
    })()
  }, [])

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const _subscribe = () => {
    const hasPermission = Barometer.isAvailableAsync()
    if (!hasPermission) return;

    console.log('Barometer available');

    setBarometerSubscription(
      Barometer.addListener((result) => {
        const paPressure = result.pressure * 100
        const altitude = 44330 * (1 - Math.pow(paPressure / 101325, 1 / 5.255))
        console.log('Altitude', altitude);

        setDefaultAltitude(`${Math.round(altitude)}m`)
      })
    )

    Barometer.setUpdateInterval(500);
  };

  const _unsubscribe = () => {
    barometerSubscription && barometerSubscription.remove();
    setBarometerSubscription(null);
  };



  const handleCurrentSpotElevation = (newElevation: number) => {
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
    handleCurrentSpotElevation,
    addNewSpot,
    deleteSpot,
    viewPoints,
    refreshViewPoints,
    changeSelectedSpot,
    selectedSpot,
    defaultAltitude,
  }

  return (
    <ObservationSpotContext.Provider value={values}>
      {children}
    </ObservationSpotContext.Provider>
  )
}
