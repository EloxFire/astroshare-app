import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { appHeaderStyles } from '../../styles/components/commons/appHeader'

export default function AppHeader() {
  return (
    <View style={appHeaderStyles.container}>
      <Image style={appHeaderStyles.container.logo}
        source={require('../../../assets/logos/astroshare_logo_white.png')}
        resizeMode='contain'
      />
      <TouchableOpacity onPress={() => {console.log('Settings pressed')}}>
        <Image source={require('../../../assets/icons/FiSettings.png')}/>
      </TouchableOpacity>
    </View>
  )
}
