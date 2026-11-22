import { convertEquatorialToHorizontal, GeographicCoordinate } from "@observerly/astrometry";
import { getObjectById, listObjects } from "../api/catalog/objects";
import { getVisibilityWindow } from "../astrometry/night/nightWindow";
import type { CatalogObjectDetail } from "../../types/catalog/CatalogObject";

export type TonightPick = {
  object: CatalogObjectDetail;
  altitude: number; // degrés, maintenant
  azimuth: number; // degrés, maintenant (0 = nord, 90 = est, 180 = sud, 270 = ouest)
  setDate: Date | null; // prochain coucher, si calculable
  bestMonthMatch: boolean; // custom.best_months inclut le mois courant
};

// "Bien placés ce soir" : garder la requête catalogue raisonnable (pas un scan complet) tout en
// restant pertinent. /v3/objects ne renvoie pas `custom` en liste (seulement sur la fiche détail),
// donc impossible de filtrer par best_months côté serveur — on borne d'abord par magnitude (objets
// brillants, pertinents à l'œil nu/jumelles) et on ne lit la fiche complète (coûteuse) que pour un
// sous-ensemble plafonné des plus brillants, triés côté client (la liste elle-même n'est pas triée
// par magnitude côté API).
const CANDIDATE_MAX_MAGNITUDE = 6;
const CANDIDATE_LIST_LIMIT = 200;
const DETAIL_FETCH_CAP = 20;
const MAX_PICKS = 4;

export const getTonightPicks = async (observer: GeographicCoordinate, at: Date = new Date()): Promise<TonightPick[]> => {
  const list = await listObjects({ maxMag: CANDIDATE_MAX_MAGNITUDE, limit: CANDIDATE_LIST_LIMIT });
  if (!list) return [];

  const brightestCandidates = [...list.data]
    .sort((a, b) => (a.magnitude ?? Infinity) - (b.magnitude ?? Infinity))
    .slice(0, DETAIL_FETCH_CAP);

  const details = await Promise.all(brightestCandidates.map((summary) => getObjectById(summary.id)));

  // Vérifié en direct sur l'API (ex. Galaxie d'Andromède → [9,10,11]) : mois calendaires 1-12, pas
  // un index 0-11. `best_months` est nullable même sur un objet avec une fiche complète par ailleurs
  // (donnée encore partielle côté catalogue) — voir le tri plus bas, qui ne l'exige pas strictement.
  const currentMonth = at.getMonth() + 1;

  const picks: TonightPick[] = [];
  for (const detail of details) {
    if (!detail?.position) continue;

    const position = detail.position;
    const getEquatorialCoordinate = () => ({ ra: position.ra, dec: position.dec });
    const { alt, az } = convertEquatorialToHorizontal(at, observer, getEquatorialCoordinate());
    if (alt <= 0) continue; // sous l'horizon : jamais "bien placé"

    const visibility = getVisibilityWindow(at, observer, getEquatorialCoordinate);

    picks.push({
      object: detail,
      altitude: alt,
      azimuth: az,
      setDate: visibility?.end ?? null,
      bestMonthMatch: detail.custom.best_months?.includes(currentMonth) ?? false,
    });
  }

  // Priorité aux objets dont c'est la saison, puis par altitude décroissante (le mieux placé
  // d'abord) — sans jamais exclure les autres : best_months est encore partiel côté catalogue, un
  // filtre strict afficherait parfois une liste vide alors que de bons candidats existent.
  picks.sort((a, b) => {
    if (a.bestMonthMatch !== b.bestMonthMatch) return a.bestMonthMatch ? -1 : 1;
    return b.altitude - a.altitude;
  });

  return picks.slice(0, MAX_PICKS);
};
