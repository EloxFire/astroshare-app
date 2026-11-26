import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { GLOSSARY_CATEGORY_COLORS } from "../../../../../data/glossary/categories";
import type { GlossaryCategoryId } from "../../../../../types/glossary/GlossaryEntry";
import { glossaryCategoryPillsStyles as styles } from "./GlossaryCategoryPills.styles";

interface GlossaryCategoryPillsProps {
  categories: GlossaryCategoryId[];
  selected: GlossaryCategoryId | null;
  onSelect: (category: GlossaryCategoryId | null) => void;
}

// "Tous" (null) + une pilule par catégorie réellement présente dans GLOSSARY_ENTRIES (pas la liste
// complète des catégories possibles — une catégorie sans aucune entrée n'a pas sa pilule).
const GlossaryCategoryPills = ({ categories, selected, onSelect }: GlossaryCategoryPillsProps) => {
  const { t } = useTranslation("tools/astroGlossary");

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.list}>
        <TouchableOpacity
          style={[styles.pill, selected === null && styles.pill.active]}
          onPress={() => onSelect(null)}
        >
          <Text style={[styles.pill.text, selected === null && styles.pill.text.active]}>{t("categories.all")}</Text>
        </TouchableOpacity>

        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[styles.pill, selected === category && styles.pill.active]}
            onPress={() => onSelect(category)}
          >
            <View style={[styles.pill.dot, { backgroundColor: GLOSSARY_CATEGORY_COLORS[category] }]} />
            <Text style={[styles.pill.text, selected === category && styles.pill.text.active]}>
              {t(`categories.${category}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

export default GlossaryCategoryPills;
