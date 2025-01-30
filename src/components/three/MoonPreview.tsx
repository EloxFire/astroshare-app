import React from "react";
import { View, StyleSheet } from "react-native";

interface MoonPhaseProps {
  size: number; // Diamètre du disque en pixels
  phase: number; // Phase entre 0 (nouvelle lune) et 1 (pleine lune)
  isWaxing: boolean; // Croissant (waxing) ou décroissant (waning)
  lightColor?: string; // Couleur de la partie éclairée
  shadowColor?: string; // Couleur de la partie ombrée
  earthshine?: number; // Éclairage de la partie sombre (entre 0 et 1)
  blur?: number; // Intensité de la transition floue (en pixels)
}

const MoonPhase: React.FC<MoonPhaseProps> = ({
                                               size,
                                               phase,
                                               isWaxing,
                                               lightColor = "white",
                                               shadowColor = "black",
                                               earthshine = 0.1,
                                               blur = 10,
                                             }) => {
  // Calculer les dimensions et décalages
  const absPhase = Math.abs(phase - 0.5) * 2; // Phase entre 0 et 1
  const innerDiameter = size * (1 - absPhase); // Diamètre du disque intérieur
  const innerOffset = isWaxing ? size * absPhase / 2 : -size * absPhase / 2;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: lightColor,
        },
      ]}
    >
      {/* Ombre (disque intérieur) */}
      <View
        style={[
          styles.shadow,
          {
            width: innerDiameter,
            height: innerDiameter,
            borderRadius: innerDiameter / 2,
            backgroundColor: shadowColor,
            opacity: 1 - earthshine,
            left: innerOffset,
            top: (size - innerDiameter) / 2,
            shadowColor: shadowColor,
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.5,
            shadowRadius: blur,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
    overflow: "hidden",
  },
  shadow: {
    position: "absolute",
  },
});

export default MoonPhase;