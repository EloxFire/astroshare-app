import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { formatLocaleNumber } from "../../../helpers/format";
import { useFullMoonAngularDiameter } from "../../../hooks/useFullMoonAngularDiameter";
import { CalculationVisualizationProps } from "../../../types/calculations/Calculation";
import MoonPhase from "../../rendering/MoonPhase/MoonPhase";
import { cameraFieldVisualizationStyles, FRAME_WIDTH, MIN_FRAME_HEIGHT, MAX_FRAME_HEIGHT } from "./CameraFieldVisualization.styles";

// Visualisation du "Champ caméra" : contrairement au champ (circulaire) d'un oculaire, le champ
// d'un capteur est rectangulaire — le cadre reprend donc le rapport largeur/hauteur réel du
// capteur plutôt qu'un cercle. Même comparaison à la pleine Lune que MoonFieldVisualization (même
// hook useFullMoonAngularDiameter), à l'échelle de la largeur du cadre.
const CameraFieldVisualization = ({ value: widthFieldDegrees, values }: CalculationVisualizationProps) => {
  const { t, i18n } = useTranslation("tools/astroCalculations");
  const { fullMoonDate, angularDiameter: moonAngularDiameter } = useFullMoonAngularDiameter();

  // Un champ nul ou négatif (saisie manuelle à 0) donnerait une taille de Lune infinie : rien à
  // montrer plutôt qu'un crash du rendu 3D.
  if (widthFieldDegrees <= 0) return null;

  // La hauteur du capteur est facultative dans ce calcul (compute() n'a besoin que de la largeur) :
  // si elle manque, cadre carré par défaut plutôt que d'inventer une hauteur.
  const heightFieldDegrees =
    values.sensorHeight != null && values.instrumentFocalLength
      ? 2 * Math.atan(values.sensorHeight / (2 * values.instrumentFocalLength)) * (180 / Math.PI)
      : null;

  const aspectRatio = heightFieldDegrees != null ? heightFieldDegrees / widthFieldDegrees : 1;
  const frameHeight = Math.min(Math.max(FRAME_WIDTH * aspectRatio, MIN_FRAME_HEIGHT), MAX_FRAME_HEIGHT);

  const moonSize = FRAME_WIDTH * (moonAngularDiameter / widthFieldDegrees);
  const widthRatio = widthFieldDegrees / moonAngularDiameter;

  return (
    <View style={cameraFieldVisualizationStyles.container}>
      <View style={[cameraFieldVisualizationStyles.container.frame, { height: frameHeight }]}>
        <MoonPhase date={fullMoonDate} size={moonSize} />
      </View>

      <Text style={cameraFieldVisualizationStyles.container.caption}>
        {heightFieldDegrees != null
          ? t("visualizations.cameraField.fieldCaption", {
              width: formatLocaleNumber(widthFieldDegrees, i18n.language, 2),
              height: formatLocaleNumber(heightFieldDegrees, i18n.language, 2),
            })
          : t("visualizations.cameraField.widthOnlyCaption", { width: formatLocaleNumber(widthFieldDegrees, i18n.language, 2) })}
      </Text>

      <Text style={cameraFieldVisualizationStyles.container.note}>
        {t("visualizations.moonField.moonWidthCount", { times: formatLocaleNumber(widthRatio, i18n.language, 1) })}
      </Text>
    </View>
  );
};

export default CameraFieldVisualization;
