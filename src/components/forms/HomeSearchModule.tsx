import React, { useState } from 'react'
import { Image, Keyboard, TouchableOpacity, View } from 'react-native'
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
import { app_colors } from '../../helpers/constants'
import { Star } from '../../helpers/types/Star'

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

  const handleSearch = async () => {
    if (!hasInternetConnection) {
      showToast({ message: 'Aucune connexion à internet', type: 'error' })
      return;
    }

    if (!currentUserLocation) {
      showToast({ message: 'Localisation requise pour effectuer une recherche', type: 'error' })
      return;
    }

    if (searchString === '') return;
    if (searchString.includes('*')) return;

    Keyboard.dismiss()
    setSearchResults([])
    setPlanetResults([])
    setStarsResults([])


    const planetsRegex = /\b(?:Mercury|Mercure|Venus|Vénus|Earth|Terre|Mars|Jupiter|Saturn|Saturne|Uranus|Neptune)\b/i;

    try {
      if (planetsRegex.test(searchString)) {
        setPlanetResults(planets.filter((planet: GlobalPlanet) => planet.name.toLowerCase() === searchString.toLowerCase()))
      } else if (solarSystemRegexes.some(regex => regex.test(searchString))) {
        setPlanetResults(planets)
      }
    } catch (error) {
      console.log("Planet Error :", error)
    }

    try {
      const starsResponse = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/stars/` + searchString);
      setStarsResults(starsResponse.data.data)
    } catch (error: any) {
      setStarsResults([])
      console.log("Star Error :", error.message)
      if (!error.message.includes('404')) {
        showToast({ message: error.message ? error.message : 'Une erreur inconnue est survenue...', type: 'error' })
      }
    }

    try {
      const dsoResponse = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/search?search=` + searchString);
      setSearchResults(dsoResponse.data.data)
    } catch (error: any) {
      setSearchResults([])
      console.log("DSO Error :", error.message)
      if (!error.message.includes('404')) {
        showToast({ message: error.message ? error.message : 'Une erreur inconnue est survenue...', type: 'error' })
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
          placeholder="Rechercher un objet céleste"
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
