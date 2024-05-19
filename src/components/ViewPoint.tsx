import React, { useState } from 'react'
import { Image, Text, View } from 'react-native'
import { viewPointsManagerStyles } from '../styles/screens/viewPointsManager'
import { Equipment, TViewPoint } from '../helpers/types/ViewPoint'
import { app_colors } from '../helpers/constants'
import SimpleButton from './commons/buttons/SimpleButton'
import DeleteSpotConfirmationModal from './modals/DeleteSpotModal'

interface ViewPointProps {
  spot: TViewPoint
  onDelete: () => void
}

export default function ViewPoint({ spot, onDelete }: ViewPointProps) {

  return (
    <View>
      <View style={viewPointsManagerStyles.content.viewPoints.viewPoint}>
        <Text style={viewPointsManagerStyles.content.viewPoints.viewPoint.header.title}>{spot.title}</Text>
        <View style={[viewPointsManagerStyles.content.viewPoints.viewPoint.equipment.row, {justifyContent: 'space-between'}]}>
          <EquipmentComponent icon='electricity' title='Électricité' value={spot.equipments.electricity} />
          <EquipmentComponent icon='parking' title='Parking' value={spot.equipments.parking} />
          <EquipmentComponent icon='shelter' title='Intérieur' value={spot.equipments.shelter} />
          <EquipmentComponent icon='tools' title='Outils' value={spot.equipments.tools} />
        </View>
        <View style={[viewPointsManagerStyles.content.viewPoints.viewPoint.equipment.row, {justifyContent: 'flex-start', marginTop: 15}]}>
          <EquipmentComponent icon='altitude' title='Altitude' value={spot.equipments.altitude} />
          <EquipmentComponent icon='polarView' title='Étoile polaire' value={spot.equipments.polarView} />
        </View>
      </View>
    </View>
  )
}

function EquipmentComponent({ icon, title, value }: Equipment) {

  let iconString;
  switch (icon) {
    case 'electricity':
      iconString = require('../../assets/icons/FiPlug.png')
      break;
    case 'parking':
      iconString = require('../../assets/icons/FiParking.png')
      break;
    case 'shelter':
      iconString = require('../../assets/icons/FiHome.png')
      break;
    case 'tools':
      iconString = require('../../assets/icons/FiTool.png')
      break;
    case 'altitude':
      iconString = require('../../assets/icons/FiMountain.png')
      break;
    case 'polarView':
      iconString = require('../../assets/icons/FiCompass.png')
      break;
    default:
      iconString = require('../../assets/icons/FiInfo.png')
      break;
  }

  return (
    <View style={viewPointsManagerStyles.content.viewPoints.viewPoint.equipment}>
      <View style={[viewPointsManagerStyles.content.viewPoints.viewPoint.equipment.row, {gap: 5, marginBottom: 0}]}>
        <Image source={iconString} style={viewPointsManagerStyles.content.viewPoints.viewPoint.equipment.icon} />
        <Text style={viewPointsManagerStyles.content.viewPoints.viewPoint.equipment.text}>{title}</Text>
      </View>
      <Text style={viewPointsManagerStyles.content.viewPoints.viewPoint.equipment.value}>
        {typeof value === 'boolean' ? (value ? 'Oui' : 'Non') : value}
      </Text>
    </View>
  )
}