// Forme (sous-ensemble) de la réponse LL2 relayée telle quelle par /v3/launches/upcoming — voir
// docs/agents-reference.md. Pas de route /:id pour les lancements : chaque élément de la liste est
// déjà l'objet le plus riche du domaine (agence, fusée, mission et pas de tir embarqués), donc ce
// même type sert à la fois pour la carte liste et pour la fiche détail.

export type LaunchStatus = {
  name: string; // "Go", "To Be Determined", "Success", "Failure", "Hold", "In Flight"...
  abbrev: string;
}

export type LaunchDatePrecision = {
  name: string; // "Minute", "Hour", "Day", "Month"...
}

export type LaunchAgencyCountry = {
  name: string;
  alpha_2_code?: string;
}

export type LaunchServiceProvider = {
  id: number;
  name: string;
  abbrev: string;
  type?: { name: string } | null;
  country?: LaunchAgencyCountry[];
}

export type RocketConfiguration = {
  name: string;
  full_name: string;
  variant?: string | null;
}

export type MissionOrbit = {
  name: string;
}

export type LaunchMission = {
  name?: string | null;
  description?: string | null;
  type?: string | null;
  orbit?: MissionOrbit | null;
}

export type LaunchPadLocation = {
  name: string;
  country?: string | null;
}

// LL2 a remplacé ce champ par un objet riche (id, nom, crédit...) là où la doc ne liste qu'une
// simple URL — cohérent avec son avertissement sur les sous-objets imbriqués non documentés. On
// accepte les deux formes et on extrait l'URL exploitable via getLaunchImageUrl.
export type LaunchImage = {
  image_url?: string | null;
  thumbnail_url?: string | null;
} | string | null;

export type LaunchPad = {
  // Pas documenté pour l'objet embarqué dans un lancement (seuls name/location le sont), mais
  // nécessaire pour lier vers la fiche dédiée (/v3/pads/:id) — absent : pas de lien affiché.
  id?: number;
  name: string;
  location?: LaunchPadLocation | null;
  // Pas garantis par la doc pour l'objet embarqué dans un lancement (contrairement à /v3/pads
  // dédié) : absents, on se rabat sur un simple texte nom + localisation.
  latitude?: number | null;
  longitude?: number | null;
}

export type Launch = {
  id: string;
  name: string;
  status: LaunchStatus;
  net: string; // ISO 8601, "No Earlier Than"
  net_precision?: LaunchDatePrecision | null;
  window_start?: string | null;
  window_end?: string | null;
  // 0-100, absent ou négatif si inconnu (convention LL2) — voir getLaunchProbability.
  probability?: number | null;
  weather_concerns?: string | null;
  image?: LaunchImage;
  webcast_live: boolean;
  launch_service_provider: LaunchServiceProvider;
  rocket: { configuration: RocketConfiguration };
  mission: LaunchMission | null;
  pad: LaunchPad;
  // Compteurs "Nième lancement" à l'échelle orbitale/du site/du pas/de l'agence, total et sur
  // l'année — ex: "42ᵉ lancement orbital de l'année" (orbital_launch_attempt_count_year).
  orbital_launch_attempt_count?: number | null;
  orbital_launch_attempt_count_year?: number | null;
  agency_launch_attempt_count?: number | null;
  agency_launch_attempt_count_year?: number | null;
}
