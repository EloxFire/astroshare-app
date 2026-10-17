import { Circle, Line, Svg, Text as SvgText } from "react-native-svg";
import { app_colors } from "../../helpers/variables";

interface NorthPolarScopeReticleProps {
  size: number;
  // Angle horaire actuel de Polaris, en degrés (0-360) — voir PolarScopeScreen.
  polarisHourAngleDegrees: number;
}

const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

// Repris de la V2 (AstroShare), formule + composition de rotation validées empiriquement sur un
// vrai viseur polaire — ne pas "simplifier" sans retester sur device.
const NorthPolarScopeReticle = ({ size, polarisHourAngleDegrees }: NorthPolarScopeReticleProps) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = (size / 2) - 30;
  const strokeColor = app_colors.accent.light;

  const haRad = degreesToRadians(polarisHourAngleDegrees);
  const polarisX = (radius - 5) * Math.cos(haRad);
  const polarisY = (radius - 5) * Math.sin(haRad);

  return (
    <Svg style={{ backgroundColor: "transparent" }} height={size} width={size}>
      {/* Cercle principal */}
      <Circle cx={centerX} cy={centerY} r={radius} stroke={strokeColor} strokeWidth="1" fill="none" />
      <Circle cx={centerX} cy={centerY} r={radius - 12} stroke={strokeColor} strokeWidth="1" fill="none" />

      {/* Heures principales */}
      <SvgText x={centerX} y={centerY - (radius + 15)} fontSize={20} fill={strokeColor} textAnchor="middle">0</SvgText>
      <SvgText x={centerX + (radius + 20)} y={centerY + 7} fontSize={20} fill={strokeColor} textAnchor="middle">3</SvgText>
      <SvgText x={centerX} y={centerY + (radius + 30)} fontSize={20} fill={strokeColor} textAnchor="middle">6</SvgText>
      <SvgText x={centerX - (radius + 20)} y={centerY + 7} fontSize={20} fill={strokeColor} textAnchor="middle">9</SvgText>

      {/* Lignes des heures (12, sauf les 4 heures principales déjà marquées par un label) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const mainHourIndices = [0, 3, 6, 9];
        if (mainHourIndices.includes(i % 12)) return null;

        return (
          <Line
            key={`hour-${i}`}
            x1={centerX}
            y1={centerY - radius - 20}
            x2={centerX}
            y2={centerY - radius + 30}
            stroke={strokeColor}
            strokeWidth="1"
            transform={`rotate(${(i * 360) / 12}, ${centerX}, ${centerY})`}
          />
        );
      })}

      {/* Graduations fines (72, tous les 5°) */}
      {Array.from({ length: 72 }).map((_, i) => {
        const mainHourIndices = [0, 6, 12, 18, 24, 30, 36, 42, 48, 54, 60, 66, 72];
        if (mainHourIndices.includes(i % 60)) return null;

        return (
          <Line
            key={`minute-${i}`}
            x1={centerX}
            y1={centerY - radius - 5}
            x2={centerX}
            y2={centerY - radius + 20}
            stroke={strokeColor}
            strokeWidth="1"
            transform={`rotate(${(i * 360) / 72}, ${centerX}, ${centerY})`}
          />
        );
      })}

      {/* Les graduations ci-dessus sont dessinées volontairement longues (pour ne jamais laisser
          d'interstice) puis "coupées" ici par un anneau épais à la couleur de fond de l'écran —
          d'où le couplage à app_colors.primary.main (fond de PolarScopeScreen). Un fin cercle
          redessiné par-dessus donne une bordure nette. */}
      <Circle cx={centerX} cy={centerY} r={radius - 6} stroke={app_colors.primary.main} strokeWidth="12" fill="none" />
      <Circle cx={centerX} cy={centerY} r={radius - 6} stroke={strokeColor} strokeWidth="1" fill="none" />

      {/* Lignes verticales et horizontales (croix centrale) */}
      <Line x1={centerX} y1={centerY - radius - 10} x2={centerX} y2={centerY + radius + 10} stroke={strokeColor} strokeWidth="2" />
      <Line x1={centerX - radius - 10} y1={centerY} x2={centerX + radius + 10} y2={centerY} stroke={strokeColor} strokeWidth="2" />

      {/* Position de Polaris sur le cercle */}
      <Circle
        cx={centerX + polarisX}
        cy={centerY - polarisY}
        r={5}
        fill={app_colors.grey}
        transform={`rotate(90, ${centerX}, ${centerY})`}
      />
    </Svg>
  );
};

export default NorthPolarScopeReticle;
