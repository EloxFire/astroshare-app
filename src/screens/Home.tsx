import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { globalStyles } from '../styles/global'
import LocationHeader from '../components/LocationHeader';

export default function Home({ navigation }: any) {
  return (
    <View style={globalStyles.body}>
      <LocationHeader/>
    </View>
  )
}
