import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Moon, Sun } from "lucide-react-native";
import { app_colors } from "../../../../../helpers/variables";
import { useAppUnits } from "../../../../../hooks/useAppUnits";
import type { BodyTransit } from "../../../../../helpers/satellites/transits";
import TransitDiagram from "../TransitDiagram/TransitDiagram";
import { transitCardStyles } from "./TransitCard.styles";

interface TransitCardProps {
  transit: BodyTransit;
  onPress: () => void;
}

// Icône Soleil/Lune sur la carte : utile surtout quand les deux corps sont recherchés ensemble
// ("les deux"), pour distinguer un transit de l'autre d'un coup d'œil dans la liste triée par date.
const BODY_ICONS = { sun: Sun, moon: Moon };

const TransitCard = ({ transit, onPress }: TransitCardProps) => {
  const { t } = useTranslation("tools/satelliteTransits");
  const { formatDate } = useAppUnits();
  const BodyIcon = BODY_ICONS[transit.body];

  return (
    <TouchableOpacity style={transitCardStyles.card} onPress={onPress}>
      <TransitDiagram transit={transit} size={64} />

      <View style={transitCardStyles.card.texts}>
        <View style={transitCardStyles.card.texts.dateRow}>
          <BodyIcon size={13} color={app_colors.primary.medium} />
          <Text style={transitCardStyles.card.texts.date}>{formatDate(transit.midDate).format("dddd DD MMMM YYYY · HH:mm:ss")}</Text>
        </View>
        <Text style={transitCardStyles.card.texts.subtitle}>
          {t("list.cardSubtitle", { altitude: transit.altitude.toFixed(0), duration: (transit.durationMs / 1000).toFixed(1) })}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default TransitCard;
