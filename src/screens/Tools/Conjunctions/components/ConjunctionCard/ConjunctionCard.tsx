import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { app_colors } from "../../../../../helpers/variables";
import { captitalizeFirstLetter, formatLocaleNumber } from "../../../../../helpers/format";
import { useAppUnits } from "../../../../../hooks/useAppUnits";
import { getCatalogObjectIcon } from "../../../../../helpers/catalog/categoryIcon";
import { getCatalogObjectTitle } from "../../../../../helpers/journal/sessions";
import type { Conjunction } from "../../../../../helpers/catalog/conjunctions";
import type { CatalogObjectDetail } from "../../../../../types/catalog/CatalogObject";
import { conjunctionCardStyles } from "./ConjunctionCard.styles";

interface ConjunctionCardProps {
  conjunction: Conjunction;
  objectA: CatalogObjectDetail;
  objectB: CatalogObjectDetail;
  onPress: () => void;
}

const ConjunctionCard = ({ conjunction, objectA, objectB, onPress }: ConjunctionCardProps) => {
  const { t, i18n } = useTranslation("tools/conjunctions");
  const { formatDate } = useAppUnits();

  const IconA = getCatalogObjectIcon(objectA.category);
  const IconB = getCatalogObjectIcon(objectB.category);

  return (
    <TouchableOpacity style={conjunctionCardStyles.card} onPress={onPress}>
      <View style={conjunctionCardStyles.card.icons}>
        <View style={conjunctionCardStyles.card.icons.badge}>
          <IconA size={18} color={app_colors.accent.main} />
        </View>
        <View style={[conjunctionCardStyles.card.icons.badge, conjunctionCardStyles.card.icons.badge.overlap]}>
          <IconB size={18} color={app_colors.accent.main} />
        </View>
      </View>

      <View style={conjunctionCardStyles.card.texts}>
        <Text style={conjunctionCardStyles.card.texts.title}>
          {getCatalogObjectTitle(objectA)} · {getCatalogObjectTitle(objectB)}
        </Text>
        <Text style={conjunctionCardStyles.card.texts.date}>{captitalizeFirstLetter(formatDate(conjunction.midDate).format("dddd DD MMMM YYYY · HH:mm"))}</Text>
        <Text style={conjunctionCardStyles.card.texts.subtitle}>
          {t("list.cardSubtitle", { separation: formatLocaleNumber(conjunction.separationArcmin / 60, i18n.language, 1), altitude: conjunction.altitude.toFixed(0) })}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ConjunctionCard;
