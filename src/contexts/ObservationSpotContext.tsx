import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { getObject, storeData, storeObject } from '../helpers/storage'
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

  const [defaultAltitude, setDefaultAltitude] = useState<string>('+341m')

  const [barometerSubscription, setBarometerSubscription] = useState<any>(null);

  useEffect(() => {
    _subscribe();
    return () => _unsubscribe();
  }, []);

  const _subscribe = () => {
    const hasPermission = Barometer.isAvailableAsync()
    if (!hasPermission) return;

    console.log('[Barometer] Subscribing to barometer data...');

    setBarometerSubscription(
      Barometer.addListener((result) => {
        const paPressure = result.pressure * 100
        const altitude = 44330 * (1 - Math.pow(paPressure / 101325, 1 / 5.255))

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



  const values = {
    handleCurrentSpotElevation,
    defaultAltitude,
  }

  return (
    <ObservationSpotContext.Provider value={values}>
      {children}
    </ObservationSpotContext.Provider>
  )
}
