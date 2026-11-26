import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { app_colors, withOpacity } from "../../../../helpers/variables";

// Taille/couleur approximatives (pas une échelle physique précise, juste de quoi faire "sentir" la
// progression logarithmique inversée de la magnitude) — du plus brillant (grand, doré) au plus
// faible (minuscule, presque invisible).
const STEPS: { magnitude: string; labelKey?: string; diameter: number; color: string }[] = [
  { magnitude: "-4", labelKey: "venus", diameter: 34, color: app_colors.sun.main },
  { magnitude: "0", labelKey: "vega", diameter: 24, color: app_colors.yellow.light },
  { magnitude: "2", labelKey: "polaris", diameter: 14, color: app_colors.white },
  { magnitude: "6", labelKey: "nakedEyeLimit", diameter: 6, color: withOpacity(app_colors.white, 0.7) },
  { magnitude: "10", diameter: 2, color: withOpacity(app_colors.white, 0.4) },
];

/**
 * Illustration de l'entrée "Magnitude" (glossaire) : rangée de points de taille décroissante,
 * du plus brillant au plus faible, avec la magnitude et un exemple d'astre sous chacun.
 */
const MagnitudeScaleIllustration = () => {
  const { t } = useTranslation("tools/astroGlossary");

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", gap: 10 }}>
      {STEPS.map((step) => (
        <View key={step.magnitude} style={{ alignItems: "center", gap: 8, flex: 1 }}>
          <View style={{ height: 40, justifyContent: "flex-end" }}>
            <View style={{ width: step.diameter, height: step.diameter, borderRadius: step.diameter / 2, backgroundColor: step.color }} />
          </View>
          <Text style={{ fontFamily: "DMMonoRegular", fontSize: 10.5, color: withOpacity(app_colors.white, 0.8), textAlign: "center" }}>
            {step.magnitude}{step.labelKey ? ` ${t(`illustrations.magnitudeScale.${step.labelKey}`)}` : ""}
          </Text>
        </View>
      ))}
    </View>
  );
};

export default MagnitudeScaleIllustration;
