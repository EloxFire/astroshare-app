import { LaunchAgencyCountry, LaunchImage } from "./Launch";

// Forme (sous-ensemble) de la réponse LL2 relayée par /v3/agencies/:id — fiche complète, plus
// riche que le résumé embarqué dans un lancement (launch_service_provider).
//
// `logo` est quasi toujours vide (`{}`) en pratique, ex: SpaceX — le logo exploitable est
// `social_logo`, un objet riche distinct (même forme que `Launch.image`, voir getLaunchImageUrl).
// `image` est une photo représentative de l'agence (ex: un lancement), pas un logo.
export type Agency = {
  id: number;
  name: string;
  abbrev: string;
  type?: { name: string } | null;
  featured?: boolean;
  country?: LaunchAgencyCountry[];
  description?: string | null;
  administrator?: string | null;
  founding_year?: number | null;
  launchers?: string | null;
  spacecraft?: string | null;
  parent?: { id: number; name: string; abbrev: string } | null;
  logo?: LaunchImage;
  social_logo?: LaunchImage;
  image?: LaunchImage;
}
