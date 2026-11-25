import { Circle, Svg } from "react-native-svg";
import { app_colors } from "../../../../../helpers/variables";

interface LunarContactGlyphProps {
  size?: number;
  // "full" : la Lune est entièrement dans l'ombre propre (U2/maximum/U3) — disque plein.
  // "crescent" : contact pénombral/partiel (P1/U1/U4/P2) — morsure sombre sur un côté du disque,
  // même technique à deux cercles que EclipseTypeIcon (pas de vrai masque SVG, le second cercle est
  // rempli de `backgroundColor` pour "découper" visuellement le premier).
  stage: "full" | "crescent";
  // Côté de la morsure : "entering" (l'ombre progresse, P1/U1) vs "exiting" (elle se retire, U4/P2).
  side?: "entering" | "exiting";
  // Sous l'horizon à ce contact : palette grisée/éteinte plutôt que les couleurs normales.
  dimmed?: boolean;
  // Couleur EXACTE du fond sur lequel ce pictogramme est posé (carte blanche ou fond de la feuille) —
  // nécessaire pour que la morsure se fonde parfaitement dedans.
  backgroundColor: string;
}

/**
 * Petit pictogramme de phase pour une ligne de contact lunaire (liste des phases de
 * LunarEclipseDetailsScreen) — distinct de EclipseTypeIcon (qui illustre le TYPE global de
 * l'éclipse), celui-ci illustre un contact précis dans la liste.
 */
const LunarContactGlyph = ({ size = 28, stage, side = "entering", dimmed, backgroundColor }: LunarContactGlyphProps) => {
  const center = size / 2;
  const radius = size / 2 - 1;
  const litColor = dimmed ? "#CFC9DE" : app_colors.grey;
  const darkColor = dimmed ? "#B3ACC6" : app_colors.primary.main;

  if (stage === "full") {
    return (
      <Svg width={size} height={size}>
        <Circle cx={center} cy={center} r={radius} fill={darkColor} />
      </Svg>
    );
  }

  const biteOffset = side === "entering" ? -radius * 0.9 : radius * 0.9;
  return (
    <Svg width={size} height={size}>
      <Circle cx={center} cy={center} r={radius} fill={litColor} />
      <Circle cx={center + biteOffset} cy={center} r={radius} fill={backgroundColor} />
    </Svg>
  );
};

export default LunarContactGlyph;
