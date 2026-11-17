// Satellites mis en avant sur l'écran Satellites ("Stations spatiales" / "À suivre aussi"). On les
// désigne par un bout de nom (résolu via /v3/norad/:query, recherche partielle) plutôt que par un
// ID NORAD codé en dur : l'app n'a pas de source fiable pour vérifier chaque ID à la main, et
// /v3/satellite/* accepte de toute façon `name=` directement — l'ID NORAD réel n'est lu qu'une
// fois la fiche catalogue résolue (norad_id), pour la navigation vers la fiche détail.
export type FeaturedSatelliteQuery = {
  key: string; // clé stable (traductions, React key), indépendante du nom réellement retourné par l'API
  query: string;
};

export const FEATURED_STATIONS: FeaturedSatelliteQuery[] = [
  { key: "iss", query: "ISS (ZARYA)" },
  { key: "tiangong", query: "CSS (TIANHE)" },
];

export const FEATURED_SATELLITES: FeaturedSatelliteQuery[] = [
  { key: "hubble", query: "HST" },
  { key: "starlink-1007", query: "STARLINK-1007" },
  { key: "noaa-19", query: "NOAA 19" },
  { key: "envisat", query: "ENVISAT" },
];
