import { memo } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { app_colors } from "../../../../../helpers/variables";
import Badge from "../../../../../components/Badges/Badge/Badge";
import { GLOSSARY_CATEGORY_COLORS } from "../../../../../data/glossary/categories";
import type { ResolvedGlossaryEntry } from "../../../../../helpers/glossary/search";
import GlossaryIllustration from "../GlossaryIllustration/GlossaryIllustration";
import { glossaryEntryRowStyles as styles } from "./GlossaryEntryRow.styles";

interface GlossaryEntryRowProps {
  entry: ResolvedGlossaryEntry;
  expanded: boolean;
  // Reçoit l'id plutôt qu'un callback déjà lié (`() => onToggle(id)`) : l'appelant peut passer une
  // référence STABLE (useCallback) pour les ~90 lignes à la fois, condition nécessaire pour que
  // `memo` ci-dessous serve à quelque chose (une closure recréée à chaque rendu du parent casserait
  // la comparaison superficielle des props et forcerait un re-rendu de toutes les lignes à chaque
  // dépli/repli, même celles qui ne changent pas — c'est ce qui rendait l'ouverture lente).
  onToggle: (id: string) => void;
  onPressRelated: (id: string) => void;
}

/**
 * Ligne d'une entrée du glossaire — repliée (puce + terme + définition courte tronquée) ou dépliée
 * (+ illustration éventuelle, définition complète, pastilles "voir aussi"). Seul l'en-tête bascule
 * le dépli : le contenu déplié (texte sélectionnable, pastilles liées) reste tactile sans refermer
 * la carte. Enveloppé dans `memo` — voir le commentaire sur `onToggle` ci-dessus.
 */
const GlossaryEntryRow = memo(({ entry, expanded, onToggle, onPressRelated }: GlossaryEntryRowProps) => {
  const { t } = useTranslation("tools/astroGlossary");
  const Chevron = expanded ? ChevronUp : ChevronDown;

  return (
    <View style={[styles.card, expanded && styles.card.expanded]}>
      <TouchableOpacity activeOpacity={0.7} onPress={() => onToggle(entry.config.id)} style={styles.header}>
        <View style={[styles.header.dot, { backgroundColor: GLOSSARY_CATEGORY_COLORS[entry.config.category] }]} />
        <View style={styles.header.texts}>
          <Text style={styles.header.term}>{entry.term}</Text>
          {!expanded && (
            <Text numberOfLines={1} style={styles.header.shortDefinition}>{entry.shortDefinition}</Text>
          )}
        </View>
        <Chevron size={18} color={app_colors.primary.main} />
      </TouchableOpacity>

      {expanded && (
        <>
          {entry.config.illustration && (
            <View style={styles.illustrationBox}>
              <GlossaryIllustration illustration={entry.config.illustration} />
            </View>
          )}

          <Text style={styles.fullDefinition}>{entry.fullDefinition}</Text>

          {entry.config.cta && (
            <TouchableOpacity style={styles.cta} onPress={() => router.push(entry.config.cta!.route)}>
              <Text style={styles.cta.text}>{t(entry.config.cta.labelKey)}</Text>
            </TouchableOpacity>
          )}

          {entry.relatedTerms.length > 0 && (
            <View style={styles.related}>
              <Text style={styles.related.label}>{t("entryRow.related")}</Text>
              {entry.relatedTerms.map((related) => (
                <Badge
                  key={related.id}
                  text={related.term}
                  backgroundColor={app_colors.accent.light}
                  foregroundColor={app_colors.primary.main}
                  action={() => onPressRelated(related.id)}
                />
              ))}
            </View>
          )}
        </>
      )}
    </View>
  );
});

export default GlossaryEntryRow;
