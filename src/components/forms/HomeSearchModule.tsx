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

interface HomeSearchModuleProps {
  navigation: any
}

export default function HomeSearchModule({ navigation }: HomeSearchModuleProps) {

  const { hasInternetConnection, currentUserLocation } = useSettings()
  const { planets } = useSolarSystem()

  const [searchString, setSearchString] = useState('')
  const [searchResults, setSearchResults] = useState<DSO[]>([])
  const [planetResults, setPlanetResults] = useState<GlobalPlanet[]>([])
  const [searchMode, setSearchMode] = useState<'planet' | 'search'>('search')

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

    Keyboard.dismiss()
    setSearchResults([])
    setPlanetResults([])

    if (searchMode === 'search') {
      try {
        const response = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/search?search=` + searchString);
        setSearchResults(response.data.data)
      } catch (error: any) {
        console.log(error.message)
        showToast({ message: error.message ? error.message : 'Une erreur inconnue est survenue...', type: 'error' })
      }
    } else {
      const planetsRegex = /\b(?:Mercury|Mercure|Venus|Vénus|Earth|Terre|Mars|Jupiter|Saturn|Saturne|Uranus|Neptune)\b/i;

      if (planetsRegex.test(searchString)) {
        setPlanetResults(planets.filter((planet: GlobalPlanet) => planet.name.toLowerCase() === searchString.toLowerCase()))
        return;
      } else if (solarSystemRegexes.some(regex => regex.test(searchString))) {
        setPlanetResults(planets)
        return;
      }
    }
  }

  const handleResetSearch = () => {
    setSearchResults([])
    setPlanetResults([])
    setSearchString('')
  }

  const handleSearchMode = () => {
    showToast({ message: searchMode === 'search' ? "Mode de recherche : Planètes" : "Mode de recherche : Ciel profond", type: 'success', duration: 1500 })
    setSearchMode(searchMode === 'search' ? 'planet' : 'search')
  }

  return (
    <View>
      <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <TouchableOpacity onPress={() => handleSearchMode()} style={{ backgroundColor: searchMode === 'search' ? app_colors.white_no_opacity : app_colors.white_eighty, padding: 4, alignItems: 'center', borderRadius: 10, display: 'flex', borderWidth: 1, borderColor: app_colors.white_no_opacity }}>
          <Image source={require('../../../assets/icons/astro/planets/EARTH.png')} style={{ width: 30, height: 30 }} />
        </TouchableOpacity>
        <InputWithIcon
          placeholder="Rechercher un objet céleste"
          changeEvent={(string: string) => setSearchString(string)}
          icon={require('../../../assets/icons/FiSearch.png')}
          search={() => handleSearch()}
          value={searchString}
        />
      </View>
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
