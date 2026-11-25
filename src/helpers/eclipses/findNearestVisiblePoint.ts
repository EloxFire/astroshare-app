// Cherche, en s'éloignant d'un point où l'éclipse n'est pas visible, le point visible le plus proche
// dans une direction donnée — usage explicitement déclenché par l'utilisateur (bouton), le nombre de
// requêtes pouvant être important si le point de départ est loin du terminateur. Port de
// astroshare-public-tools/src/helpers/findNearestVisiblePoint.ts.
const EARTH_RADIUS_KM = 6371;

// Point atteint depuis (lat, lng) en suivant un grand cercle sur un azimut et une distance donnés —
// formule standard de navigation sphérique (voir https://www.movable-type.co.uk/scripts/latlong.html).
const destinationPoint = (lat: number, lng: number, bearingDeg: number, distanceKm: number): { lat: number; lng: number } => {
  const bearingRad = (bearingDeg * Math.PI) / 180;
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  const angularDistance = distanceKm / EARTH_RADIUS_KM;

  const destLatRad = Math.asin(
    Math.sin(latRad) * Math.cos(angularDistance) + Math.cos(latRad) * Math.sin(angularDistance) * Math.cos(bearingRad)
  );
  const destLngRad =
    lngRad +
    Math.atan2(
      Math.sin(bearingRad) * Math.sin(angularDistance) * Math.cos(latRad),
      Math.cos(angularDistance) - Math.sin(latRad) * Math.sin(destLatRad)
    );

  return { lat: (destLatRad * 180) / Math.PI, lng: (((destLngRad * 180) / Math.PI + 540) % 360) - 180 };
};

export type NearestVisiblePoint = {
  latitude: number;
  longitude: number;
  distanceKm: number;
  bearingDeg: number;
};

// Anneaux croissants jusqu'à la distance antipodale maximale sur Terre (~20 015 km, la moitié de la
// circonférence) : l'éclipse n'étant "pas visible du tout" signifie généralement que ce point est du
// côté nuit de la Terre pendant l'évènement, donc le point visible le plus proche peut être à
// plusieurs milliers de km — mais l'éclipse est toujours visible depuis QUELQUE part sur le globe à
// un instant donné, la recherche ne doit donc jamais s'arrêter avant d'avoir couvert tout le globe.
const SEARCH_RINGS_KM = [200, 500, 1000, 2000, 4000, 7000, 11000, 15000, 20015];
// Est/Ouest en premier, nord/sud en dernier recours : décaler la longitude change directement
// l'heure locale (donc la hauteur du Soleil/de la Lune) — à distance égale, un déplacement est/ouest
// gagne généralement bien plus d'altitude qu'un déplacement nord/sud, qui ne fait que suivre le même
// méridien. En cas d'ex-æquo dans un même anneau, le premier trouvé dans ce tableau l'emporte.
const SEARCH_BEARINGS_DEG = [90, 270, 45, 135, 225, 315, 0, 180];
// Dichotomie le long du cap gagnant entre le dernier anneau négatif et celui qui a matché, pour
// resserrer la distance sans multiplier les requêtes (4 étapes ≈ précision à quelques % près).
const REFINE_STEPS = 4;

export const findNearestVisiblePoint = async (
  latitude: number,
  longitude: number,
  checkVisible: (latitude: number, longitude: number) => Promise<boolean>
): Promise<NearestVisiblePoint | null> => {
  let previousRingKm = 0;

  for (const ringKm of SEARCH_RINGS_KM) {
    const candidates = SEARCH_BEARINGS_DEG.map((bearingDeg) => ({ bearingDeg, ...destinationPoint(latitude, longitude, bearingDeg, ringKm) }));

    const results = await Promise.all(
      candidates.map(async (candidate) => ({ ...candidate, visible: await checkVisible(candidate.lat, candidate.lng) }))
    );
    const hit = results.find((result) => result.visible);

    if (hit) {
      let low = previousRingKm;
      let high = ringKm;
      let best: NearestVisiblePoint = { latitude: hit.lat, longitude: hit.lng, distanceKm: ringKm, bearingDeg: hit.bearingDeg };

      for (let step = 0; step < REFINE_STEPS; step += 1) {
        const mid = (low + high) / 2;
        const point = destinationPoint(latitude, longitude, hit.bearingDeg, mid);
        const visible = await checkVisible(point.lat, point.lng);
        if (visible) {
          high = mid;
          best = { latitude: point.lat, longitude: point.lng, distanceKm: mid, bearingDeg: hit.bearingDeg };
        } else {
          low = mid;
        }
      }

      return best;
    }

    previousRingKm = ringKm;
  }

  return null;
};
