// Formes renvoyées par /v3/objects, /v3/objects/search et /v3/objects/:id — remplace entièrement
// les anciennes routes /v3/messier, /v3/ngc, /v3/ic, /v3/dso, /v3/stars, /v3/search (supprimées).
// kind peut dans le futur valoir autre chose que les valeurs connues : toujours traiter en générique
// (switch avec cas par défaut), jamais supposer l'énumération figée.
// "solar_system" : Soleil, Lune, planètes (id du type "SS-MARS"). Ces objets bougent dans le ciel :
// le catalogue ne leur donne ni position, ni magnitude, ni distance (null), il faut les calculer à
// la date voulue (voir CatalogObjectSolarSystemDetails.ephemeris).
export type CatalogObjectKind = "dso" | "star" | "small_body" | "solar_system";

export type CatalogObjectCategory = "galaxy" | "cluster" | "nebula" | "star" | "other" | "solar_system";

export type CatalogObjectPosition = {
  ra: number; // degrés, J2000
  dec: number; // degrés, J2000
  const: string | null; // abréviation de constellation (ex: "Ori"), null si le serveur ne la connaît pas
};

export type CatalogObjectDistance = {
  value: number;
  unit: "ly" | "yr" | (string & {}); // valeurs annoncées par la doc de l'API, liste non figée

  // true : afficher avec un "≈" ou équivalent. Seul le format liste porte ce booléen précalculé —
  // la fiche complète (CatalogObjectDetail) garde err/source/confidence à la place (voir plus bas).
  approximate: boolean;
};

// Format liste : renvoyé par /v3/objects et /v3/objects/search, pas de description ni désignations
// complètes (voir CatalogObjectDetail pour la fiche complète, via /v3/objects/:id).
export type CatalogObjectSummary = {
  // Identifiant stable (ex: "NGC1976") : à utiliser pour toute référence (favoris, journal...),
  // jamais un index ou un _id Mongo — celui-ci change à chaque réimport périodique du catalogue.
  id: string;
  kind: CatalogObjectKind | (string & {});
  type: string; // pas d'énum côté serveur (ex: "emission_nebula")
  category: CatalogObjectCategory | (string & {});
  primary: string; // désignation principale (ex: "M 42")
  name: string; // libellé déjà résolu côté serveur (names.fr[0] ?? names.en[0] ?? primary) — à afficher tel quel, ne pas recalculer
  // null pour un objet du système solaire (voir CatalogObjectKind) : vérifier avant tout calcul de
  // visibilité ou placement sur une carte du ciel.
  position: CatalogObjectPosition | null;
  magnitude: number | null; // magnitude visuelle - plus petit = plus brillant (convention astro standard) ; null pour le système solaire
  distance: CatalogObjectDistance | null; // null pour le système solaire
};

export type CatalogObjectNames = {
  fr: string[];
  en: string[];
};

// Toutes les clés optionnelles : vérifié en direct, un objet du système solaire (ex. SS-MOON,
// SS-SATURN) ne renvoie que `other`/`aliases` — messier/caldwell/ngc/ic sont absents (pas juste
// `null`), pas la peine de catalogue alternatif pour ces objets-là.
export type CatalogObjectDesignations = {
  messier?: number | null;
  caldwell?: number | null;
  ngc?: string[];
  ic?: string[];
  other?: string[];
  aliases?: string[];
};

export type CatalogObjectPhotometry = {
  v: number | null;
  b: number | null;
  j: number | null;
  h: number | null;
  k: number | null;
  surface_brightness: number | null;
};

// Contrairement au format liste (CatalogObjectDistance ci-dessus), la fiche garde la provenance de
// la mesure plutôt qu'un simple booléen "approximate" précalculé — à recalculer soi-même si besoin
// d'affichage (ex: confidence === "low" || err/value > 0.3).
export type CatalogObjectMeasurementConfidence = "low" | "moderate" | "high";

export type CatalogObjectDistanceMeasurement = {
  value: number;
  unit: string;
  err: number | null;
  source: string | null;
  confidence: CatalogObjectMeasurementConfidence | null;
};

export type CatalogObjectAgeMeasurement = {
  value: number;
  unit: string;
  err: number | null;
  source: string | null;
  confidence: CatalogObjectMeasurementConfidence | null;
};

export type CatalogObjectDiameterMeasurement = {
  major: number;
  minor: number;
  err: number | null;
  unit: string;
  source: string | null;
  confidence: CatalogObjectMeasurementConfidence | null;
};

export type CatalogObjectPhysical = {
  distance: CatalogObjectDistanceMeasurement | null;
  age: CatalogObjectAgeMeasurement | null;
  diameter: CatalogObjectDiameterMeasurement | null;
};

export type CatalogObjectDiscovery = {
  by: string | null;
  year: number | null;
  source: string | null;
  confidence: CatalogObjectMeasurementConfidence | null;
};

export type CatalogObjectContent = {
  description: { fr: string | null; en: string | null; origin: string } | null;
  images: string[];
};

export type CatalogObjectCustom = {
  difficulty: string | null;
  // Mois calendaires 1-12 (vérifié en direct, ex. Galaxie d'Andromède → [9,10,11]) — nullable (voire
  // absente de la réponse, ex. objets du système solaire) en pratique malgré le typage
  // non-optionnel de la doc API : vérifié en direct `null` sur plusieurs objets du ciel profond
  // avec par ailleurs une fiche complète (ex. M 42, Pléiades), et totalement absente (pas même
  // `null`) sur un objet du système solaire (ex. SS-MOON, SS-SATURN).
  best_months?: number[] | null;
  naked_eye: boolean | null;
};

// Présent uniquement si kind === "dso". Champs internes pas encore consommés côté app
// (kinematics/central_star/notes) : laissés en `unknown`, à affiner le jour où on les affiche.
export type CatalogObjectDsoDetails = {
  // Arcminutes, pas précisé par la doc API — vérifié en direct (M 42 → major:90, minor:60).
  size: { major: number | null; minor: number | null; pa: number | null };
  morphology: string | null;
  kinematics: unknown;
  central_star: unknown;
  notes: { ned: string | null };
};

// Présent uniquement si kind === "star". Forme pas détaillée dans le brief API (seul l'exemple DSO
// est donné) : à typer précisément le jour où on consomme ce champ.
export type CatalogObjectStarDetails = unknown;

// Source des éphémérides d'un objet du système solaire, c'est-à-dire de quoi calculer sa position à
// une date donnée. `provider` n'est pas limité à "observerly" (calcul local via
// @observerly/astrometry) : les comètes et astéroïdes arriveront avec "orbit" et leurs éléments
// orbitaux dans `orbit`. Jamais de `if (provider === "observerly")` strict sans cas par défaut.
export type CatalogObjectEphemeris = {
  provider: "observerly" | "orbit" | (string & {});
  body?: "sun" | "moon" | "planet" | (string & {});
  uid?: string;
  name?: string;
};

// Présent uniquement si kind === "solar_system".
export type CatalogObjectSolarSystemDetails = {
  ephemeris: CatalogObjectEphemeris;
  // Clés libres côté serveur (mass_kg, diameter_km, orbital_period_d, moons, rings...) : vérifier le
  // type de chaque valeur à l'usage (typeof), rien n'est garanti par l'API.
  facts: Record<string, unknown>;
  facts_source?: string;
  parent: "sun" | "earth" | null;
  symbol?: string; // symbole astronomique de l'objet (forme exacte non précisée par l'API)
  // Éléments orbitaux des futurs objets à provider "orbit" (comètes, astéroïdes) : forme pas encore
  // documentée, à typer le jour où l'API les publie.
  orbit?: unknown;
};

// Fiche complète : renvoyée par /v3/objects/:id uniquement — jamais search_terms, meta,
// dso.openngc, star.hyg (toujours absents de la réponse, pas la peine de les typer).
export type CatalogObjectDetail = CatalogObjectSummary & {
  names: CatalogObjectNames;
  designations: CatalogObjectDesignations;
  photometry: CatalogObjectPhotometry;
  physical: CatalogObjectPhysical;
  discovery: CatalogObjectDiscovery;
  content: CatalogObjectContent;
  custom: CatalogObjectCustom;
  dso?: CatalogObjectDsoDetails;
  star?: CatalogObjectStarDetails;
  solar_system?: CatalogObjectSolarSystemDetails;
};

// Enveloppe paginée de GET /v3/objects.
export type CatalogObjectListResponse = {
  page: number;
  limit: number;
  total: number;
  data: CatalogObjectSummary[];
};
