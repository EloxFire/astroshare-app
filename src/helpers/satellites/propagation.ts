// Propagation orbitale locale (SGP4), via satellite.js — pur JS, aucune dépendance native. On
// l'utilise plutôt que de ré-interroger l'API toutes les secondes : /v3/satellite/position ne
// renvoie au mieux que 300 s (5 min) de positions par appel, insuffisant pour une trace au sol de
// 45 min passées + 90 min à venir (voir la trace au sol de la fiche satellite). Même principe que
// les calculs Soleil/Lune de l'app (@observerly/astrometry) : le calcul orbital se fait côté app à
// partir d'éléments reçus une fois (ici un TLE, là une date), pas par appel répété au serveur.
//
// Import par sous-module précis (pas `import * as satellite from "satellite.js"`) : le point
// d'entrée du paquet réexporte aussi son module `wasm/`, dont une branche fait un `import()`
// dynamique de `#wasm-single-thread` — un subpath imports qui résout vers un loader Emscripten
// pensé pour Node (`import("node:module")` à l'intérieur). Metro trace cette branche même si on ne
// l'appelle jamais, et casse le build (`Unable to resolve module node:module`). Les sous-modules
// utilisés ici n'importent rien de tout ça — voir `unstable_enablePackageExports = false` dans
// metro.config.js, qui fait que ces imports profonds passent malgré le champ `exports` restrictif
// du package.json de satellite.js (qui ne déclare que `"."`).
import { twoline2satrec } from "satellite.js/dist/io.js";
import { propagate, gstime } from "satellite.js/dist/propagation.js";
import { eciToGeodetic, degreesLat, degreesLong } from "satellite.js/dist/transforms.js";

export type SatrecHandle = ReturnType<typeof twoline2satrec>;

export type SubPoint = {
  latitude: number; // degrés
  longitude: number; // degrés, [-180, 180]
  altitude: number; // km
  speedKmh: number; // norme du vecteur vitesse ECI
};

// Le champ `tle` de /v3/satellite peut arriver en 2 lignes (les deux lignes TLE) ou 3 (nom +
// les deux lignes) selon la source N2YO — on ne garde que les deux dernières lignes non vides.
export const parseTle = (tleText: string): SatrecHandle | null => {
  const lines = tleText.split("\n").map((line) => line.trim()).filter(Boolean);
  if (lines.length < 2) return null;

  const [line1, line2] = lines.slice(-2);
  const satrec = twoline2satrec(line1, line2);
  // satellite.js ne lève pas d'exception sur un TLE invalide : il pose un code d'erreur sur le
  // satrec (error !== 0, ex: éléments dégénérés). On le rejette tout de suite plutôt que de
  // propager des positions aberrantes en aval.
  if (satrec.error !== 0) return null;
  return satrec;
};

// Point sous-satellite (latitude/longitude/altitude) et vitesse à un instant donné. `null` si la
// propagation échoue à cet instant précis (ex: satellite décroché de son orbite, SGP4 diverge).
export const getSubPoint = (satrec: SatrecHandle, date: Date): SubPoint | null => {
  const propagated = propagate(satrec, date);
  if (!propagated) return null;
  const { position, velocity } = propagated;

  const gmst = gstime(date);
  const geodetic = eciToGeodetic(position, gmst);
  const speedKms = Math.sqrt(velocity.x ** 2 + velocity.y ** 2 + velocity.z ** 2);

  return {
    latitude: degreesLat(geodetic.latitude),
    longitude: degreesLong(geodetic.longitude),
    altitude: geodetic.height,
    speedKmh: speedKms * 3600,
  };
};

export type GroundTrackPoint = {
  date: Date;
  latitude: number;
  longitude: number;
  relative: "past" | "future";
};

// Échantillonne la trace au sol autour de `centerDate` : de -pastMinutes à +futureMinutes, un
// point toutes les stepMinutes. Les points où la propagation échoue sont simplement omis (trace
// interrompue plutôt que position aberrante).
export const getGroundTrack = (
  satrec: SatrecHandle,
  centerDate: Date,
  { pastMinutes, futureMinutes, stepMinutes }: { pastMinutes: number; futureMinutes: number; stepMinutes: number }
): GroundTrackPoint[] => {
  const points: GroundTrackPoint[] = [];
  const centerMs = centerDate.getTime();

  for (let offset = -pastMinutes; offset <= futureMinutes; offset += stepMinutes) {
    const date = new Date(centerMs + offset * 60_000);
    const subPoint = getSubPoint(satrec, date);
    if (!subPoint) continue;
    points.push({
      date,
      latitude: subPoint.latitude,
      longitude: subPoint.longitude,
      relative: offset < 0 ? "past" : "future",
    });
  }

  return points;
};
