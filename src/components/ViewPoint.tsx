import React from 'react'
import { Text, View } from 'react-native'
import SimpleButton from './commons/buttons/SimpleButton'
import { viewPointsManagerStyles } from '../styles/screens/viewPointsManager'
import BigValue from './commons/BigValue'

interface ViewPointProps {
  title: string
}

export default function ViewPoint({ title }: ViewPointProps) {
  return (
    <View style={viewPointsManagerStyles.content.viewPoints.viewPoint}>
      <View>
        <Text style={viewPointsManagerStyles.content.viewPoints.viewPoint.name}>{title}</Text>
        <View style={viewPointsManagerStyles.content.viewPoints.viewPoint.infos}>
          <View></View>
          <Text style={viewPointsManagerStyles.content.viewPoints.viewPoint.text}>+651m</Text>
          <Text style={viewPointsManagerStyles.content.viewPoints.viewPoint.text}>360°</Text>
          <Text style={viewPointsManagerStyles.content.viewPoints.viewPoint.text}>Oui</Text>
          <Text style={viewPointsManagerStyles.content.viewPoints.viewPoint.text}>Points</Text>
          <Text style={viewPointsManagerStyles.content.viewPoints.viewPoint.text}>Points</Text>
          <Text style={viewPointsManagerStyles.content.viewPoints.viewPoint.text}>Points</Text>
          <Text style={viewPointsManagerStyles.content.viewPoints.viewPoint.text}>Points</Text>
        </View>
      </View>
      <View style={viewPointsManagerStyles.content.viewPoints.viewPoint.buttons}>
        <SimpleButton small icon={require('../../assets/icons/FiEdit.png')} onPress={() => { }} />
        <SimpleButton small icon={require('../../assets/icons/FiTrash.png')} onPress={() => { }} />
      </View>
    </View>
  )
}
