// Google Maps (Android) peut planter nativement (IllegalStateException dans `moveCamera`, au tout
// premier rendu de la carte) si la région initiale déborde des latitudes valides — repéré avec
// l'éclipse annulaire du 17/02/2026, dont le point du maximum est à -64,76° de latitude : avec un
// `latitudeDelta` fixe de 60°, la borne sud (latitude - latitudeDelta/2) tombait à -94,76°, hors de
// l'intervalle représentable. On reste à ±85° (la limite de la projection Web Mercator, même borne
// que WORLD_BOUNDS dans EclipseVisibilityMap.tsx) plutôt que ±90° par prudence.
const MAX_SAFE_LATITUDE = 85;

export const clampMapRegionLatitude = (
  latitude: number,
  latitudeDelta: number
): { latitude: number; latitudeDelta: number } => {
  const clampedLatitude = Math.max(-MAX_SAFE_LATITUDE, Math.min(MAX_SAFE_LATITUDE, latitude));
  // Delta maximum qui garde la région entièrement dans l'intervalle valide tout en restant centrée
  // sur `clampedLatitude` — réduit automatiquement le zoom plutôt que de recentrer ailleurs.
  const maxHalfDelta = MAX_SAFE_LATITUDE - Math.abs(clampedLatitude);
  return { latitude: clampedLatitude, latitudeDelta: Math.min(latitudeDelta, Math.max(2, maxHalfDelta * 2)) };
};
