import { useState } from "react";
import { Text, View } from "react-native";
import { Search } from "lucide-react-native";
import { getObjectById } from "../../../../../helpers/api/catalog/objects";
import { getCatalogObjectIcon } from "../../../../../helpers/catalog/categoryIcon";
import { getCatalogObjectTitle } from "../../../../../helpers/journal/sessions";
import { useObjectSearch } from "../../../../../hooks/useObjectSearch";
import { InputWithIcon } from "../../../../../components/inputs/InputWithIcon/InputWithIcon";
import IconButtonCard from "../../../../../components/cards/IconButtonCard/IconButtonCard";
import type { CatalogObjectDetail } from "../../../../../types/catalog/CatalogObject";
import { objectPickerStyles } from "./ObjectPicker.styles";

interface ObjectPickerProps {
  label: string;
  placeholder: string;
  changeLabel: string;
  selected: CatalogObjectDetail | null;
  onSelect: (object: CatalogObjectDetail) => void;
  onClear: () => void;
}

/**
 * Sélection d'un objet quelconque du catalogue (planète, Lune, Soleil, étoile, DSO) : une recherche
 * normale (/v3/objects/search, `useObjectSearch` — déjà utilisée pour la recherche d'objets
 * observés dans AddSession) suffit, le Soleil/la Lune/les planètes y apparaissent déjà mélangés aux
 * étoiles/DSO qui matchent aussi (vérifié en direct : q=mars → SS-MARS). Une fois un résultat
 * choisi, sa fiche complète est récupérée (`getObjectById`) pour disposer de son éphéméride
 * (`solar_system.ephemeris`) ou de sa position fixe — le format liste de la recherche n'a ni l'un
 * ni l'autre.
 */
const ObjectPicker = ({ label, placeholder, changeLabel, selected, onSelect, onClear }: ObjectPickerProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { results, search } = useObjectSearch();

  const handleQueryChange = (text: string) => {
    setSearchQuery(text);
    search(text);
  };

  const handleSuggestionPress = async (suggestion: string) => {
    const summary = results[results.map((result) => result.name).indexOf(suggestion)];
    if (!summary) return;

    const detail = await getObjectById(summary.id);
    if (detail) {
      onSelect(detail);
      setSearchQuery("");
    }
  };

  return (
    <View style={objectPickerStyles.container}>
      <Text style={objectPickerStyles.label}>{label}</Text>

      {selected ? (
        <IconButtonCard
          icon={getCatalogObjectIcon(selected.category)}
          title={getCatalogObjectTitle(selected)}
          subtitle={changeLabel}
          selected
          onPress={onClear}
        />
      ) : (
        <InputWithIcon
          fill
          placeholder={placeholder}
          value={searchQuery}
          onChangeText={handleQueryChange}
          suggestions={results.map((result) => result.name)}
          onSuggestionPress={handleSuggestionPress}
          action={() => {}}
          icon={Search}
        />
      )}
    </View>
  );
};

export default ObjectPicker;
