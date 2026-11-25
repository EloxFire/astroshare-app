import type { GeoJsonPosition, MultiLineStringGeometry, MultiPolygonGeometry } from "../../types/eclipses/Eclipse";

export type LatLng = { latitude: number; longitude: number };

// GeoJSON ordonne [longitude, latitude], react-native-maps attend l'inverse ({latitude, longitude})
// — toute lecture de visibilityLines/visibilityPaths passe par ces deux fonctions, pour ne jamais
// inverser l'ordre à la main ailleurs dans l'écran.
const toLatLng = ([longitude, latitude]: GeoJsonPosition): LatLng => ({ latitude, longitude });

// Un <Polyline> de react-native-maps ne trace qu'une seule ligne : une MultiLineString (plusieurs
// segments séparés, ex. la ligne centrale coupée aux pôles) devient un tableau de tracés, un par
// segment, à rendre chacun dans son propre <Polyline>.
export const multiLineStringToPolylines = (geometry: MultiLineStringGeometry): LatLng[][] =>
  geometry.coordinates.map((line) => line.map(toLatLng));

// Un <Polygon> de react-native-maps prend un contour (coordinates) et des trous optionnels (holes) :
// un MultiPolygon (plusieurs polygones séparés) devient un tableau de {outer, holes}, un par
// polygone, à rendre chacun dans son propre <Polygon>. Premier anneau = contour, les suivants =
// trous (convention GeoJSON).
export const multiPolygonToPolygons = (geometry: MultiPolygonGeometry): { outer: LatLng[]; holes: LatLng[][] }[] =>
  geometry.coordinates.map(([outer, ...holes]) => ({
    outer: outer.map(toLatLng),
    holes: holes.map((hole) => hole.map(toLatLng)),
  }));

// Premier anneau extérieur d'un unique polygone d'un MultiPolygon — pour les masques "assombrir tout
// sauf..." (voir SolarEclipseDetailsScreen) : la pénombre d'une éclipse ne forme jamais qu'une seule
// pièce contiguë (vérifié sur plusieurs années), donc toujours le premier polygone du MultiPolygon.
export const firstPolygonOuterRing = (geometry: MultiPolygonGeometry): LatLng[] | null => {
  const firstPolygon = geometry.coordinates[0];
  if (!firstPolygon) return null;
  return firstPolygon[0].map(toLatLng);
};
