import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react'
import { useSettings } from './AppSettingsContext'
import { convertEquatorialToHorizontal, earth, EclipticCoordinate, EquatorialCoordinate, getLunarEquatorialCoordinate, getLunarPhase, getPlanetaryPositions, HorizontalCoordinate, Planet } from '@observerly/astrometry'
import { GlobalPlanet } from '../helpers/types/GlobalPlanet'
import { astroshareApi } from '../helpers/api'
import dayjs from 'dayjs'

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
    }, 20000)

    return () => clearInterval(interval)
  }, [currentUserLocation])

  useEffect(() => {
    getMoon()
    const interval = setInterval(() => {
      getMoon()
    }, 20000)

    return () => clearInterval(interval)
  }, [currentUserLocation])

  const getPlanets = () => {
    if (!currentUserLocation) return;
    setPlanets(getPlanetaryPositions(new Date(), { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }))
    // console.log(JSON.stringify(getPlanetaryPositions(new Date(), { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }), null, 2))
  }

  const getMoon = async () => {
    if (!currentUserLocation) return;

    const eqCoords = getLunarEquatorialCoordinate(new Date())
    const horizontalCoords = convertEquatorialToHorizontal(new Date(), { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }, { ra: eqCoords.ra, dec: eqCoords.dec })
    const phase = getLunarPhase(new Date())

    const response = await astroshareApi.get('/moon/illustration?date=' + dayjs().format('YYYY-MM-DD'))
    const moonImage = response.data.url


    const moonCoords = {
      ra: eqCoords.ra,
      dec: eqCoords.dec,
      alt: horizontalCoords.alt,
      az: horizontalCoords.az,
      phase: phase,
      currentIconUrl: moonImage
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
