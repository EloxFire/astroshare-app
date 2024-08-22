import React, { ReactNode } from 'react'
import { Text, View } from 'react-native'
import { objectDetailsStyles } from '../../styles/screens/objectDetails'
import { app_colors } from '../../helpers/constants'

interface DSOValuesProps {
  title: string
  value: string
  chipValue?: boolean
  chipColor?: string
  small?: boolean
}

export default function DSOValues({ title, value, chipValue, chipColor, small }: DSOValuesProps) {
  return (
    <View style={objectDetailsStyles.dsoValues}>
      <Text style={[objectDetailsStyles.dsoValues.title, { fontSize: small ? 10 : 12 }]}>{title}</Text>
      {
        (chipValue && !small) ?
          <Text style={[objectDetailsStyles.dsoValues.chip, { backgroundColor: chipColor ? chipColor : app_colors.white_forty }]}>{value}</Text>
          :
          <Text style={[objectDetailsStyles.dsoValues.value, { fontSize: small ? 12 : 15 }]}>{value}</Text>
      }
    </View>
  )
}
