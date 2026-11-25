import type { EclipseVisibilityLines } from "../../types/eclipses/Eclipse";

const EARTH_RADIUS_KM = 6371;
const toRad = (deg: number): number => (deg * Math.PI) / 180;

const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.min(1, Math.sqrt(a)));
};

// Distance du point donné à la ligne centrale (trajectoire de la totalité/annularité) la plus
// proche — approximation par le sommet le plus proche de la polyligne (pas une vraie distance
// point-segment), suffisante vu la résolution fine de la ligne renvoyée par l'API. `null` si
// l'éclipse n'a pas de ligne centrale (jamais totale/annulaire/hybride nulle part sur Terre).
export const distanceToCentralLineKm = (
  latitude: number,
  longitude: number,
  visibilityLines: EclipseVisibilityLines | undefined
): number | null => {
  const centralFeature = visibilityLines?.features.find((feature) => feature.properties?.name === "central");
  if (!centralFeature) return null;

  let min = Infinity;
  for (const line of centralFeature.geometry.coordinates) {
    for (const [lon, lat] of line) {
      const distance = haversineKm(latitude, longitude, lat, lon);
      if (distance < min) min = distance;
    }
  }
  return Number.isFinite(min) ? min : null;
};
