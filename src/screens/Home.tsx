import React, { useState } from 'react'
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native'
import { globalStyles } from '../styles/global'
import LocationHeader from '../components/LocationHeader';
import InputWithIcon from '../components/forms/InputWithIcon';
import AppHeader from '../components/commons/AppHeader';
import { homeStyles } from '../styles/screens/home';

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
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}
