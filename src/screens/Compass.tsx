import React, { useState } from 'react'
import { Keyboard, Text, TouchableWithoutFeedback, View } from 'react-native'
import { globalStyles } from '../styles/global'
import PageTitle from '../components/commons/PageTitle'

export default function Compass({ navigation }: any) {

  const [searchString, setSearchString] = useState('')

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={globalStyles.body}>
        <PageTitle navigation={navigation} title='Boussole' />
      </View>
    </TouchableWithoutFeedback>
  )
}