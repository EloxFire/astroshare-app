import React, { useEffect, useState } from 'react'
import { Keyboard, View } from 'react-native'
import { showToast } from '../../helpers/scripts/showToast'
import { DSO } from '../../helpers/types/DSO'
import { useSettings } from '../../contexts/AppSettingsContext'
import { solarSystemRegexes } from '../../helpers/scripts/utils/regex/searchRegex'
import { useSolarSystem } from '../../contexts/SolarSystemContext'
import { GlobalPlanet } from '../../helpers/types/GlobalPlanet'
import { Star } from '../../helpers/types/Star'
import { i18n } from '../../helpers/scripts/i18n'
import InputWithIcon from './InputWithIcon'
import HomeSearchResults from '../HomeSearchResults'
import axios from 'axios'

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

  useEffect(() => {
    Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);

    return () => {
      Keyboard.removeAllListeners('keyboardDidHide');
    };
  }, [])

  const onKeyboardDidHide = () => {
    handleSearch()
  }

  const handleSearch = async () => {
    console.log("handleSearch")

    if (!hasInternetConnection) {
      showToast({ message: i18n.t('common.errors.noInternetConnection'), type: 'error' })
      return;
    }

    if (!currentUserLocation) {
      showToast({ message: i18n.t('common.errors.noLocation'), type: 'error' })
      return;
    }

    if (searchString === '') return;
    // if (searchString.includes('*')) return;

    const formatedSearchString = searchString.trim().replaceAll('*', '');

    setSearchResults([])
    setPlanetResults([])
    setStarsResults([])


    const planetsRegex = /\b(?:Mercury|Mercure|Venus|Vénus|Earth|Terre|Mars|Jupiter|Saturn|Saturne|Uranus|Neptune)\b/i;

    try {
      if (planetsRegex.test(formatedSearchString)) {
        setPlanetResults(planets.filter((planet: GlobalPlanet) => planet.name.toLowerCase() === formatedSearchString.toLowerCase()))
      } else if (solarSystemRegexes.some(regex => regex.test(formatedSearchString))) {
        setPlanetResults(planets)
      }
    } catch (error) {
      console.log("Planet Error :", error)
    }

    try {
      const starsResponse = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/stars/` + formatedSearchString);
      setStarsResults(starsResponse.data.data)
    } catch (error: any) {
      setStarsResults([])
      console.log("Star Error :", error.message)
      if (!error.message.includes('404')) {
        showToast({ message: error.message ? error.message : i18n.t('common.errors.unknownError'), type: 'error' })
      }
    }

    try {
      const dsoResponse = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/search?search=` + formatedSearchString);
      setSearchResults(dsoResponse.data.data)
    } catch (error: any) {
      setSearchResults([])
      console.log("DSO Error :", error.message)
      if (!error.message.includes('404')) {
        showToast({ message: error.message ? error.message : i18n.t('common.errors.unknownError'), type: 'error' })
      }
    }
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
          changeEvent={(string: string) => setSearchString(string)}
          icon={require('../../../assets/icons/FiSearch.png')}
          search={() => handleSearch()}
          value={searchString}
        />
      </View>
      {
        (searchResults.length > 0 || planetResults.length > 0 || starsResults.length > 0) &&
        <HomeSearchResults results={searchResults} planetResults={planetResults} onReset={handleResetSearch} starsResults={starsResults} navigation={navigation} />
      }
    </View>
  )
}
