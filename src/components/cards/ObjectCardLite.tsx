import React from 'react'
import { DSO } from '../../helpers/types/DSO'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { app_colors } from '../../helpers/constants'
import { getObjectName } from '../../helpers/scripts/astro/getObjectName'
import { objectCardLiteStyles } from '../../styles/components/cards/objectCardLite'
import { astroImages } from '../../helpers/scripts/loadImages'
import { getConstellationName } from '../../helpers/scripts/getConstellationName'
import { prettyDec, prettyRa } from '../../helpers/scripts/astro/prettyCoords'
import { getObjectType } from '../../helpers/scripts/astro/getObjectType'
import { routes } from '../../helpers/routes'

interface ObjectCardLiteProps {
  object: DSO
  navigation: any
}

export default function ObjectCardLite({ object, navigation }: ObjectCardLiteProps) {
  return (
    <TouchableOpacity onPress={() => navigation.navigate(routes.objectDetails.path, { object: object })} style={objectCardLiteStyles.card}>
      <Image style={objectCardLiteStyles.card.image} source={astroImages[object.type.toUpperCase()]} />
      <View style={objectCardLiteStyles.card.infos}>
        <Text style={objectCardLiteStyles.card.infos.title}>{getObjectName(object, 'all', true).toUpperCase()} {object.common_names.split(',')[0] !== '' && `(${object.common_names.split(',')[0]})`}</Text>
        <View style={objectCardLiteStyles.card.infos.data}>
          <View style={objectCardLiteStyles.card.infos.data.info}>
            <Text style={objectCardLiteStyles.card.infos.data.info.label}>Mag</Text>
            <Text style={objectCardLiteStyles.card.infos.data.info.value}>{object.b_mag || object.v_mag}</Text>
          </View>

          <View style={objectCardLiteStyles.card.infos.data.info}>
            <Text style={objectCardLiteStyles.card.infos.data.info.label}>Const</Text>
            <Text style={objectCardLiteStyles.card.infos.data.info.value}>{getConstellationName(object.const)}</Text>
          </View>

          <View style={objectCardLiteStyles.card.infos.data.info}>
            <Text style={objectCardLiteStyles.card.infos.data.info.label}>Type</Text>
            <Text style={objectCardLiteStyles.card.infos.data.info.value}>{object.type}</Text>
          </View>

        </View>
      </View>
    </TouchableOpacity>
  )
}
