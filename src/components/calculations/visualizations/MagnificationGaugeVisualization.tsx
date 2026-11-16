import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { CalculationVisualizationProps } from "../../../types/calculations/Calculation";
import { getUsefulMagnificationRange } from "../../../helpers/gear/telescopes";
import { formatLocaleNumber } from "../../../helpers/format";
import RangeBandGauge from "../RangeBandGauge/RangeBandGauge";
import { gaugeVisualizationStyles } from "./visualizations.styles";

// Visualisation du calcul "Grossissement" : situe le grossissement obtenu dans la plage utile de
// l'instrument (getUsefulMagnificationRange, déjà utilisée ailleurs dans l'app — voir
// helpers/gear/telescopes.ts). A besoin de `values.aperture`, donc ce calcul demande le diamètre
// même si `compute()` n'en a pas besoin lui-même (F ÷ f suffit au résultat).
const MagnificationGaugeVisualization = ({ value, values, onValuesChange }: CalculationVisualizationProps) => {
  const { t, i18n } = useTranslation("tools/astroCalculations");

  if (values.aperture == null) return null;

  const { min, max } = getUsefulMagnificationRange(values.aperture);
  const band = value < min ? "low" : value > max ? "high" : "ideal";

  // Grossissement ciblé → focale d'oculaire nécessaire (G = F ÷ f, donc f = F ÷ G) : c'est
  // l'oculaire qu'on change en pratique pour viser un grossissement, pas le télescope.
  const handleChange = (targetMagnification: number) => {
    if (!values.instrumentFocalLength || targetMagnification <= 0) return;
    const eyepieceFocalLength = values.instrumentFocalLength / targetMagnification;
    onValuesChange?.({ eyepieceFocalLength: Math.round(eyepieceFocalLength * 100) / 100 });
  };

  return (
    <View style={gaugeVisualizationStyles.container}>
      <Text style={gaugeVisualizationStyles.container.rangeLabel}>
        {t("calculations.magnification.usefulRange", {
          min: formatLocaleNumber(min, i18n.language, 0),
          max: formatLocaleNumber(max, i18n.language, 0),
        })}
      </Text>

      <RangeBandGauge
        value={value}
        scaleMin={0}
        scaleMax={max * 1.5}
        idealRangeStart={min}
        idealRangeEnd={max}
        labels={[
          t("calculations.magnification.bands.low.label"),
          t("calculations.magnification.bands.ideal.label"),
          t("calculations.magnification.bands.high.label"),
        ]}
        onChange={onValuesChange ? handleChange : undefined}
      />

      <Text style={gaugeVisualizationStyles.container.note}>
        {t(`calculations.magnification.bands.${band}.note`)}
      </Text>
    </View>
  );
};

export default MagnificationGaugeVisualization;
