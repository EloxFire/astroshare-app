import React, { useEffect, useState } from 'react'
import { Keyboard, View } from 'react-native'
import { showToast } from '../../helpers/scripts/showToast'
import { DSO } from '../../helpers/types/DSO'
import { useSettings } from '../../contexts/AppSettingsContext'
import { useSolarSystem } from '../../contexts/SolarSystemContext'
import { GlobalPlanet } from '../../helpers/types/GlobalPlanet'
import { Star } from '../../helpers/types/Star'
import { i18n } from '../../helpers/scripts/i18n'
import InputWithIcon from './InputWithIcon'
import HomeSearchResults from '../HomeSearchResults'
import { getRealSearch } from '../../helpers/scripts/astro/planets/getRealSearch'
import {universalObjectSearch} from "../../helpers/scripts/universalObjectSearch";

interface HomeSearchModuleProps {
  navigation: any
}

export default function HomeSearchModule({ navigation }: HomeSearchModuleProps) {

  const { hasInternetConnection, currentUserLocation } = useSettings()
  const { planets } = useSolarSystem()

  const [searchString, setSearchString] = useState('')
  const [searchResults, setSearchResults] = useState<DSO[]>([])
  const [planetResults, setPlanetResults] = useState<GlobalPlanet[]>([])
  const [starsResults, setStarsResults] = useState<Star[]>([])
  const [searchResultsLoading, setSearchResultsLoading] = useState(false)

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
    setSearchResultsLoading(false)
  }

  const handleResetSearch = () => {
    setSearchResults([])
    setPlanetResults([])
    setStarsResults([])
    setSearchString('')
  }

  return (
    <View>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <InputWithIcon
          placeholder={i18n.t('homeSearchModule.input_placeholder')}
          changeEvent={(string: string) => { setSearchString(string) }}
          icon={require('../../../assets/icons/FiSearch.png')}
          search={() => handleSearch()}
          value={searchString}
          type={'text'}
        />
      </View>
      {
        (searchResults.length > 0 || planetResults.length > 0 || starsResults.length > 0) &&
        <HomeSearchResults loading={searchResultsLoading} results={searchResults} planetResults={planetResults} onReset={handleResetSearch} starsResults={starsResults} navigation={navigation} />
      }
    </View>
  )
}
