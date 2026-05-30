import { ImageSourcePropType } from 'react-native'
import {
  getLunarDistance,
  getLunarPhase,
  getPlanetaryHeliocentricDistance,
  getPlanetaryHeliocentricEclipticLatitude,
  getPlanetaryHeliocentricEclipticLongitude,
  getSolarEclipticCoordinate,
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

const AU_IN_METERS   = 149_597_870_700
const MOON_RADIUS_M  = 1_737_400

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
  const moonDist_m = getLunarDistance(new Date())
  const angularDiam = 2 * Math.atan(MOON_RADIUS_M / moonDist_m) * (180 / Math.PI)
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

// True geocentric distance using 3-D heliocentric ecliptic positions.
// |rPlanet − rEarth| (scalar) is only accurate at opposition/conjunction;
// this version handles all orbital configurations correctly.
const computePlanetAngularDiamDeg = (planetName: string, withCurrentDate: boolean): number => {
  const params = PLANET_PARAMS[planetName]
  if (!params) return 0

  let distanceM: number
  if (withCurrentDate) {
    const date = new Date()
    const sunEclip = getSolarEclipticCoordinate(date) as any
    const r_e = sunEclip.R / AU_IN_METERS
    const earthLon = ((sunEclip['λ'] + 180) % 360) * (Math.PI / 180)

    const r_p   = getPlanetaryHeliocentricDistance(date, params)
    const lon_p = getPlanetaryHeliocentricEclipticLongitude(date, params) * (Math.PI / 180)
    const lat_p = getPlanetaryHeliocentricEclipticLatitude(date, params) * (Math.PI / 180)

    const xp = r_p * Math.cos(lat_p) * Math.cos(lon_p)
    const yp = r_p * Math.cos(lat_p) * Math.sin(lon_p)
    const zp = r_p * Math.sin(lat_p)
    const xe = r_e * Math.cos(earthLon)
    const ye = r_e * Math.sin(earthLon)

    const delta_AU = Math.sqrt((xp - xe) ** 2 + (yp - ye) ** 2 + zp ** 2)
    distanceM = (isFinite(delta_AU) && delta_AU > 0 ? delta_AU : params.a) * AU_IN_METERS
  } else {
    distanceM = Math.max(params.a, 0.01) * AU_IN_METERS
  }

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
