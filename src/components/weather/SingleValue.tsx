import React, { useEffect } from 'react'
import { Image, ImageSourcePropType, Text, View } from 'react-native'
import { singleValueStyles } from '../../styles/components/weather/singleValue'

interface SingleValueProps {
  value: string | number
  unit?: string
  icon?: ImageSourcePropType
  size?: 'small' | 'medium' | 'large'
}

export default function SingleValue({ value, unit, size, icon }: SingleValueProps) {
  return (
    <View style={singleValueStyles.container}>
      {icon && <Image source={icon} style={{ width: 15, height: 15, marginRight: 5 }} />}
      <Text style={singleValueStyles.container.value}>{value}</Text>
      {unit && <Text style={singleValueStyles.container.unit}>{unit}</Text>}
    </View>
  )
}
