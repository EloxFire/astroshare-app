// Formes renvoyées par /v3/eclipses/solar et /v3/eclipses/lunar (relais de l'API IMCCE/OPALE — voir
// docs/agents-reference.md). Toutes les unions `type` sont ouvertes (`| (string & {})`), même
// convention que CatalogObjectKind : ne jamais supposer l'énumération figée. Vérifié en direct :
// `type` prend 3 préfixes selon le mode d'appel — "NonCentral*"/"Central*" (liste par année) et
// "Observer*" (appel avec `observer=lat,lon`, voir getLocalSolarEclipse/getLocalLunarEclipse).

// GeoJSON minimal (seuls les champs réellement consommés par l'app sont typés précisément) — les
// coordonnées sont [longitude, latitude, altitude?], convention GeoJSON, PAS [latitude, longitude]
// (react-native-maps attend l'inverse : voir src/helpers/eclipses/geojson.ts).
export type GeoJsonPosition = [number, number, number?];

export type MultiLineStringGeometry = {
  type: "MultiLineString";
  coordinates: GeoJsonPosition[][];
};

export type MultiPolygonGeometry = {
  type: "MultiPolygon";
  // [polygone][anneau][point] — premier anneau = contour extérieur, les suivants = trous.
  coordinates: GeoJsonPosition[][][];
};

export type EclipseVisibilityFeature<Geometry> = {
  type: "Feature";
  properties: { name: string } & Record<string, unknown>;
  geometry: Geometry;
};

export type EclipseVisibilityCollection<Geometry> = {
  type: "FeatureCollection";
  features: EclipseVisibilityFeature<Geometry>[];
};

export type EclipseVisibilityLines = EclipseVisibilityCollection<MultiLineStringGeometry>;
export type EclipseVisibilityPaths = EclipseVisibilityCollection<MultiPolygonGeometry>;

// Position d'un corps (Soleil/Lune) à l'instant d'un contact — RA en HEURES (convention IMCCE, pas
// des degrés), non utilisée telle quelle par l'app (les circonstances locales viennent de l'appel
// `observer=`, pas d'un recalcul côté app à partir de RA/DEC) — gardée pour information/diagrammes.
export type EclipseBodyPosition = {
  RA?: number;
  DEC?: number;
  azimuth?: number;
  elevation?: number;
  parallax?: number;
  radius?: number; // rayon angulaire, en degrés
  shape?: string;
};

export type EclipseGeoPointFeature = {
  type: "Feature";
  geometry: { type: "Point"; coordinates: GeoJsonPosition };
  properties?: { coordinatesDMS?: [string, string, string] };
};

// Évènement d'une éclipse SOLAIRE : `p` (angle de position céleste), `s` (distance, non utilisée) et
// `zenith` (angle au zénith, repère LOCAL) sont des ANGLES — contrairement à l'évènement lunaire, où
// `zenith` est un POINT géographique (voir LunarEclipseEvent). Ne pas confondre les deux formes.
export type SolarEclipseEvent = {
  date: string; // ISO, UTC, SANS suffixe "Z" (vérifié en direct) — toujours faire `new Date(`${date}Z`)`
  Moon?: EclipseBodyPosition;
  Sun?: EclipseBodyPosition;
  location?: EclipseGeoPointFeature | null;
  p?: number | null;
  s?: number | null;
  zenith?: number | null;
} & Record<string, unknown>;

// Évènement d'une éclipse LUNAIRE : `zenith` est ici un point géographique (le point sous la Lune à
// cet instant), `axis`/`p` des nombres — forme différente de l'évènement solaire malgré des noms de
// champs identiques.
export type LunarEclipseEvent = {
  date: string;
  Moon?: EclipseBodyPosition;
  Sun?: EclipseBodyPosition;
  axis?: number;
  p?: number | null;
  zenith?: EclipseGeoPointFeature | null;
} & Record<string, unknown>;

export type SolarEclipseType =
  | "CentralTotalEclipse"
  | "CentralAnnularEclipse"
  | "CentralHybridEclipse"
  | "NonCentralPartialEclipse"
  | "NonCentralTotalEclipse"
  | "NonCentralAnnularEclipse"
  | "NonCentralHybridEclipse"
  | "ObserverPartialEclipse"
  | "ObserverTotalEclipse"
  | "ObserverAnnularEclipse"
  | (string & {});

export type LunarEclipseType = "PenumbralEclipse" | "PartialEclipse" | "TotalEclipse" | (string & {});

// Contacts possibles — tous ne sont pas présents selon le type (ex: une éclipse solaire non centrale
// n'a pas de C1/C2 ; une éclipse lunaire pénombrale n'a pas de U1-U4), vérifié en direct. Le solaire
// n'a jamais que P1/P4 (jamais P2/P3, malgré le type qui les déclare côté API).
export type SolarEclipseEventKey = "C1" | "C2" | "P1" | "P4" | "U1" | "U2" | "U3" | "U4" | "greatest";
export type LunarEclipseEventKey = "P1" | "P2" | "U1" | "U2" | "U3" | "U4" | "greatest";

export type SolarEclipse = {
  calendarDate: string; // "YYYY-MM-DD"
  type: SolarEclipseType;
  magnitude: number;
  obscuration: number | null;
  duration: { penumbral: string; umbral: string | null };
  link?: { image?: string; self?: string; video?: string };
  physicalData?: Record<string, { radius?: number; inverseFlattening?: number }>;
  events: Partial<Record<SolarEclipseEventKey, SolarEclipseEvent>>;
  visibilityLines?: EclipseVisibilityLines;
  visibilityPaths?: EclipseVisibilityPaths;
};

export type LunarEclipse = {
  calendarDate: string;
  type: LunarEclipseType;
  magnitude: number;
  radius?: { penumbra: number; umbra: number };
  duration: { penumbral: string; partial?: string | null; total?: string | null };
  link?: { image?: string; self?: string; video?: string };
  events: Partial<Record<LunarEclipseEventKey, LunarEclipseEvent>>;
  visibilityLines?: EclipseVisibilityLines;
  visibilityPaths?: EclipseVisibilityPaths;
};
