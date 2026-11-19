import { app_colors } from "../../../../../helpers/variables";

// Hauteur d'un cadre rectangulaire (capteur) bornée en fonction de sa largeur plutôt qu'en valeur
// absolue : ce composant sert à la fois en grand (mode "un setup") et en petit (grille "comparer"),
// avec des tailles (`size`) différentes à chaque fois — même esprit que
// CameraFieldVisualization.MIN_FRAME_HEIGHT/MAX_FRAME_HEIGHT, mais proportionnel.
const MIN_HEIGHT_RATIO = 0.45;
const MAX_HEIGHT_RATIO = 1.3;

// Petit semis d'étoiles fixe (positions en fraction de la largeur/hauteur) : purement décoratif,
// pas de donnée réelle derrière — juste pour que le fond du champ ne soit pas un aplat uni.
const STAR_POSITIONS: { x: number; y: number }[] = [
  { x: 0.15, y: 0.2 }, { x: 0.82, y: 0.16 }, { x: 0.26, y: 0.84 }, { x: 0.86, y: 0.72 },
  { x: 0.58, y: 0.08 }, { x: 0.1, y: 0.58 }, { x: 0.92, y: 0.46 }, { x: 0.46, y: 0.92 },
];

export const fieldOfViewPreviewStyles = {
  container: {
    alignItems: "center" as const,
    justifyContent: "center" as const,
  },

  background: app_colors.primary.main,
  border: app_colors.white,
};

export { MIN_HEIGHT_RATIO, MAX_HEIGHT_RATIO, STAR_POSITIONS };
