import { useCallback, useMemo, useRef, useState } from "react";
import { Animated, LayoutChangeEvent, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react-native";
import { app_colors } from "../../../helpers/variables";
import { InputWithIcon } from "../../../components/inputs/InputWithIcon/InputWithIcon";
import { useDebounce } from "../../../hooks/useDebounce";
import { GLOSSARY_ENTRIES } from "../../../data/glossary/entries";
import { GLOSSARY_CATEGORY_ORDER } from "../../../data/glossary/categories";
import { getWordOfTheDay } from "../../../helpers/glossary/wordOfDay";
import { filterGlossaryEntries, groupEntriesByLetter, normalizeForSearch, type ResolvedGlossaryEntry } from "../../../helpers/glossary/search";
import type { GlossaryCategoryId } from "../../../types/glossary/GlossaryEntry";
import WordOfTheDayCard from "./components/WordOfTheDayCard/WordOfTheDayCard";
import GlossaryCategoryPills from "./components/GlossaryCategoryPills/GlossaryCategoryPills";
import GlossaryEntryRow from "./components/GlossaryEntryRow/GlossaryEntryRow";
import GlossaryAlphabetIndex from "./components/GlossaryAlphabetIndex/GlossaryAlphabetIndex";
import { glossaryScreenStyles as styles } from "./GlossaryScreen.styles";
import { ScreenHeader } from "../../../components/layout/ScreenHeader/ScreenHeader";

const GlossaryScreen = () => {
  const { t } = useTranslation("tools/astroGlossary");
  const scrollRef = useRef<ScrollView>(null);
  // Position Y (relative au contenu de la ScrollView) de chaque groupe de lettres déjà posé à
  // l'écran — alimenté par `onLayout`, lu seulement au moment de sauter à une lettre (pas de
  // re-render à chaque mise à jour, une ref suffit).
  const letterOffsets = useRef<Record<string, number>>({});
  // Position Y de `entriesColumn` relative au contenu de la ScrollView — SEULE source de vérité
  // pour (1) corriger les offsets de lettres ci-dessus avant un `scrollTo` et (2) savoir jusqu'où
  // l'index A-Z doit descendre avant de "coller" en haut (stickyIndexTranslateY) : un seul chiffre
  // mesuré, pas deux (un pour le bloc d'en-tête + un pour la colonne), qui pouvaient dériver l'un
  // de l'autre et désynchroniser l'index des pilules de catégorie (retour utilisateur : "ça rentre
  // en conflit avec les catégories").
  const [entriesColumnOffsetY, setEntriesColumnOffsetY] = useState(0);
  const scrollY = useRef(new Animated.Value(0)).current;
  const stickyIndexTranslateY = scrollY.interpolate({
    inputRange: [0, Math.max(entriesColumnOffsetY, 1)],
    outputRange: [entriesColumnOffsetY, 0],
    extrapolate: "clamp",
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const debounceSearch = useDebounce((query: string) => setDebouncedSearchQuery(query), 250);
  const [selectedCategory, setSelectedCategory] = useState<GlossaryCategoryId | null>(null);
  // Une seule carte dépliée à la fois (demande explicite) : `null` = tout replié.
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [currentLetter, setCurrentLetter] = useState<string | null>(null);

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    debounceSearch(query);
  };

  // Chaque entrée n'est traduite qu'ici, au rendu (jamais au chargement d'un module — voir
  // CLAUDE.md) : GLOSSARY_ENTRIES ne porte que la config, le texte vient des 3 fichiers i18n.
  const baseEntries = useMemo(
    () => GLOSSARY_ENTRIES.map((config) => ({
      config,
      term: t(`entries.${config.id}.term`),
      shortDefinition: t(`entries.${config.id}.short`),
      fullDefinition: t(`entries.${config.id}.full`),
    })),
    [t]
  );
  const termById = useMemo(() => new Map(baseEntries.map((entry) => [entry.config.id, entry.term])), [baseEntries]);

  // `relatedTerms` résolu UNE SEULE FOIS ici (pas à chaque rendu de chaque ligne, comme avant) :
  // avec ~90 entrées, refaire ce map/filter pour les 90 lignes à chaque rendu de l'écran (ex: à
  // chaque frappe dans la recherche) était la cause principale de la lenteur à l'ouverture d'une
  // carte — voir aussi le commentaire sur `memo` dans GlossaryEntryRow.tsx : un nouveau tableau à
  // chaque rendu, même à contenu identique, casse sa comparaison superficielle des props.
  const resolvedEntries: ResolvedGlossaryEntry[] = useMemo(
    () => baseEntries.map((entry) => ({
      ...entry,
      relatedTerms: (entry.config.relatedIds ?? [])
        .map((id) => {
          const term = termById.get(id);
          return term ? { id, term } : null;
        })
        .filter((related): related is { id: string; term: string } => !!related),
    })),
    [baseEntries, termById]
  );

  const entryById = useMemo(() => new Map(resolvedEntries.map((entry) => [entry.config.id, entry])), [resolvedEntries]);
  const wordOfTheDay = useMemo(() => getWordOfTheDay(resolvedEntries), [resolvedEntries]);
  const availableCategories = useMemo(
    () => GLOSSARY_CATEGORY_ORDER.filter((category) => GLOSSARY_ENTRIES.some((entry) => entry.category === category)),
    []
  );

  const filteredEntries = useMemo(
    () => filterGlossaryEntries(resolvedEntries, selectedCategory, debouncedSearchQuery),
    [resolvedEntries, selectedCategory, debouncedSearchQuery]
  );
  const letterGroups = useMemo(() => groupEntriesByLetter(filteredEntries), [filteredEntries]);
  const availableLetters = useMemo(() => new Set(letterGroups.map((group) => group.letter)), [letterGroups]);

  // Référence STABLE (jamais recréée) : passée telle quelle à chaque GlossaryEntryRow, condition
  // nécessaire pour que `memo` les épargne d'un re-rendu quand une AUTRE carte se (dé)plie — voir
  // le commentaire dans GlossaryEntryRow.tsx.
  const toggleExpanded = useCallback((id: string) => {
    setExpandedId((previous) => (previous === id ? null : id));
  }, []);

  const scrollToLetter = useCallback((letter: string) => {
    const y = letterOffsets.current[letter];
    if (y != null) scrollRef.current?.scrollTo({ y: entriesColumnOffsetY + y - 10, animated: true });
  }, [entriesColumnOffsetY]);

  // Un terme lié peut être masqué par le filtre courant (catégorie et/ou recherche) : on les lève
  // pour garantir que la cible existe bien dans la liste rendue avant de sauter dessus.
  const jumpToEntry = useCallback((id: string) => {
    setSelectedCategory(null);
    setSearchQuery("");
    setDebouncedSearchQuery("");
    setExpandedId(id);
    const targetEntry = entryById.get(id);
    if (!targetEntry) return;
    const letter = normalizeForSearch(targetEntry.term).charAt(0).toUpperCase();
    // Les groupes se re-rendent après la levée des filtres ci-dessus : laisse un instant à la mise
    // en page de se faire avant de lire les nouveaux offsets mesurés par `onLayout`.
    setTimeout(() => scrollToLetter(letter), 80);
  }, [entryById, scrollToLetter]);

  // Lettre de la section actuellement en haut de la liste visible — alimente le surlignage jaune
  // de l'index A-Z. Calculé dans le listener JS d'Animated.event (reçoit quand même les mises à
  // jour sur une valeur pilotée nativement), pas dans un `onScroll` séparé non piloté nativement.
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    {
      useNativeDriver: true,
      listener: (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const relativeY = event.nativeEvent.contentOffset.y - entriesColumnOffsetY + 32;
        let active: string | null = null;
        for (const group of letterGroups) {
          const y = letterOffsets.current[group.letter];
          if (y == null) continue;
          if (y <= relativeY) active = group.letter;
          else break;
        }
        setCurrentLetter(active);
      },
    }
  );

  const handleLetterGroupLayout = (letter: string) => (event: LayoutChangeEvent) => {
    letterOffsets.current[letter] = event.nativeEvent.layout.y;
  };

  return (
    <View style={styles.screen}>
      <ScreenHeader title={t("screen.title")} main={false} subtitle={t("screen.termCount", { count: GLOSSARY_ENTRIES.length })} />

      {/* Repère de positionnement de l'overlay sticky ci-dessous (styles.scrollArea) : commence
          pile où la ScrollView commence, sans avoir à connaître la hauteur du ScreenHeader. */}
      <View style={styles.scrollArea}>
        <Animated.ScrollView
          ref={scrollRef}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          <View style={styles.headerBlock}>
            <InputWithIcon
              icon={Search}
              placeholder={t("screen.searchPlaceholder")}
              value={searchQuery}
              onChangeText={handleSearchChange}
              action={() => {}}
            />

            <WordOfTheDayCard entry={wordOfTheDay} />

            <GlossaryCategoryPills categories={availableCategories} selected={selectedCategory} onSelect={setSelectedCategory} />
          </View>

          <View
            style={styles.entriesColumn}
            onLayout={(event) => setEntriesColumnOffsetY(event.nativeEvent.layout.y)}
          >
            {letterGroups.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyState.text}>{t("screen.empty")}</Text>
              </View>
            ) : (
              letterGroups.map((group) => (
                <View key={group.letter} style={styles.letterGroup} onLayout={handleLetterGroupLayout(group.letter)}>
                  <View style={styles.letterHeader}>
                    <Text style={styles.letterHeader.letter}>{group.letter}</Text>
                    <View style={styles.letterHeader.rule} />
                  </View>

                  <View style={styles.entriesList}>
                    {group.entries.map((entry) => (
                      <GlossaryEntryRow
                        key={entry.config.id}
                        entry={entry}
                        expanded={expandedId === entry.config.id}
                        onToggle={toggleExpanded}
                        onPressRelated={jumpToEntry}
                      />
                    ))}
                  </View>
                </View>
              ))
            )}
          </View>
        </Animated.ScrollView>

        {/* N'affiche l'index qu'une fois `entriesColumnOffsetY` mesuré : sinon, le temps du tout
            premier rendu (valeur encore à 0), il flasherait collé en haut, par-dessus l'en-tête. */}
        {entriesColumnOffsetY > 0 && (
          <Animated.View
            style={[styles.stickyIndexWrap, { transform: [{ translateY: stickyIndexTranslateY }] }]}
            pointerEvents="box-none"
          >
            <GlossaryAlphabetIndex availableLetters={availableLetters} currentLetter={currentLetter} onPressLetter={scrollToLetter} />
          </Animated.View>
        )}
      </View>
    </View>
  );
};

export default GlossaryScreen;
