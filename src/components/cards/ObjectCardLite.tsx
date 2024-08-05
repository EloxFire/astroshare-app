import React from 'react'
import { DSO } from '../../helpers/types/DSO'
import { Text, View } from 'react-native'
import { app_colors } from '../../helpers/constants'
import { getObjectName } from '../../helpers/scripts/astro/getObjectName'

interface ObjectCardLiteProps {
  object: DSO
  navigation: any
}

export default function ObjectCardLite({ object, navigation }: ObjectCardLiteProps) {
  return (
    <View>
      <Text style={{ color: app_colors.white }}>{getObjectName(object, 'all', true).toUpperCase()}</Text>
    </View>
  )
}
