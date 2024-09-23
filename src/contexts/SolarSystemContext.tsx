import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { useSettings } from './AppSettingsContext'
import { convertEquatorialToHorizontal, earth, EclipticCoordinate, EquatorialCoordinate, getLunarEquatorialCoordinate, getLunarPhase, getPlanetaryPositions, HorizontalCoordinate, Planet } from '@observerly/astrometry'
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
  const [moonCoords, setMoonCoords] = useState<(EquatorialCoordinate & HorizontalCoordinate & { phase: string })>({ ra: 0, dec: 0, alt: 0, az: 0, phase: 'Full' })

  useEffect(() => {
    getPlanets()
    const interval = setInterval(() => {
      getPlanets()
    }, 2000)

    return () => clearInterval(interval)
  }, [currentUserLocation])

  useEffect(() => {
    getMoon()
    const interval = setInterval(() => {
      getMoon()
    }, 30000)

    return () => clearInterval(interval)
  }, [currentUserLocation])

  const getPlanets = () => {
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
    setPlanets(system)
  }

  const getMoon = () => {
    if (!currentUserLocation) return;

    const eqCoords = getLunarEquatorialCoordinate(new Date())
    const horizontalCoords = convertEquatorialToHorizontal(new Date(), { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, { ra: eqCoords.ra, dec: eqCoords.dec })
    const phase = getLunarPhase(new Date())


    const moonCoords = {
      ra: eqCoords.ra,
      dec: eqCoords.dec,
      alt: horizontalCoords.alt,
      az: horizontalCoords.az,
      phase: phase
    }

    setMoonCoords(moonCoords)
  }

  const values = {
    planets,
    moonCoords,
  }

  return (
    <SolarSystemContext.Provider value={values}>
      {children}
    </SolarSystemContext.Provider>
  )
}
