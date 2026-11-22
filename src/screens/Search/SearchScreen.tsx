import { useCallback, useState } from "react";
import { InteractionManager, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { router, useFocusEffect } from "expo-router";
import { Search } from "lucide-react-native";
import { searchScreenStyles } from "./SearchScreen.styles";
import { globalStyles } from "../../helpers/globalStyles";
import { ScreenHeader } from "../../components/layout/ScreenHeader/ScreenHeader";
import { InputWithIcon } from "../../components/inputs/InputWithIcon/InputWithIcon";
import SectionHeader from "../../components/layout/SectionHeader/SectionHeader";
import { useLocation } from "../../context/LocationContext";
import { useUserDataStore } from "../../store/userData.store";
import { useObjectSearch } from "../../hooks/useObjectSearch";
import { getTonightPicks, type TonightPick } from "../../helpers/catalog/tonightPicks";
import TryChipsRow from "./components/TryChipsRow/TryChipsRow";
import TonightPickCard from "./components/TonightPickCard/TonightPickCard";
import RecentSearchRow from "./components/RecentSearchRow/RecentSearchRow";
import SearchResultRow from "./components/SearchResultRow/SearchResultRow";
import MoonSearchCard from "./components/MoonSearchCard/MoonSearchCard";

const TRY_SUGGESTIONS = ["M4", "Lune", "Andromède", "Bételgeuse", "Jupiter", "Pléiades"];

export const SearchScreen = () => {
  const { t } = useTranslation("search");
  const { location } = useLocation();

  const recentSearches = useUserDataStore((state) => state.recentSearches);
  const addRecentSearch = useUserDataStore((state) => state.addRecentSearch);

  const [searchQuery, setSearchQuery] = useState("");
  const { results, search } = useObjectSearch();

  const [tonightPicks, setTonightPicks] = useState<TonightPick[] | null>(null);

  // Recalculé à chaque focus de l'écran (pas seulement au montage) : l'onglet Recherche reste
  // monté en arrière-plan le temps de la session, la visibilité "ce soir" doit rester à jour si
  // l'utilisateur y revient bien plus tard. Différé (InteractionManager) comme les autres calculs
  // astro lourds de l'app (SunSummaryCard, TonightView, UsefulNightCard).
  useFocusEffect(
    useCallback(() => {
      if (!location) return;
      let cancelled = false;

      const task = InteractionManager.runAfterInteractions(async () => {
        const picks = await getTonightPicks({
          latitude: location.latitude,
          longitude: location.longitude,
          elevation: location.elevation ?? 0,
        });
        if (!cancelled) setTonightPicks(picks);
      });

      return () => {
        cancelled = true;
        task.cancel();
      };
    }, [location])
  );

  const handleSearchQueryChange = (text: string) => {
    setSearchQuery(text);
    search(text);
  };

  const handleRunSearch = (query: string) => {
    setSearchQuery(query);
    search(query);
  };

  const handleResultPress = (objectId: string) => {
    addRecentSearch(searchQuery);
    router.push(`/objects/${objectId}`);
  };

  const isSearching = searchQuery.trim().length > 0;
  const moonResult = results.find((result) => result.id === "SS-MOON");
  const otherResults = results.filter((result) => result.id !== "SS-MOON");

  return (
    <View style={searchScreenStyles.screen}>
      <ScreenHeader title={t("screen.title")} main={false} />

      {/* keyboardShouldPersistTaps="handled" : sinon, clavier ouvert, le premier appui sur un
          résultat ne fait que le fermer au lieu de naviguer (même piège que dans FieldSimulator). */}
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={globalStyles.content}>
          <InputWithIcon
            icon={Search}
            action={() => {}}
            placeholder={t("search.placeholder")}
            value={searchQuery}
            onChangeText={handleSearchQueryChange}
          />

          {
            isSearching ? (
              <>
                {moonResult && <MoonSearchCard object={moonResult} />}

                {
                  otherResults.length === 0 && !moonResult ? (
                    <Text style={searchScreenStyles.emptyResults}>{t("results.empty")}</Text>
                  ) : (
                    otherResults.map((object, index) => (
                      <SearchResultRow
                        key={object.id}
                        object={object}
                        withBorder={index < otherResults.length - 1}
                        onPress={() => handleResultPress(object.id)}
                      />
                    ))
                  )
                }
              </>
            ) : (
              <>
                <TryChipsRow chips={TRY_SUGGESTIONS} onPress={handleRunSearch} />

                {
                  tonightPicks && tonightPicks.length > 0 && (
                    <View>
                      <SectionHeader title={t("tonight.title")} />
                      <View style={searchScreenStyles.tonightGrid}>
                        {
                          tonightPicks.map((pick, index) => (
                            <TonightPickCard
                              key={pick.object.id}
                              pick={pick}
                              index={index}
                              onPress={() => router.push(`/objects/${pick.object.id}`)}
                            />
                          ))
                        }
                      </View>
                    </View>
                  )
                }

                {
                  recentSearches.length > 0 && (
                    <View>
                      <SectionHeader title={t("recent.title")} />
                      {
                        recentSearches.map((query, index) => (
                          <RecentSearchRow key={`${query}-${index}`} query={query} onPress={() => handleRunSearch(query)} />
                        ))
                      }
                    </View>
                  )
                }
              </>
            )
          }
        </View>
      </ScrollView>
    </View>
  );
};
