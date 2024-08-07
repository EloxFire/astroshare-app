import React, { useState } from 'react'
import { Keyboard, View } from 'react-native'
import InputWithIcon from './InputWithIcon'
import HomeSearchResults from '../HomeSearchResults'
import { showToast } from '../../helpers/scripts/showToast'
import { DSO } from '../../helpers/types/DSO'
import axios from 'axios'
import { useSettings } from '../../contexts/AppSettingsContext'
import { planetNamesRegexes, solarSystemRegexes } from '../../helpers/scripts/utils/regex/searchRegex'
import { getPlanetaryPositions, Planet } from '@observerly/astrometry'
import { useSolarSystem } from '../../contexts/SolarSystemContext'
import { GlobalPlanet } from '../../helpers/types/GlobalPlanet'

interface HomeSearchModuleProps {
  navigation: any
}

export default function HomeSearchModule({ navigation }: HomeSearchModuleProps) {

  const { hasInternetConnection, currentUserLocation } = useSettings()
  const { planets } = useSolarSystem()

  const [searchString, setSearchString] = useState('')
  const [searchResults, setSearchResults] = useState<DSO[]>([])
  const [planetResults, setPlanetResults] = useState<GlobalPlanet[]>([])

  const handleSearch = async () => {
    if (!hasInternetConnection) {
      showToast({ message: 'Aucune connexion à internet', type: 'error' })
      return;
    }

    if (!currentUserLocation) {
      showToast({ message: 'Localisation requise pour effectuer une recherche', type: 'error' })
      return;
    }

    Keyboard.dismiss()
    console.log('Search pressed', searchString)
    setSearchResults([])
    setPlanetResults([])
    if (searchString === '') return;
    if (planetNamesRegexes.some(regex => regex.test(searchString))) {
      setPlanetResults(planets.filter((planet: GlobalPlanet) => planet.name.toLowerCase() === searchString.toLowerCase()))
      return;
    } else if (solarSystemRegexes.some(regex => regex.test(searchString))) {
      setPlanetResults(planets)
      return;
    }

    try {
      const response = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/search?search=` + searchString);
      setSearchResults(response.data.data)
    } catch (error: any) {
      console.log(error.message)
      showToast({ message: error.message ? error.message : 'Une erreur inconnue est survenue...', type: 'error' })
    }
  }

  const handleResetSearch = () => {
    setSearchResults([])
    setPlanetResults([])
    setSearchString('')
  }

  return (
    <View>
      <InputWithIcon
        placeholder="Rechercher un objet céleste"
        changeEvent={(string: string) => setSearchString(string)}
        icon={require('../../../assets/icons/FiSearch.png')}
        search={() => handleSearch()}
        value={searchString}
      />
      {
        searchResults.length > 0 &&
        <HomeSearchResults type='search' results={searchResults} onReset={handleResetSearch} navigation={navigation} />
      }
      {
        planetResults.length > 0 &&
        <HomeSearchResults type='planet' results={planetResults} onReset={handleResetSearch} navigation={navigation} />
      }
    </View>
  )
}
