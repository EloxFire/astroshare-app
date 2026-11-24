import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useAppUnits } from "../../../../../hooks/useAppUnits";
import type { SolarTransit } from "../../../../../helpers/satellites/solarTransits";
import TransitDiagram from "../TransitDiagram/TransitDiagram";
import { transitCardStyles } from "./TransitCard.styles";

interface TransitCardProps {
  transit: SolarTransit;
  onPress: () => void;
}

const TransitCard = ({ transit, onPress }: TransitCardProps) => {
  const { t } = useTranslation("tools/issTransits");
  const { formatDate } = useAppUnits();

  return (
    <TouchableOpacity style={transitCardStyles.card} onPress={onPress}>
      <TransitDiagram transit={transit} size={64} />

      <View style={transitCardStyles.card.texts}>
        <Text style={transitCardStyles.card.texts.date}>{formatDate(transit.midDate).format("dddd DD MMMM YYYY · HH:mm:ss")}</Text>
        <Text style={transitCardStyles.card.texts.subtitle}>
          {t("list.cardSubtitle", { altitude: transit.altitude.toFixed(0), duration: (transit.durationMs / 1000).toFixed(1) })}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TransitCard;
