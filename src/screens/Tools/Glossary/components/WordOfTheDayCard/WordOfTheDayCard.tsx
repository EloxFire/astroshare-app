import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import type { ResolvedGlossaryEntry } from "../../../../../helpers/glossary/search";
import GlossaryIllustration from "../GlossaryIllustration/GlossaryIllustration";
import { wordOfTheDayCardStyles as styles } from "./WordOfTheDayCard.styles";

interface WordOfTheDayCardProps {
  entry: ResolvedGlossaryEntry;
}

/**
 * Carte héro "le mot du jour" — voir src/helpers/glossary/wordOfDay.ts pour le choix du terme
 * (déterministe, pas aléatoire). Illustration et bouton d'action sont facultatifs et dépendent de la
 * config de l'entrée tirée ce jour-là (voir entries.ts) : une entrée sans illustration/cta affiche
 * juste le texte.
 */
const WordOfTheDayCard = ({ entry }: WordOfTheDayCardProps) => {
  const { t } = useTranslation("tools/astroGlossary");

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.texts}>
          <Text style={styles.eyebrow}>{t("wordOfTheDay.eyebrow")}</Text>
          <Text style={styles.term}>{entry.term}</Text>
          <Text style={styles.definition}>{entry.fullDefinition}</Text>
        </View>

        {entry.config.illustration && (
          <View style={styles.illustration}>
            <GlossaryIllustration illustration={entry.config.illustration} />
          </View>
        )}
      </View>

      {entry.config.cta && (
        <TouchableOpacity style={styles.cta} onPress={() => router.push(entry.config.cta!.route)}>
          <Text style={styles.cta.text}>{t(entry.config.cta.labelKey)}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default WordOfTheDayCard;
