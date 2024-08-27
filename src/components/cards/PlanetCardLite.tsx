import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { objectCardLiteStyles } from '../../styles/components/cards/objectCardLite'
import { astroImages } from '../../helpers/scripts/loadImages'
import { routes } from '../../helpers/routes'
import { GlobalPlanet } from '../../helpers/types/GlobalPlanet'
import { i18n } from '../../helpers/scripts/i18n'

interface PlanetCardLiteProps {
  planet: GlobalPlanet
  navigation: any
}

export default function PlanetCardLite({ planet, navigation }: PlanetCardLiteProps) {
  return (
    <TouchableOpacity onPress={() => navigation.push(routes.planetDetails.path, { planet: planet })} style={objectCardLiteStyles.card}>
      <Image style={objectCardLiteStyles.card.image} source={astroImages[planet.name.toUpperCase()]} />
      <View style={objectCardLiteStyles.card.infos}>
        <Text style={objectCardLiteStyles.card.infos.title}>{i18n.t(`common.planets.${planet.name}`).toUpperCase()}</Text>
      </View>
    </TouchableOpacity>
  )
}
