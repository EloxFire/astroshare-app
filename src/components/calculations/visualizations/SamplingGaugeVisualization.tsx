import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { CalculationVisualizationProps } from "../../../types/calculations/Calculation";
import RangeBandGauge from "../RangeBandGauge/RangeBandGauge";
import { gaugeVisualizationStyles } from "./visualizations.styles";

// Seuils usuels d'échantillonnage en astrophoto (secondes d'arc par pixel) : en dessous de 1″/px,
// l'image est suréchantillonnée (demande un ciel très stable pour en profiter) ; au-dessus de
// 2″/px, elle est sous-échantillonnée (grand champ, moins de détail par objet). Entre les deux,
// compromis adapté à la majorité des cibles du ciel profond. Ce sont des repères indicatifs, pas
// une mesure de la turbulence réelle du moment (non disponible ici).
const FINE_SAMPLING_THRESHOLD = 1;
const WIDE_SAMPLING_THRESHOLD = 2;
const SCALE_MAX = 3;

const SamplingGaugeVisualization = ({ value, values, onValuesChange }: CalculationVisualizationProps) => {
  const { t } = useTranslation("tools/astroCalculations");

  const band = value < FINE_SAMPLING_THRESHOLD ? "fine" : value > WIDE_SAMPLING_THRESHOLD ? "wide" : "ideal";

  // Échantillonnage ciblé → facteur de barlow/réductrice nécessaire avec le reste du setup
  // inchangé (E = 206×p ÷ (F×k), donc k = 206×p ÷ (F×E)) : répond à "quel accessoire me faut-il ?"
  // plutôt que "quel télescope".
  const handleChange = (targetSampling: number) => {
    if (!values.instrumentFocalLength || values.pixelSize == null || targetSampling <= 0) return;
    const barlowFactor = (206 * values.pixelSize) / (values.instrumentFocalLength * targetSampling);
    onValuesChange?.({ barlowFactor: Math.round(barlowFactor * 100) / 100 });
  };

  return (
    <View style={gaugeVisualizationStyles.container}>
      <RangeBandGauge
        value={value}
        scaleMin={0}
        scaleMax={SCALE_MAX}
        idealRangeStart={FINE_SAMPLING_THRESHOLD}
        idealRangeEnd={WIDE_SAMPLING_THRESHOLD}
        labels={[
          t("calculations.sampling.bands.fine.label"),
          t("calculations.sampling.bands.ideal.label"),
          t("calculations.sampling.bands.wide.label"),
        ]}
        onChange={onValuesChange ? handleChange : undefined}
      />

      <Text style={gaugeVisualizationStyles.container.note}>
        {t(`calculations.sampling.bands.${band}.note`)}
      </Text>
    </View>
  );
};

export default SamplingGaugeVisualization;
