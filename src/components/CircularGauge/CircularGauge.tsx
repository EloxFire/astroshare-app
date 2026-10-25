import { ReactNode } from "react";
import { View } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { circularGaugeStyles } from "./CircularGauge.styles";
import { app_colors, withOpacity } from "../../helpers/variables";

interface CircularGaugeProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  trackColor?: string;
  progressColor?: string;
  children?: ReactNode;
}

// Jauge circulaire générique (anneau de progression + contenu libre au centre), en SVG fait main —
// pas de composant "circular progress" tout fait dans l'app. `rotation={-90}` + `origin` démarrent
// l'anneau en haut (midi) plutôt qu'à droite (défaut SVG), pour lire comme une jauge classique.
const CircularGauge = ({
  value,
  max = 100,
  size = 100,
  strokeWidth = 10,
  trackColor = withOpacity(app_colors.accent.main, 0.15),
  progressColor = app_colors.accent.main,
  children,
}: CircularGaugeProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(value / max, 0), 1);
  const center = size / 2;

  return (
    <View style={[circularGaugeStyles.container, { width: size, height: size }]}>
      <Svg width={size} height={size}>
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          rotation={-90}
          origin={`${center}, ${center}`}
        />
      </Svg>
      <View style={[circularGaugeStyles.content, { width: size, height: size }]}>
        {children}
      </View>
    </View>
  );
};

export default CircularGauge;
