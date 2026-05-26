import React, {useEffect, useRef, useState} from "react";
import {ActivityIndicator, FlatList, Keyboard, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {planetariumSearchModalStyles} from "../../styles/components/skymap/planetariumSearchModal";
import {app_colors} from "../../helpers/constants";
import {universalObjectSearch} from "../../helpers/scripts/universalObjectSearch";
import {useSolarSystem} from "../../contexts/SolarSystemContext";
import {DSO} from "../../helpers/types/DSO";
import {GlobalPlanet} from "../../helpers/types/GlobalPlanet";
import {Star} from "../../helpers/types/Star";
import CelestialBodyCardLite from "../cards/CelestialBodyCardLite";
import InputWithIcon from "../forms/InputWithIcon";
import ScreenInfo from "../ScreenInfo";
import SimpleButton from "../commons/buttons/SimpleButton";
import {useStarCatalog} from "../../contexts/StarsContext";
import {useDsoCatalog} from "../../contexts/DSOContext";
import { useSettings } from "../../contexts/AppSettingsContext";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "../../hooks/useTranslation";
import { i18n } from "../../helpers/scripts/i18n";
import { showToast } from "../../helpers/scripts/showToast";
import { sendAnalyticsEvent } from "../../helpers/scripts/analytics";
import { eventTypes } from "../../helpers/constants/analytics";
import { getRealSearch } from "../../helpers/scripts/astro/planets/getRealSearch";
import SearchResultCard from "../cards/SearchResultCard";
import PlanetariumResultCard from "../cards/PlanetariumResultCard";
import {Dayjs} from "dayjs";

interface PlanetariumSearchModalProps {
  onClose: () => void;
  navigation: any;
  onSelect: (obj: DSO | GlobalPlanet | Star) => void;
  timelineDate: Dayjs;
}

export default function PlanetariumSearchModal({ onClose, navigation, onSelect, timelineDate }: PlanetariumSearchModalProps) {

  const { currentUserLocation } = useSettings()
  const { planets } = useSolarSystem()
  const { starsCatalog } = useStarCatalog()
  const { dsoCatalog } = useDsoCatalog()
  const {currentUser} = useAuth()
  const { currentLocale } = useTranslation()

  const [searchString, setSearchString] = useState('')
  const [searchResults, setSearchResults] = useState<DSO[]>([])
  const [planetResults, setPlanetResults] = useState<GlobalPlanet[]>([])
  const [starsResults, setStarsResults] = useState<Star[]>([])
  const [searchResultsLoading, setSearchResultsLoading] = useState(false)
  const [data, setData] = useState<(DSO | GlobalPlanet | Star)[]>([])
  const [suggestions, setSuggestions] = useState<string[]>([])

  const resultsFlatListRef = useRef<FlatList>(null)

  // Autocomplete: filter local catalogs as the user types (debounced 150ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      const query = searchString.trim().toLowerCase();
      if (query.length < 2) { setSuggestions([]); return; }

      const results: string[] = [];

      planets
        .filter(p => p.name.toLowerCase().startsWith(query))
        .forEach(p => results.push(p.name));

      if (dsoCatalog?.length) {
        dsoCatalog
          .filter(d => {
            const names = (d.common_names || '').toLowerCase();
            const id = (d.name || '').toLowerCase();
            return names.includes(query) || id.startsWith(query);
          })
          .slice(0, 5)
          .forEach(d => {
            const label = d.common_names ? d.common_names.split(',')[0].trim() : d.name;
            if (label) results.push(label);
          });
      }

      setSuggestions([...new Set(results)].slice(0, 6));
    }, 150);
    return () => clearTimeout(timer);
  }, [searchString, dsoCatalog, planets]);

  const handleSearch = async (overrideSearch?: string) => {
    const searchTerm = overrideSearch ?? searchString;

    if (!currentUserLocation) {
      showToast({ message: i18n.t('common.errors.noLocation'), type: 'error' })
      return;
    }

    if (!searchTerm) return;

    const formatedSearchString = searchTerm.trim().replaceAll('*', '');

    sendAnalyticsEvent(currentUser, currentUserLocation, 'planetarium_user_search', eventTypes.BUTTON_CLICK, { search_term: formatedSearchString }, currentLocale)

    setSearchResults([])
    setPlanetResults([])
    setStarsResults([])
    setSuggestions([])
    Keyboard.dismiss()

    setSearchResultsLoading(true)

    let realSearch = getRealSearch(formatedSearchString);

    const { planetResults: searchedPlanets, starsResults: searchedStars, dsoResults: searchedDSOs } = await universalObjectSearch(realSearch, planets, starsCatalog, dsoCatalog);
    setSearchResults(searchedDSOs);
    setPlanetResults(searchedPlanets);
    setStarsResults(searchedStars);
    const mergedResults: (DSO | GlobalPlanet | Star)[] = [...searchedPlanets, ...searchedDSOs, ...searchedStars]
    setData(mergedResults);
    setSearchResultsLoading(false)
  }

  const handleResetSearch = () => {
    setSearchResults([])
    setPlanetResults([])
    setStarsResults([])
    setSearchString('')
    sendAnalyticsEvent(currentUser, currentUserLocation, 'reset_search', eventTypes.BUTTON_CLICK, {}, currentLocale)
  }


  return (
    <View style={planetariumSearchModalStyles.modal}>
      <View style={planetariumSearchModalStyles.modal.header}>
        <SimpleButton
          icon={require('../../../assets/icons/FiChevronLeft.png')}
          active
          activeBorderColor={app_colors.white_no_opacity}
          onPress={() => onClose()}
        />
        <InputWithIcon
          placeholder={"M13, Mars, Nebula..."}
          changeEvent={(e) => setSearchString(e)}
          value={searchString}
          type={"text"}
          icon={require('../../../assets/icons/FiSearch.png')}
          search={() => handleSearch()}
        />
      </View>
      {
        suggestions.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ paddingVertical: 8, flexGrow: 0, flexShrink: 0 }}
            contentContainerStyle={{ paddingHorizontal: 10, gap: 8, alignItems: 'center' }}
          >
            {suggestions.map((s, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => {
                  setSearchString(s);
                  handleSearch(s);
                }}
                style={{
                  backgroundColor: app_colors.white_twenty,
                  paddingHorizontal: 14,
                  paddingVertical: 7,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: app_colors.white_forty,
                }}
              >
                <Text style={{ color: app_colors.white, fontSize: 13 }}>{s}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )
      }
      {
        searchResults.length === 0 && planetResults.length === 0 && starsResults.length === 0 && !searchResultsLoading &&
          <ScreenInfo image={require('../../../assets/icons/FiSearch.png')} text={"Recherchez un objet céleste"}/>
      }

      {
        searchResultsLoading ?
          <ActivityIndicator size="large" color={app_colors.white} style={{marginTop: 20}} />
          :
          <FlatList
            ref={resultsFlatListRef}
            scrollEnabled={data.length > 1}
            data={data}
            ListEmptyComponent={<View></View>}
            renderItem={({ item }) => (
              <PlanetariumResultCard
                object={item}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
                navigation={navigation}
                date={timelineDate}
              />
            )}
            keyExtractor={item => `${item.dec}-${item.ra}`}
          />
      }
    </View>
  );
}
