import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { formatLocaleNumber } from "../../../helpers/format";
import { useFullMoonAngularDiameter } from "../../../hooks/useFullMoonAngularDiameter";
import { CalculationVisualizationProps } from "../../../types/calculations/Calculation";
import MoonPhase from "../../rendering/MoonPhase/MoonPhase";
import { moonFieldVisualizationStyles, CIRCLE_SIZE } from "./MoonFieldVisualization.styles";

// Visualisation du "Champ réel" de l'oculaire : champ réellement circulaire (le disque net que
// trace le diaphragme de champ de l'oculaire), comparé à la taille apparente de la pleine Lune —
// le repère le plus parlant pour situer un angle en degrés. Réutilise le rendu 3D MoonPhase (voir
// docs/agents-reference.md §5). Pour un champ rectangulaire (capteur photo), voir
// CameraFieldVisualization, qui partage le même calcul de taille de Lune via useFullMoonAngularDiameter.
const MoonFieldVisualization = ({ value: trueFieldDegrees }: CalculationVisualizationProps) => {
  const { t, i18n } = useTranslation("tools/astroCalculations");
  const { fullMoonDate, angularDiameter: moonAngularDiameter } = useFullMoonAngularDiameter();

  // Un champ nul ou négatif (saisie manuelle à 0) donnerait une taille de Lune infinie : rien à
  // montrer plutôt qu'un crash du rendu 3D.
  if (trueFieldDegrees <= 0) return null;

  const moonSizeInCircle = CIRCLE_SIZE * (moonAngularDiameter / trueFieldDegrees);
  const widthRatio = trueFieldDegrees / moonAngularDiameter;

  return (
    <View style={moonFieldVisualizationStyles.container}>
      <View style={moonFieldVisualizationStyles.container.circle}>
        <MoonPhase date={fullMoonDate} size={moonSizeInCircle} />
      </View>

      <Text style={moonFieldVisualizationStyles.container.caption}>
        {t("visualizations.moonField.scaleCaption")}
      </Text>

      <Text style={moonFieldVisualizationStyles.container.note}>
        {/* `times` et non `count` : i18next traite "count" comme un sélecteur de pluriel (_one/_other)
            et attend un nombre, pas une chaîne déjà formatée avec virgule décimale. */}
        {t("visualizations.moonField.moonWidthCount", { times: formatLocaleNumber(widthRatio, i18n.language, 1) })}
      </Text>
    </View>
  );
};

export default MoonFieldVisualization;
