import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { app_colors } from "../../../../helpers/variables";
import { formatLocaleNumber } from "../../../../helpers/format";
import { getCatalogObjectSubtitle, getCatalogObjectTitle } from "../../../../helpers/journal/sessions";
import { getCatalogObjectIcon } from "../../../../helpers/catalog/categoryIcon";
import type { CatalogObjectSummary } from "../../../../types/catalog/CatalogObject";
import { searchResultRowStyles } from "./SearchResultRow.styles";

interface SearchResultRowProps {
  object: CatalogObjectSummary;
  onPress: () => void;
  withBorder?: boolean;
}

/**
 * Ligne d'un résultat de recherche : pictogramme de catégorie (getCatalogObjectIcon, aucune
 * couleur par catégorie — un seul traitement accent, comme le reste de l'app qui ne colore que ce
 * qui porte un sens réel, ex. Bortle/NOAA), titre/sous-titre (helpers déjà utilisés par le
 * Journal) et magnitude à droite si connue.
 */
const SearchResultRow = ({ object, onPress, withBorder = false }: SearchResultRowProps) => {
  const { t, i18n } = useTranslation("search");
  const Icon = getCatalogObjectIcon(object.category);

  return (
    <TouchableOpacity style={[searchResultRowStyles.row, withBorder && searchResultRowStyles.row.withBorder]} onPress={onPress}>
      <View style={searchResultRowStyles.row.pictogram}>
        <Icon size={18} color={app_colors.accent.main} />
      </View>

      <View style={searchResultRowStyles.row.texts}>
        <Text style={searchResultRowStyles.row.texts.title} numberOfLines={1}>{getCatalogObjectTitle(object)}</Text>
        <Text style={searchResultRowStyles.row.texts.subtitle} numberOfLines={1}>{getCatalogObjectSubtitle(object, t)}</Text>
      </View>

      {
        object.magnitude != null && (
          <View style={searchResultRowStyles.row.magnitude}>
            <Text style={searchResultRowStyles.row.magnitude.value}>{formatLocaleNumber(object.magnitude, i18n.language, 1)}</Text>
            <Text style={searchResultRowStyles.row.magnitude.caption}>{t("results.magnitude")}</Text>
          </View>
        )
      }
    </TouchableOpacity>
  );
};

export default SearchResultRow;
