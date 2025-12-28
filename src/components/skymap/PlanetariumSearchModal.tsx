import React, {useRef, useState} from "react";
import {ActivityIndicator, FlatList, Keyboard, ListRenderItemInfo, SafeAreaView, View} from "react-native";
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

interface PlanetariumSearchModalProps {
  onClose: () => void;
  navigation: any;
  onSelect: (obj: DSO | GlobalPlanet | Star) => void;
}

export default function PlanetariumSearchModal({ onClose, navigation, onSelect }: PlanetariumSearchModalProps) {

  const { hasInternetConnection, currentUserLocation } = useSettings()
  const { planets } = useSolarSystem()
  const {currentUser} = useAuth()
  const { currentLocale } = useTranslation()

  const [searchString, setSearchString] = useState('')
  const [searchResults, setSearchResults] = useState<DSO[]>([])
  const [planetResults, setPlanetResults] = useState<GlobalPlanet[]>([])
  const [starsResults, setStarsResults] = useState<Star[]>([])
  const [searchResultsLoading, setSearchResultsLoading] = useState(false)
  const [data, setData] = useState<(DSO | GlobalPlanet | Star)[]>([])

  const resultsFlatListRef = useRef<FlatList>(null)

  const handleSearch = async () => {

    if (!hasInternetConnection) {
      showToast({ message: i18n.t('common.errors.noInternetConnection'), type: 'error' })
      return;
    }

    if (!currentUserLocation) {
      showToast({ message: i18n.t('common.errors.noLocation'), type: 'error' })
      return;
    }

    if (searchString === '' || !searchString) return;

    const formatedSearchString = searchString.trim().replaceAll('*', '');

    sendAnalyticsEvent(currentUser, currentUserLocation, 'planetarium_user_search', eventTypes.BUTTON_CLICK, { search_term: formatedSearchString }, currentLocale)

    setSearchResults([])
    setPlanetResults([])
    setStarsResults([])
    Keyboard.dismiss()

    setSearchResultsLoading(true)

    let realSearch = getRealSearch(formatedSearchString);

    const { planetResults: searchedPlanets, starsResults: searchedStars, dsoResults: searchedDSOs } = await universalObjectSearch(realSearch, planets);
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
              />
            )}
            keyExtractor={item => `${item.dec}-${item.ra}`}
          />
      }
    </View>
  );
}
