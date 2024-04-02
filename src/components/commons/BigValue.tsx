import React from 'react'
import { Text, View } from 'react-native'
import { bigValueStyles } from '../../styles/components/bigValue'

interface BigValueProps {
  value: string
  label: string
}

export default function BigValue({value, label}: BigValueProps) {
  return (
    <View style={bigValueStyles.container}>
      <Text style={bigValueStyles.container.label}>{label} //</Text>
      <Text style={bigValueStyles.container.value}>{value}</Text>
    </View>
  )
}
