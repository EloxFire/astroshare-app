import React, { useEffect, useState } from 'react'
import { Keyboard, View } from 'react-native'
import { showToast } from '../../helpers/scripts/showToast'
import { DSO } from '../../helpers/types/DSO'
import { useSettings } from '../../contexts/AppSettingsContext'
import { planetNamesRegexes, solarSystemRegexes } from '../../helpers/scripts/utils/regex/searchRegex'
import { useSolarSystem } from '../../contexts/SolarSystemContext'
import { GlobalPlanet } from '../../helpers/types/GlobalPlanet'
import { Star } from '../../helpers/types/Star'
import { i18n } from '../../helpers/scripts/i18n'
import InputWithIcon from './InputWithIcon'
import HomeSearchResults from '../HomeSearchResults'
import axios from 'axios'
import { getRealSearch } from '../../helpers/scripts/astro/planets/getRealSearch'

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

    if (searchString === '') return;

    const formatedSearchString = searchString.trim().replaceAll('*', '');

    setSearchResults([])
    setPlanetResults([])
    setStarsResults([])
    Keyboard.dismiss()

    setSearchResultsLoading(true)


    let realSearch = getRealSearch(formatedSearchString);

    console.log("searchedPlanet", realSearch);


    try {
      if (planetNamesRegexes.test(realSearch)) {
        setPlanetResults(planets.filter((planet: GlobalPlanet) => planet.name.toLowerCase() === realSearch.toLowerCase()))
      } else if (solarSystemRegexes.some(regex => regex.test(formatedSearchString))) {
        setPlanetResults(planets)
      }
    } catch (error) {
      console.log("Planet Error :", error)
    }

    try {
      const starsResponse = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/stars/` + realSearch);
      console.log(starsResponse.data.data);

      setStarsResults(starsResponse.data.data)
    } catch (error: any) {
      setStarsResults([])
      console.log("Star Error :", error.message)
      if (!error.message.includes('404')) {
        showToast({ message: error.message ? error.message : i18n.t('common.errors.unknownError'), type: 'error' })
      }
    }

    try {
      const dsoResponse = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/search?search=` + realSearch);
      setSearchResults(dsoResponse.data.data)
    } catch (error: any) {
      setSearchResults([])
      console.log("DSO Error :", error.message)
      if (!error.message.includes('404')) {
        showToast({ message: error.message ? error.message : i18n.t('common.errors.unknownError'), type: 'error' })
      }
    }

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
