import React, { ReactNode } from 'react'
import { Text, View } from 'react-native'
import { objectDetailsStyles } from '../../styles/screens/objectDetails'
import { app_colors } from '../../helpers/constants'

interface DSOValuesProps {
  title: string
  value: string
  chipValue?: boolean
  chipColor?: string
}

export default function DSOValues({ title, value, chipValue, chipColor }: DSOValuesProps) {
  return (
    <View style={objectDetailsStyles.dsoValues}>
      <Text style={objectDetailsStyles.dsoValues.title}>{title}</Text>
      {
        chipValue ?
          <Text style={[objectDetailsStyles.dsoValues.chip, {backgroundColor: chipColor ? chipColor : app_colors.white_forty}]}>{value}</Text>
          :
          <Text style={objectDetailsStyles.dsoValues.value}>{value}</Text>
      }
    </View>
  )
}
