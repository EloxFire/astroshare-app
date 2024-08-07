import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { useSettings } from './AppSettingsContext'
import { earth, EclipticCoordinate, EquatorialCoordinate, getPlanetaryPositions, HorizontalCoordinate, Planet } from '@observerly/astrometry'
import { GlobalPlanet } from '../helpers/types/GlobalPlanet'

const SolarSystemContext = createContext<any>({})

export const useSolarSystem = () => {
  return useContext(SolarSystemContext)
}

interface SolarSystemProviderProps {
  children: ReactNode
}

export function SolarSystemProvider({ children }: SolarSystemProviderProps) {

  const { currentUserLocation } = useSettings();

  const [planets, setPlanets] = useState<GlobalPlanet[]>([]);

  useEffect(() => {
    getPlanets()
    const interval = setInterval(() => {
      getPlanets()
    }, 60000)

    return () => clearInterval(interval)
  }, [currentUserLocation])

  const getPlanets = () => {
    console.log('getPlanets')
    if (!currentUserLocation) return;
    const planets = getPlanetaryPositions(new Date(), { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon })
    let system = planets;

    const globalEarthItem = earth as GlobalPlanet
    globalEarthItem.ra = 0
    globalEarthItem.dec = 0
    globalEarthItem.alt = 0
    globalEarthItem.az = 0
    globalEarthItem.λ = 0
    globalEarthItem.β = 0



    system.splice(2, 0, earth as GlobalPlanet)

    console.log(system)

    setPlanets(system)
  }

  const values = {
    planets,
  }

  return (
    <SolarSystemContext.Provider value={values}>
      {children}
    </SolarSystemContext.Provider>
  )
}
