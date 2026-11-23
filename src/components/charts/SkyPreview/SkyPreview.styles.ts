import { app_colors, radius, withOpacity } from "../../../helpers/variables";

// Semis d'étoiles de fond fixe, purement décoratif (même principe que STAR_POSITIONS de
// FieldOfViewPreview, voir ce composant) : pas un vrai champ stellaire, juste de quoi donner une
// ambiance de ciel nocturne derrière la figure tracée. Coordonnées en fractions [0, 1] du carré
// affiché.
const BACKGROUND_STAR_POSITIONS: { x: number; y: number; r: number; opacity: number }[] = [
  { x: 0.08, y: 0.12, r: 1, opacity: 0.5 }, { x: 0.22, y: 0.06, r: 1.3, opacity: 0.7 },
  { x: 0.38, y: 0.14, r: 0.8, opacity: 0.4 }, { x: 0.52, y: 0.05, r: 1, opacity: 0.6 },
  { x: 0.68, y: 0.1, r: 1.2, opacity: 0.5 }, { x: 0.82, y: 0.07, r: 0.9, opacity: 0.45 },
  { x: 0.92, y: 0.18, r: 1.1, opacity: 0.6 }, { x: 0.05, y: 0.32, r: 0.9, opacity: 0.4 },
  { x: 0.9, y: 0.35, r: 1, opacity: 0.5 }, { x: 0.12, y: 0.52, r: 1.2, opacity: 0.55 },
  { x: 0.04, y: 0.68, r: 0.8, opacity: 0.4 }, { x: 0.94, y: 0.58, r: 0.9, opacity: 0.45 },
  { x: 0.88, y: 0.78, r: 1.1, opacity: 0.5 }, { x: 0.08, y: 0.84, r: 1, opacity: 0.5 },
  { x: 0.2, y: 0.92, r: 0.8, opacity: 0.4 }, { x: 0.36, y: 0.88, r: 1.2, opacity: 0.6 },
  { x: 0.58, y: 0.94, r: 0.9, opacity: 0.45 }, { x: 0.74, y: 0.9, r: 1, opacity: 0.5 },
  { x: 0.46, y: 0.3, r: 0.7, opacity: 0.3 }, { x: 0.3, y: 0.46, r: 0.7, opacity: 0.3 },
  { x: 0.64, y: 0.58, r: 0.7, opacity: 0.3 }, { x: 0.78, y: 0.42, r: 0.8, opacity: 0.35 },
];

export const skyPreviewStyles = {
  card: {
    backgroundColor: app_colors.black,
    borderRadius: radius.heroCard,
    padding: 14,
    gap: 10,
  },

  title: {
    color: app_colors.white,
    fontSize: 16,
    fontFamily: "ZTNatureBold",
    textTransform: "uppercase" as const,
  },

  chart: {
    alignItems: "center" as const,

    // Mesuré en largeur (onLayout) quand aucune taille fixe n'est passée en prop : width 100% pour
    // que la mesure corresponde à la largeur réelle de la carte, pas au carré lui-même (qui ne
    // prend sa taille qu'une fois mesuré).
    fill: {
      width: "100%" as const,
    },
  },

  footer: {
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    paddingHorizontal: 2,

    item: {
      caption: {
        color: withOpacity(app_colors.white, 0.5),
        fontSize: 10,
        fontFamily: "DMMonoRegular",
        textTransform: "uppercase" as const,
      },

      value: {
        color: app_colors.white,
        fontSize: 12,
        fontFamily: "DMMonoMedium",
        marginTop: 2,
      },

      alignEnd: {
        alignItems: "flex-end" as const,
      },
    },
  },
};

export { BACKGROUND_STAR_POSITIONS };
