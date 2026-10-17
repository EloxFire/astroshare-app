import Svg, { Circle, Line, Text as SvgText } from "react-native-svg";
import { app_colors } from "../../helpers/variables";
import { polarToCartesian } from "../../helpers/polarScope";

interface SouthPolarScopeReticleProps {
  size: number;
  // Angle horaire actuel de σ Octantis (0° = haut, sens horaire) — même principe que Polaris au
  // nord, mais il n'y a pas d'étoile brillante exactement sur le pôle sud céleste : on s'aligne
  // sur ce petit astérisme (σ Octantis + 2 étoiles compagnes) plutôt que sur une étoile unique.
  sigmaOctantisAngleDegrees: number;
  // Nom de la constellation à afficher (ex: "σ Oct"), dérivé de getConstellation (Observerly) —
  // voir PolarScopeScreen.
  constellationLabel: string;
}

const PADDING = 24;

// Écarts angulaires (en degrés, autour de σ Octantis) des deux étoiles compagnes de l'astérisme —
// géométrie approximative calée sur le schéma de référence, Observerly ne fournissant pas de
// catalogue d'étoiles individuelles pour ces compagnes (seulement les limites de constellations).
const COMPANION_A_OFFSET_DEGREES = -18;
const COMPANION_B_OFFSET_DEGREES = 22;

const SouthPolarScopeReticle = ({ size, sigmaOctantisAngleDegrees, constellationLabel }: SouthPolarScopeReticleProps) => {
  const center = size / 2;
  const outerRadius = center - PADDING;
  const innerRadius = outerRadius * 0.35;
  const asterismRadius = outerRadius * 0.7;

  // Les 3 points sont définis par un angle absolu (décalage fixe autour de σ Octantis) : ils
  // tournent donc ensemble, de façon rigide, quand sigmaOctantisAngleDegrees change au fil du temps.
  const sigmaOctantis = polarToCartesian(center, center, asterismRadius, sigmaOctantisAngleDegrees);
  const companionA = polarToCartesian(center, center, asterismRadius * 0.82, sigmaOctantisAngleDegrees + COMPANION_A_OFFSET_DEGREES);
  const companionB = polarToCartesian(center, center, asterismRadius * 0.78, sigmaOctantisAngleDegrees + COMPANION_B_OFFSET_DEGREES);

  // Position du label fixe (ne tourne pas avec l'astérisme, pour rester toujours lisible plutôt
  // que de se retrouver à l'envers selon l'heure).
  const labelPoint = polarToCartesian(center, center, outerRadius + 14, 180);

  return (
    <Svg width={size} height={size}>
      <Circle cx={center} cy={center} r={outerRadius} stroke={app_colors.accent.light} strokeWidth={1.5} fill="none" />
      <Circle cx={center} cy={center} r={innerRadius} stroke={app_colors.accent.light} strokeWidth={1} fill="none" />

      <Line x1={sigmaOctantis.x} y1={sigmaOctantis.y} x2={companionA.x} y2={companionA.y} stroke={app_colors.accent.light} strokeWidth={1} />
      <Line x1={sigmaOctantis.x} y1={sigmaOctantis.y} x2={companionB.x} y2={companionB.y} stroke={app_colors.accent.light} strokeWidth={1} />

      {/* σ Octantis un peu plus marquée que ses compagnes : c'est la référence principale. */}
      <Circle cx={sigmaOctantis.x} cy={sigmaOctantis.y} r={5} fill={app_colors.grey} stroke={app_colors.accent.light} strokeWidth={1} />
      <Circle cx={companionA.x} cy={companionA.y} r={3} fill={app_colors.grey} stroke={app_colors.accent.light} strokeWidth={1} />
      <Circle cx={companionB.x} cy={companionB.y} r={3} fill={app_colors.grey} stroke={app_colors.accent.light} strokeWidth={1} />

      <SvgText
        x={labelPoint.x}
        y={labelPoint.y}
        fill={app_colors.accent.light}
        fontSize={14}
        fontWeight="bold"
        textAnchor="middle"
        alignmentBaseline="middle"
      >
        {constellationLabel}
      </SvgText>
    </Svg>
  );
};

export default SouthPolarScopeReticle;
