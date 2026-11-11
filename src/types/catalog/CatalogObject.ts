// Formes renvoyées par /v3/objects, /v3/objects/search et /v3/objects/:id — remplace entièrement
// les anciennes routes /v3/messier, /v3/ngc, /v3/ic, /v3/dso, /v3/stars, /v3/search (supprimées).
// kind peut dans le futur valoir autre chose que les valeurs connues ("small_body" déjà annoncé) :
// toujours traiter en générique (switch avec cas par défaut), jamais supposer l'énumération figée.
export type CatalogObjectKind = "dso" | "star" | "small_body";

export type CatalogObjectCategory = "galaxy" | "cluster" | "nebula" | "star" | "other";

export type CatalogObjectPosition = {
  ra: number; // degrés, J2000
  dec: number; // degrés, J2000
  const: string; // abréviation de constellation (ex: "Ori")
};

export type CatalogObjectDistance = {
  value: number;
  unit: string;
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
  position: CatalogObjectPosition;
  magnitude: number | null; // magnitude visuelle - plus petit = plus brillant (convention astro standard)
  distance: CatalogObjectDistance | null;
};

export type CatalogObjectNames = {
  fr: string[];
  en: string[];
};

export type CatalogObjectDesignations = {
  messier: number | null;
  caldwell: number | null;
  ngc: string[];
  ic: string[];
  other: string[];
  aliases: string[];
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
  best_months: number[];
  naked_eye: boolean | null;
};

// Présent uniquement si kind === "dso". Champs internes pas encore consommés côté app
// (kinematics/central_star/notes) : laissés en `unknown`, à affiner le jour où on les affiche.
export type CatalogObjectDsoDetails = {
  size: { major: number | null; minor: number | null; pa: number | null };
  morphology: string | null;
  kinematics: unknown;
  central_star: unknown;
  notes: { ned: string | null };
};

// Présent uniquement si kind === "star". Forme pas détaillée dans le brief API (seul l'exemple DSO
// est donné) : à typer précisément le jour où on consomme ce champ.
export type CatalogObjectStarDetails = unknown;

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
};

// Enveloppe paginée de GET /v3/objects.
export type CatalogObjectListResponse = {
  page: number;
  limit: number;
  total: number;
  data: CatalogObjectSummary[];
};
