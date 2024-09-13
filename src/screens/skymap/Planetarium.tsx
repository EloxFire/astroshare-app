import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { planetariumStyles } from '../../styles/screens/skymap/planetarium'
import { Image } from 'expo-image'

export default function Planetarium({ navigation }: any) {
  return (
    <View style={planetariumStyles.container}>
      <TouchableOpacity style={planetariumStyles.container.backButton} onPress={() => navigation.goBack()}>
        <Image style={planetariumStyles.container.backButton.icon} source={require('../../../assets/icons/FiChevronDown.png')} />
        <Text style={planetariumStyles.container.backButton.text}>Retour</Text>
      </TouchableOpacity>
    </View>
  )
}
