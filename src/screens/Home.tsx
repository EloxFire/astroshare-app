import React, { useState } from 'react'
import { Keyboard, Text, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { homeStyles } from '../styles/screens/home';
import { routes } from '../helpers/routes';
import { DSO } from '../helpers/types/DSO';
import LocationHeader from '../components/LocationHeader';
import InputWithIcon from '../components/forms/InputWithIcon';
import AppHeader from '../components/commons/AppHeader';
import BigButton from '../components/commons/buttons/BigButton';
import axios from 'axios';
import HomeSearchResults from '../components/HomeSearchResults';

export default function Home({ navigation }: any) {

  const [searchString, setSearchString] = useState('')
  const [searchResults, setSearchResults] = useState<DSO[]>([])

  const handleSearch = async () => {
    Keyboard.dismiss()
    console.log('Search pressed')

    try {
      const response = await axios.get('http://192.168.1.67:3001/search?search=' + searchString)
      console.log(response.data)
      setSearchResults(response.data.data)
    } catch (error) {
      console.log(error)
    }
  }

  const handleRestSearch = () => {
    setSearchResults([])
    setSearchString('')
  }

  return (
    <View style={globalStyles.body}>
      <AppHeader navigation={navigation} />
      <LocationHeader />
      <InputWithIcon
        placeholder="Rechercher un objet céleste"
        changeEvent={(string: string) => setSearchString(string)}
        icon={require('../../assets/icons/FiSearch.png')}
        search={() => handleSearch()}
        value={searchString}
      />
      {
        searchResults.length > 0 &&
        <HomeSearchResults results={searchResults} onReset={handleRestSearch}/>
      }
      <View style={homeStyles.toolsSuggestions}>
        <Text style={globalStyles.sections.subtitle}>{process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}</Text>
        <Text style={globalStyles.sections.subtitle}>{process.env.EXPO_PUBLIC_OPEN_WEATHER_API_KEY}</Text>
        <Text style={globalStyles.sections.title}>Vos outils</Text>
        <Text style={globalStyles.sections.subtitle}>Votre caisse à outils personnalisée</Text>
        <View style={homeStyles.toolsSuggestions.buttons}>
          <BigButton navigation={navigation} targetScreen={routes.weather} text="Météo en direct" subtitle="// C'est le moment de sortir le téléscope !" icon={require('../../assets/icons/FiSun.png')} />
          <BigButton navigation={navigation} targetScreen={routes.compass} text="Boussole & Niveau" subtitle='// Pour une mise en station précise' icon={require('../../assets/icons/FiCompass.png')} />
          <BigButton navigation={navigation} targetScreen={routes.moonPhases} text="Phases de la Lune" subtitle='// Calculez les phases de la Lune' icon={require('../../assets/icons/FiMoon.png')} />
        </View>
      </View>
    </View>
  )
}
