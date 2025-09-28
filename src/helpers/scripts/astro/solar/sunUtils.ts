import * as THREE from 'three';
import {
  convertEquatorialToHorizontal,
  EquatorialCoordinate, getLocalSiderealTime,
  getSolarEquatorialCoordinate
} from "@observerly/astrometry";

/**
 * Calcule la direction du Soleil dans la sphère céleste et le mix jour/nuit.
 * @param date Date actuelle (UTC ou locale)
 * @param latitude en degrés
 * @param longitude en degrés
 */
export function computeSunParameters(
  date: Date,
  latitude: number,
  longitude: number
): {
  sunDirection: THREE.Vector3,
  sunAltitudeDeg: number,
  planetariumMix: number
} {
  const sunEq: EquatorialCoordinate = getSolarEquatorialCoordinate(date);
  const {alt, az} = convertEquatorialToHorizontal(date, {latitude: latitude, longitude: longitude}, sunEq);

  const altRad = THREE.MathUtils.degToRad(alt);
  const azRad = THREE.MathUtils.degToRad(az);

  console.log(`[GLView] Sun altitude: ${alt}° | azimuth: ${az}°`);
  console.log(`[GLView] Sun altitude (rad): ${altRad} | azimuth (rad): ${azRad}`);
  console.log(`[GLView] Sun coordinates: ${sunEq.ra} | ${sunEq.dec}`);
  console.log(`[GLView] Sun coordinates (rad): ${sunEq.ra * Math.PI / 180} | ${sunEq.dec * Math.PI / 180}`);


  // Convertit les coordonnées horizontales en direction 3D (sphère céleste)
  const r = 1;
  const x = r * Math.cos(altRad) * Math.sin(azRad);
  const y = r * Math.sin(altRad);
  const z = r * Math.cos(altRad) * Math.cos(azRad);

  const sunDirection = new THREE.Vector3(x, y, z).normalize();

  // Calcul du "mix" jour/nuit basé sur l'altitude du Soleil
  const sunAltitudeDeg = THREE.MathUtils.radToDeg(alt);
  const mixNumber = computeMixFromSunAltitude(sunAltitudeDeg);


  return {
    sunDirection,
    sunAltitudeDeg,
    planetariumMix: mixNumber,
  };
}

function computeMixFromSunAltitude(altitudeDeg: number): number {
  if (altitudeDeg >= 6) return 0.0; // jour complet
  if (altitudeDeg <= -12) return 1.0; // nuit noire

  // Crépuscule civil → mix gradué entre 0 et 1
  return THREE.MathUtils.clamp((6 - altitudeDeg) / 18, 0, 1);
}