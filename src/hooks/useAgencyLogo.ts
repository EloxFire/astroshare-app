import { useEffect, useState } from "react";
import { getAgencyById } from "../helpers/api/launches/agencies";
import { getLaunchImageUrl } from "../helpers/spaceLaunches/launchImage";

// Cache module (hors React) : beaucoup de lancements partagent la même agence (ex: tous les vols
// SpaceX affichés en même temps dans la liste) — un seul appel réseau par agence, peu importe le
// nombre de cartes qui l'affichent à l'écran, et `pendingRequests` évite les doublons si plusieurs
// cartes montent en même temps avant que le premier appel soit revenu.
const logoCache = new Map<number, string | null>();
const pendingRequests = new Map<number, Promise<string | null>>();

const fetchAgencyLogo = async (agencyId: number): Promise<string | null> => {
  const agency = await getAgencyById(agencyId);
  // `logo` est quasi toujours vide ({}) en pratique (ex: SpaceX) — le logo exploitable est
  // `social_logo`, avec `logo` gardé en repli si jamais une agence l'a rempli à la place.
  return getLaunchImageUrl(agency?.social_logo) ?? getLaunchImageUrl(agency?.logo);
}

// Le logo n'est pas dans l'objet lancement (launch_service_provider n'embarque qu'un résumé) :
// il faut la fiche agence complète, via /v3/agencies/:id, pour avoir social_logo.
export const useAgencyLogo = (agencyId: number): string | null => {
  const [logoUrl, setLogoUrl] = useState<string | null>(() => logoCache.get(agencyId) ?? null);

  useEffect(() => {
    if (logoCache.has(agencyId)) {
      setLogoUrl(logoCache.get(agencyId) ?? null);
      return;
    }

    let cancelled = false;
    let request = pendingRequests.get(agencyId);
    if (!request) {
      request = fetchAgencyLogo(agencyId);
      pendingRequests.set(agencyId, request);
    }

    request.then((url) => {
      logoCache.set(agencyId, url);
      pendingRequests.delete(agencyId);
      if (!cancelled) setLogoUrl(url);
    });

    return () => {
      cancelled = true;
    };
  }, [agencyId]);

  return logoUrl;
}
