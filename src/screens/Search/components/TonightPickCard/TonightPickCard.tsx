import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { getCatalogObjectSubtitle } from "../../../../helpers/journal/sessions";
import { convertAzimuthToCardinalDirection } from "../../../../helpers/location/convert";
import type { TonightPick } from "../../../../helpers/catalog/tonightPicks";
import { tonightPickCardStyles } from "./TonightPickCard.styles";

interface TonightPickCardProps {
  pick: TonightPick;
  index: number;
  onPress: () => void;
}

const NEAR_ZENITH_THRESHOLD = 80; // degrés — au-delà, la direction cardinale n'est plus très parlante

/**
 * Carte "bien placé ce soir" (accueil de la recherche) : alterne fond sombre/ambre selon la
 * position dans la grille (purement décoratif, voir le commentaire dans les styles — pas une
 * couleur qui encoderait une donnée). Badge de position (zénith ou point cardinal + hauteur).
 */
const TonightPickCard = ({ pick, index, onPress }: TonightPickCardProps) => {
  const { t } = useTranslation("search");
  const variant = index % 2 === 0 ? "dark" : "amber";

  const positionLabel = pick.altitude >= NEAR_ZENITH_THRESHOLD
    ? t("tonight.nearZenith")
    : `${convertAzimuthToCardinalDirection(pick.azimuth)} · ${pick.altitude.toFixed(0)}°`;

  return (
    <TouchableOpacity
      style={[tonightPickCardStyles.card, tonightPickCardStyles.card[variant]]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={tonightPickCardStyles.card.badge}>
        <Text style={[tonightPickCardStyles.card.badge.text, tonightPickCardStyles.card.badge[variant === "dark" ? "textDark" : "textAmber"]]}>
          {positionLabel}
        </Text>
      </View>

      <Text style={[tonightPickCardStyles.card.name, tonightPickCardStyles.card.name[variant]]} numberOfLines={2}>
        {pick.object.name}
      </Text>

      <Text style={[tonightPickCardStyles.card.subtitle, tonightPickCardStyles.card.subtitle[variant]]} numberOfLines={1}>
        {getCatalogObjectSubtitle(pick.object, t)}
      </Text>
    </TouchableOpacity>
  );
};

export default TonightPickCard;
