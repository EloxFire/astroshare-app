import React, { useState } from 'react'
import { Keyboard, Text, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { homeStyles } from '../styles/screens/home';
import { routes } from '../helpers/routes';
import LocationHeader from '../components/LocationHeader';
import InputWithIcon from '../components/forms/InputWithIcon';
import AppHeader from '../components/commons/AppHeader';
import BigButton from '../components/commons/BigButton';

export default function Home({ navigation }: any) {

  const [searchString, setSearchString] = useState('')

  const handleSearch = () => {
    Keyboard.dismiss()
    console.log('Search pressed')
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
      {/* {
        fixtures.length > 0 &&
        <HomeSearchResults results={fixtures}/>
      } */}
      <View style={homeStyles.toolsSuggestions}>
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
