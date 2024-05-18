import React, { useEffect, useState } from 'react'
import { Image, Keyboard, Text, View } from 'react-native'
import PageTitle from '../components/commons/PageTitle'
import { globalStyles } from '../styles/global'
import { viewPointsManagerStyles } from '../styles/screens/viewPointsManager'

export default function ViewPointsManager({ navigation }: any) {
  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title="Lieux d'observation" subtitle="// Gérez vos lieux d'observation favoris" />
      <View style={globalStyles.screens.separator} />
      <View style={viewPointsManagerStyles.content}>
        
      </View>
    </View>
  )
}
