// Style Google Maps "nuit" (tableau JSON standard, voir la Styling Wizard de Google) pour la carte
// de pollution lumineuse : fond sombre dans les tons de app_colors.primary.main plutôt que le fond
// clair par défaut, pour que la surcouche de tuiles (claire/colorée) et les libellés de lieux
// (laissés en blanc) restent lisibles. Routes, points d'intérêt et transports masqués : seuls les
// contours et noms de lieux restent utiles ici.
export const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#1a0a3d" }] },
  { elementType: "labels.icon", stylers: [{ visibility: "off" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#e8def8" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#160833" }] },
  {
    featureType: "administrative",
    elementType: "geometry",
    stylers: [{ color: "#4a3a7a" }],
  },
  {
    featureType: "administrative.country",
    elementType: "labels.text.fill",
    stylers: [{ color: "#c9b8ef" }],
  },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f2e9ff" }],
  },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2a1854" }],
  },
  { featureType: "road", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#0f0526" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#8f7ab8" }],
  },
];
