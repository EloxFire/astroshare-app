import React, { useState } from 'react'
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native'
import { globalStyles } from '../styles/global'
import LocationHeader from '../components/LocationHeader';
import InputWithIcon from '../components/forms/InputWithIcon';
import AppHeader from '../components/commons/AppHeader';
import { homeStyles } from '../styles/screens/home';
import BigButton from '../components/commons/BigButton';

export default function Home({ navigation }: any) {

  const [searchString, setSearchString] = useState('')

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={globalStyles.body}>
        <AppHeader/>
        <LocationHeader />
        <InputWithIcon
          placeholder="Rechercher un objet céleste"
          changeEvent={(string: string) => setSearchString(string)}
          icon={require('../../assets/icons/FiSearch.png')}
          search={() => { console.log('Search pressed') }}
          value={searchString}
        />
        <View style={homeStyles.toolsSuggestions}>
          <Text style={globalStyles.sections.title}>Vos outils</Text>
          <View style={homeStyles.toolsSuggestions.buttons}>
            <BigButton navigation={navigation} targetScreen='CompassScreen' text="Boussole" icon={require('../../assets/icons/FiCompass.png')} />
            <BigButton navigation={navigation} targetScreen='MoonScreen' text="Phases lunaire" icon={require('../../assets/icons/FiMoon.png')} additionalStyles={{marginHorizontal: 5}} />
            <BigButton navigation={navigation} targetScreen='WeatherScreen' text="Météo" icon={require('../../assets/icons/FiSun.png')} />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
