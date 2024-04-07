import React, { useState } from 'react'
import { Image, Text, View } from 'react-native'
import PageTitle from '../components/commons/PageTitle'
import { globalStyles } from '../styles/global'
import { weatherStyles } from '../styles/screens/weather'
import InputWithIcon from '../components/forms/InputWithIcon'

export default function Weather({ navigation }: any) {
  
  const [searchedCity, setSearchedCity] = useState<string>('')

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title="Météo en direct" subtitle="// C'est l'heure de sortir le télescope !" />
      <View style={globalStyles.screens.separator} />
      <View style={weatherStyles.content}>
        <InputWithIcon
          icon={require('../../assets/icons/FiSearch.png')}
          placeholder="Rechercher une ville"
          changeEvent={(text: string) => console.log(text)}
          search={() => console.log('search')}
          value={searchedCity}
        />
      </View>
    </View>
  )
}
