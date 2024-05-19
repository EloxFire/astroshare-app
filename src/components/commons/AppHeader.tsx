import React from 'react'
import { Image, TouchableOpacity, View } from 'react-native'
import { appHeaderStyles } from '../../styles/components/commons/appHeader'
import { routes } from '../../helpers/routes'

export default function AppHeader({navigation}: any) {
  return (
    <View style={appHeaderStyles.container}>
      <Image style={appHeaderStyles.container.logo}
        source={require('../../../assets/logos/astroshare_logo_white.png')}
        resizeMode='contain'
      />
      <TouchableOpacity onPress={() => navigation.navigate(routes.settings)}>
        <Image source={require('../../../assets/icons/FiSettings.png')} style={{width: 20, height: 20}} />
      </TouchableOpacity>
    </View>
  )
}
