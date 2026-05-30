import { ImageSourcePropType } from 'react-native'
import {
  earth,
  getLunarAngularDiameter,
  getLunarPhase,
  getPlanetaryHeliocentricDistance,
  jupiter,
  mars,
  mercury,
  neptune,
  saturn,
  uranus,
  venus,
} from '@observerly/astrometry'
import { DSO } from '../../types/DSO'
import { GlobalPlanet } from '../../types/GlobalPlanet'
import { LocationObject } from '../../types/LocationObject'
import { SpecialSkyObject } from '../../types/SpecialSkyObject'
import { moonIcons } from '../loadImages'
import { getPlanetariumImageEntry } from './getPlanetariumImageEntry'

const AU_IN_METERS = 149_597_870_700

const PLANET_PARAMS: Record<string, any> = {
  Mercury: mercury,
  Venus: venus,
  Mars: mars,
  Jupiter: jupiter,
  Saturn: saturn,
  Uranus: uranus,
  Neptune: neptune,
}

export type RenderMode = 'image' | 'moon' | 'planet' | 'point'

export type SimulatorTarget = {
  name: string
  angularWidthDeg: number
  angularHeightDeg: number
  // For 'image' mode: remote URL from planetarium_images.json
  // For 'moon' mode: remote illustration URL from the API (may be null offline)
  imageUri: string | null
  // For 'moon' mode: local phase icon fallback (always available)
  imageSource: ImageSourcePropType | null
  // Actual sky footprint of the plate-solved image (may differ from object angular size)
  imageWidthDeg?: number
  imageHeightDeg?: number
  renderMode: RenderMode
  // For procedural SVG planet rendering
  planetName?: string
}

// ── DSO ─────────────────────────────────────────────────────────────────────────

export const getDSOTarget = (dso: DSO): SimulatorTarget => {
  const majAxDeg = (parseFloat(String(dso.maj_ax)) || 0) / 60
  const minAxDeg = (parseFloat(String(dso.min_ax)) || 0) / 60

  const messierNum = dso.m !== '' && dso.m != null ? dso.m : null
  const imageEntry = messierNum ? getPlanetariumImageEntry(messierNum) : null

  const name = dso.common_names?.split(',')[0]?.trim() || dso.name

  return {
    name,
    angularWidthDeg: majAxDeg || 0.05,
    angularHeightDeg: minAxDeg || majAxDeg || 0.05,
    imageUri: imageEntry?.imageUrl ?? null,
    imageSource: null,
    imageWidthDeg: imageEntry?.imageWidthDeg,
    imageHeightDeg: imageEntry?.imageHeightDeg,
    renderMode: imageEntry ? 'image' : 'point',
  }
}

// ── Moon ─────────────────────────────────────────────────────────────────────────

export const getMoonTarget = (
  location: LocationObject | null,
  moonIllustrationUrl?: string | null,
): SimulatorTarget => {
  const observer = location
    ? { latitude: location.lat, longitude: location.lon, elevation: 0 }
    : undefined
  const angularDiam = getLunarAngularDiameter(new Date(), observer)
  const phase = getLunarPhase(new Date())

  return {
    name: 'Lune',
    angularWidthDeg: angularDiam,
    angularHeightDeg: angularDiam,
    imageUri: moonIllustrationUrl ?? null,
    imageSource: moonIcons[phase] ?? moonIcons['Full'],
    renderMode: 'moon',
  }
}

// ── Planets ───────────────────────────────────────────────────────────────────────

const computePlanetAngularDiamDeg = (planetName: string, withCurrentDate: boolean): number => {
  const params = PLANET_PARAMS[planetName]
  if (!params) return 0

  let distanceAU: number
  if (withCurrentDate) {
    // Approximate geocentric distance as difference of heliocentric distances
    const rPlanet = getPlanetaryHeliocentricDistance(new Date(), params)
    const rEarth = getPlanetaryHeliocentricDistance(new Date(), earth)
    distanceAU = Math.abs(rPlanet - rEarth)
  } else {
    distanceAU = params.a // fallback to mean semi-major axis
  }

  const distanceM = Math.max(distanceAU, 0.01) * AU_IN_METERS
  return 2 * Math.atan(params.r / distanceM) * (180 / Math.PI)
}

export const getPlanetTarget = (
  planet: GlobalPlanet,
  location: LocationObject | null,
): SimulatorTarget => {
  const angularDiam = computePlanetAngularDiamDeg(planet.name, location !== null)

  return {
    name: planet.name,
    angularWidthDeg: angularDiam,
    angularHeightDeg: angularDiam,
    imageUri: null,
    imageSource: null,
    renderMode: angularDiam > 0.002 ? 'planet' : 'point',
    planetName: planet.name,
  }
}

// ── Sun / Moon stubs (from SpecialSkyObject) ──────────────────────────────────────

export const getSpecialObjectTarget = (
  obj: SpecialSkyObject,
  location: LocationObject | null,
  moonIllustrationUrl?: string | null,
): SimulatorTarget => {
  if (obj.family === 'Moon') return getMoonTarget(location, moonIllustrationUrl)

  return {
    name: obj.name,
    angularWidthDeg: 0.533,
    angularHeightDeg: 0.533,
    imageUri: null,
    imageSource: null,
    renderMode: 'planet',
    planetName: 'Sun',
  }
}
