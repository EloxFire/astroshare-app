import type * as THREE from "three";
import { raDecToVec3 } from "../utils/coordinates";
import { projectRaDecToScreen } from "../utils/screenProjection";
import { SOLAR_SYSTEM_BODY_IDS, type SolarSystemBodyId, type SolarSystemSnapshot } from "../layers/SolarSystemLayer";
import type { CatalogObjectSummary } from "../../../types/catalog/CatalogObject";

export type PickedObject =
  | { kind: "solar_system"; bodyId: SolarSystemBodyId }
  | { kind: "star"; object: CatalogObjectSummary }
  | { kind: "dso"; object: CatalogObjectSummary };

// Rayon de tolérance du tap par catégorie (points logiques) : généreux pour le système solaire (gros
// points, peu nombreux, priorité absolue), plus serré pour étoiles/DSO (des milliers de points fins,
// un rayon trop large ferait rater systématiquement l'objet voisin le plus pertinent).
const TAP_RADIUS_SOLAR_SYSTEM = 26;
const TAP_RADIUS_STAR = 20;
const TAP_RADIUS_DSO = 22;

type PickContext = {
  camera: THREE.PerspectiveCamera;
  width: number;
  height: number;
  zenith: THREE.Vector3;
  solarSystemSnapshot: SolarSystemSnapshot;
  stars: CatalogObjectSummary[];
  dsoObjects: CatalogObjectSummary[];
};

// Plus proche voisin projeté à l'écran, dans un rayon donné, parmi les objets AU-DESSUS de
// l'horizon — pas un raycast 3D façon `THREE.Raycaster` (la taille à l'écran de nos points varie
// avec le FOV via `uFovScale`, un seuil de raycast en unités monde serait à recalibrer sans arrêt) :
// une recherche 2D sur la même projection déjà utilisée pour les étiquettes, plus simple et robuste.
const nearestWithin = <T>(
  items: readonly T[],
  getRaDec: (item: T) => { ra: number; dec: number } | null | undefined,
  tapX: number,
  tapY: number,
  radius: number,
  ctx: PickContext
): T | null => {
  let best: T | null = null;
  let bestDistSq = radius * radius;

  for (const item of items) {
    const coord = getRaDec(item);
    if (!coord) continue;

    const direction = raDecToVec3(coord.ra, coord.dec, 1).normalize();
    if (direction.dot(ctx.zenith) < 0) continue; // sous l'horizon : pas sélectionnable

    const point = projectRaDecToScreen(ctx.camera, coord.ra, coord.dec, ctx.width, ctx.height);
    if (!point) continue;

    const dx = point.x - tapX;
    const dy = point.y - tapY;
    const distSq = dx * dx + dy * dy;
    if (distSq <= bestDistSq) {
      bestDistSq = distSq;
      best = item;
    }
  }

  return best;
};

// Priorité planète/Soleil/Lune > étoile > DSO (demandée dans le plan) : testée dans cet ordre et on
// s'arrête à la première catégorie qui a une correspondance — un DSO proche en pixels ne vole jamais
// la sélection à une planète qui passe presque au même endroit à l'écran.
export const pickObjectAtScreenPoint = (tapX: number, tapY: number, ctx: PickContext): PickedObject | null => {
  const bodyHit = nearestWithin(
    SOLAR_SYSTEM_BODY_IDS,
    (bodyId) => ctx.solarSystemSnapshot[bodyId],
    tapX,
    tapY,
    TAP_RADIUS_SOLAR_SYSTEM,
    ctx
  );
  if (bodyHit) return { kind: "solar_system", bodyId: bodyHit };

  const starHit = nearestWithin(ctx.stars, (star) => star.position, tapX, tapY, TAP_RADIUS_STAR, ctx);
  if (starHit) return { kind: "star", object: starHit };

  const dsoHit = nearestWithin(ctx.dsoObjects, (dso) => dso.position, tapX, tapY, TAP_RADIUS_DSO, ctx);
  if (dsoHit) return { kind: "dso", object: dsoHit };

  return null;
};
