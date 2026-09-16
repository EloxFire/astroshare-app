import Svg, { Circle, Path } from "react-native-svg";
import type { Phase } from "@observerly/astrometry";
import { app_colors } from "../../helpers/variables";

type MoonPhaseIconProps = {
  // Fraction illuminée du disque lunaire, en pourcentage (0 = Nouvelle Lune, 100 = Pleine Lune).
  illumination: number;
  // Phase au format observerly (valeur renvoyée par getLunarPhase) — sert uniquement à déduire
  // le sens de dessin (croissante/décroissante), voir getDirectionFromPhase ci-dessous.
  phase: Phase;
  size?: number;
  litColor?: string;
  darkColor?: string;
};

const OUTER_RADIUS = 10;
const CENTER = 12;

// Phases où la Lune est décroissante (la lumière régresse, ne reste qu'à gauche avant la
// Nouvelle Lune) — toutes les autres (dont New/Full, où le sens ne change rien au rendu puisque
// bulgeRadius vaut alors 0 ou OUTER_RADIUS des deux côtés) sont traitées comme croissantes.
const WANING_PHASES: Phase[] = ["Waning Gibbous", "Last Quarter", "Waning Crescent"];

// Nécessaire en plus de `illumination` : 50% éclairé n'a pas le même rendu au Premier Quartier
// (moitié droite éclairée) qu'au Dernier Quartier (moitié gauche éclairée).
const getDirectionFromPhase = (phase: Phase): "waxing" | "waning" =>
  WANING_PHASES.includes(phase) ? "waning" : "waxing";

// Construit le path SVG d'un demi-disque (rayon horizontal `rx`, rayon vertical fixe
// OUTER_RADIUS) bombé vers `sweep` (1 = droite, 0 = gauche), fermé par une ligne droite qui suit
// naturellement le diamètre vertical — plus simple et plus sûr qu'un second arc à raccorder.
const halfDiscPath = (rx: number, sweep: 0 | 1): string =>
  `M ${CENTER} ${CENTER - OUTER_RADIUS} A ${rx} ${OUTER_RADIUS} 0 0 ${sweep} ${CENTER} ${CENTER + OUTER_RADIUS} Z`;

/**
 * MoonPhaseIcon
 *
 * Icône vectorielle de la phase lunaire actuelle (dans l'esprit de lunarcalendar.org) : un
 * disque sombre avec une portion éclairée dont la forme dépend de `illumination` + `phase`.
 *
 * Géométrie : le disque est coupé en deux par son diamètre vertical. Un côté ("litSide",
 * déterminé par le sens croissant/décroissant de `phase`) est celui où la lumière apparaît en
 * premier ; l'autre ("darkSide") reste sombre plus longtemps. Sous 50% d'illumination, litSide
 * porte un croissant de largeur variable (0 à la Nouvelle Lune → plein rayon au Quartier) et
 * darkSide reste entièrement sombre. Au-delà de 50%, litSide est entièrement éclairé (fixe), et
 * c'est darkSide qui se fait progressivement manger par un renflement variable (0 au Quartier →
 * plein rayon à la Pleine Lune).
 */
const MoonPhaseIcon = ({
  illumination,
  phase,
  size = 44,
  litColor = app_colors.yellow.light,
  darkColor = app_colors.primary.main,
}: MoonPhaseIconProps) => {
  const illuminatedFraction = Math.min(1, Math.max(0, illumination / 100));
  const isGibbous = illuminatedFraction >= 0.5;
  const direction = getDirectionFromPhase(phase);

  // "waxing" : le côté droit s'éclaire en premier (croissant) et reste éclairé en continu
  // jusqu'à la Pleine Lune — c'est le côté qui porte la lumière ("litSide"). "waning" : c'est le
  // côté gauche, symétriquement.
  const litSide: "left" | "right" = direction === "waxing" ? "right" : "left";
  const darkSide: "left" | "right" = litSide === "right" ? "left" : "right";

  // < 50% (croissant fin) : darkSide reste entièrement sombre, et c'est litSide qui porte un
  // croissant de largeur variable (0 à la Nouvelle Lune → plein rayon au Quartier).
  // >= 50% (gibbeuse) : litSide est entièrement éclairé (fixe), et c'est darkSide qui se fait
  // progressivement manger par un renflement variable (0 au Quartier → plein rayon à la Pleine
  // Lune). Le côté qui porte le renflement variable change donc selon la phase — litSide en
  // croissant fin, darkSide en gibbeuse — alors que litSide reste toujours le "point de départ".
  const bulgeSide = isGibbous ? darkSide : litSide;
  const litSideIsFullyLit = isGibbous;

  const bulgeRadius = isGibbous
    ? OUTER_RADIUS * (2 * illuminatedFraction - 1) // 0 au Premier/Dernier Quartier → OUTER_RADIUS à la Pleine Lune
    : OUTER_RADIUS * (2 * illuminatedFraction); // 0 à la Nouvelle Lune → OUTER_RADIUS au Premier/Dernier Quartier

  const sweepFor = (side: "left" | "right"): 0 | 1 => (side === "right" ? 1 : 0);

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Circle cx={CENTER} cy={CENTER} r={OUTER_RADIUS - 0.25} fill={darkColor} />

      {litSideIsFullyLit && <Path d={halfDiscPath(OUTER_RADIUS, sweepFor(litSide))} fill={litColor} />}

      {bulgeRadius > 0 && <Path d={halfDiscPath(bulgeRadius, sweepFor(bulgeSide))} fill={litColor} />}

      <Circle cx={CENTER} cy={CENTER} r={OUTER_RADIUS} fill="none" stroke={darkColor} strokeWidth={0.5} />
    </Svg>
  );
};

export default MoonPhaseIcon;
