import { View } from "react-native";
import { Circle, Ellipse, Line, Svg } from "react-native-svg";
import { app_colors, withOpacity } from "../../../../helpers/variables";

const SIZE = 150;
const CENTER = SIZE / 2;
const MOON_RADIUS = 34;

/**
 * Illustration de l'entrée "Terminateur" (glossaire) : disque lunaire mordu par un second disque de
 * la couleur du fond (même technique à deux cercles que EclipseTypeIcon) pour suggérer la part
 * éclairée/sombre, ligne pointillée verticale pour le terminateur lui-même, petit point (satellite)
 * et orbite pointillée en arrière-plan, purement décoratifs.
 */
const TerminatorIllustration = () => (
  <View style={{ alignItems: "center", justifyContent: "center" }}>
    <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
      <Ellipse
        cx={CENTER}
        cy={CENTER}
        rx={SIZE * 0.47}
        ry={SIZE * 0.26}
        stroke={withOpacity(app_colors.white, 0.2)}
        strokeDasharray="3,5"
        fill="none"
        transform={`rotate(-12 ${CENTER} ${CENTER})`}
      />
      <Circle cx={SIZE * 0.78} cy={SIZE * 0.22} r={4} fill={withOpacity(app_colors.white, 0.6)} />
      <Circle cx={CENTER} cy={CENTER} r={MOON_RADIUS} fill={app_colors.accent.light} />
      <Circle cx={CENTER + MOON_RADIUS * 0.55} cy={CENTER} r={MOON_RADIUS} fill={app_colors.primary.main} />
      <Line
        x1={CENTER}
        y1={CENTER - MOON_RADIUS}
        x2={CENTER}
        y2={CENTER + MOON_RADIUS}
        stroke={app_colors.sun.main}
        strokeWidth={2}
        strokeDasharray="4,4"
      />
    </Svg>
  </View>
);

export default TerminatorIllustration;
