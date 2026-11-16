import { ReactNode } from "react";
import { Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { calculationResultCardStyles } from "./CalculationResultCard.styles";

interface CalculationResultCardProps {
  formattedValue: string;
  note?: string;
  // Visualisation du calcul (jauge, Lune à l'échelle...). Aucune par défaut : la plupart des
  // calculs n'en ont pas besoin, le résultat seul suffit (voir registre dans helpers/calculations).
  children?: ReactNode;
}

const CalculationResultCard = ({ formattedValue, note, children }: CalculationResultCardProps) => {
  const { t } = useTranslation("tools/astroCalculations");

  return (
    <View style={calculationResultCardStyles.card}>
      <Text style={calculationResultCardStyles.card.eyebrow}>{t("screen.result")}</Text>
      <Text style={calculationResultCardStyles.card.value}>{formattedValue}</Text>

      {children && (
        <>
          <View style={calculationResultCardStyles.card.separator} />
          {children}
        </>
      )}

      {note && !children && (
        <>
          <View style={calculationResultCardStyles.card.separator} />
          <Text style={calculationResultCardStyles.card.note}>{note}</Text>
        </>
      )}
    </View>
  );
};

export default CalculationResultCard;
