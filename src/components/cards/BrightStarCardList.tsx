import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { objectCardLiteStyles } from '../../styles/components/cards/objectCardLite'
import { astroImages } from '../../helpers/scripts/loadImages'
import { routes } from '../../helpers/routes'
import { Star } from '../../helpers/types/Star'
import { getBrightStarName } from '../../helpers/scripts/astro/objects/getBrightStarName'

interface BrightStarCardLiteProps {
  star: Star
  navigation: any
}

export default function BrightStarCardLite({ star, navigation }: BrightStarCardLiteProps) {
  return (
    <TouchableOpacity onPress={() => navigation.push(routes.brightStarDetails.path, { star: star })} style={objectCardLiteStyles.card}>
      <Image style={objectCardLiteStyles.card.image} source={astroImages['BRIGHTSTAR']} />
      <View style={objectCardLiteStyles.card.infos}>
        <Text style={objectCardLiteStyles.card.infos.title}>{getBrightStarName(star.ids)}</Text>
      </View>
    </TouchableOpacity>
  )
}
