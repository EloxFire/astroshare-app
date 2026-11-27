import { useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";
import { Search, X } from "lucide-react-native";
import { InputWithIcon } from "../../../components/inputs/InputWithIcon/InputWithIcon";
import SearchResultRow from "../../Search/components/SearchResultRow/SearchResultRow";
import { useObjectSearch } from "../../../hooks/useObjectSearch";
import { DARK_GLASS_ICON } from "../../../helpers/planetarium/utils/darkGlass";
import type { CatalogObjectSummary } from "../../../types/catalog/CatalogObject";
import { exploreSearchModalStyles as styles } from "./ExploreSearchModal.styles";

interface ExploreSearchModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectObject: (object: CatalogObjectSummary) => void;
}

/**
 * Modale de recherche (phase 6) : une vraie `<Modal>` RN (pas une feuille comme ObjectSelectionSheet)
 * — contrairement à la fiche de sélection, elle n'a pas besoin de laisser le planétarium visible/
 * tactile derrière (même raisonnement que FullscreenImageModal, dont elle reprend le
 * `GestureHandlerRootView` imbriqué : une `<Modal>` RN a sa propre hiérarchie native, gesture-handler
 * n'y voit rien sans ça).
 */
const ExploreSearchModal = ({ visible, onClose, onSelectObject }: ExploreSearchModalProps) => {
  const { t } = useTranslation("explore");
  const insets = useSafeAreaInsets();
  const { results, search } = useObjectSearch();
  const [query, setQuery] = useState("");

  const handleChangeText = (text: string) => {
    setQuery(text);
    search(text);
  };

  const handleSelect = (object: CatalogObjectSummary) => {
    onSelectObject(object);
    setQuery("");
    onClose();
  };

  const isSearching = query.trim().length > 0;

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={[styles.container, { paddingTop: insets.top + 12 }]}>
          <View style={styles.header}>
            <InputWithIcon
              icon={Search}
              action={() => {}}
              placeholder={t("search.placeholder")}
              value={query}
              onChangeText={handleChangeText}
              autoFocus
              fill
            />
            <TouchableOpacity style={styles.header.closeButton} onPress={onClose}>
              <X size={18} color={DARK_GLASS_ICON} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.results} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {isSearching &&
              (results.length === 0 ? (
                <Text style={styles.emptyText}>{t("search.empty")}</Text>
              ) : (
                results.map((object, index) => (
                  <SearchResultRow
                    key={object.id}
                    object={object}
                    withBorder={index < results.length - 1}
                    onPress={() => handleSelect(object)}
                  />
                ))
              ))}
          </ScrollView>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default ExploreSearchModal;
