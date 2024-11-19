import React, { ReactNode } from 'react'
import {ScrollView, Text, View} from 'react-native'
import { objectDetailsStyles } from '../../styles/screens/objectDetails'
import { app_colors } from '../../helpers/constants'

interface DSOValuesProps {
  title: string
  value: string | ReactNode
  chipValue?: boolean
  chipColor?: string
  chipForegroundColor?: string
  small?: boolean
  wideChip?: boolean
}

export default function DSOValues({ title, value, chipValue, chipColor, small, wideChip, chipForegroundColor }: DSOValuesProps) {
  return (
    <View style={objectDetailsStyles.dsoValues}>
      <Text style={[objectDetailsStyles.dsoValues.title, { fontSize: small ? 10 : 12 }]}>{title}</Text>
      <ScrollView style={{marginLeft: 30, backgroundColor: 'transparent'}} contentContainerStyle={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end'}}>
        {
          typeof value !== 'object' ?
          (chipValue && !small) ?
            <Text style={[objectDetailsStyles.dsoValues.chip, { backgroundColor: chipColor ? chipColor : app_colors.white_forty, width: wideChip ? 160 : 130, color: chipForegroundColor ? chipForegroundColor : app_colors.white }]}>{value}</Text>
            :
            <Text style={[objectDetailsStyles.dsoValues.value, { fontSize: small ? 12 : 15 }]}>{value}</Text>
            :
            <View>
              {value}
            </View>
        }
      </ScrollView>
    </View>
  )
}
