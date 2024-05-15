import React from 'react'
import { Text, View } from 'react-native'
import { bigValueStyles } from '../../styles/components/commons/bigValue'

interface BigValueProps {
  value: string
  label: string
  right?: boolean
}

export default function BigValue({value, label, right}: BigValueProps) {
  return (
    <View style={bigValueStyles.container}>
      <Text style={bigValueStyles.container.label}>{label} //</Text>
      <Text style={[bigValueStyles.container.value, {alignSelf: right ? 'flex-end' : 'flex-start'}]}>{value}</Text>
    </View>
  )
}
