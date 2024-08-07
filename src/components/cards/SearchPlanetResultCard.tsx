import React, { useEffect, useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { searchResultCardStyles } from '../../styles/components/searchResultCard'
import { DSO } from '../../helpers/types/DSO'
import { getObjectName } from '../../helpers/scripts/astro/getObjectName'
import { astroImages } from '../../helpers/scripts/loadImages'
import { getConstellationName } from '../../helpers/scripts/getConstellationName'
import { EquatorialCoordinate, GeographicCoordinate, TransitInstance, getBodyNextRise, getBodyNextSet, isBodyAboveHorizon, isBodyCircumpolar, isBodyVisibleForNight, isTransitInstance } from '@observerly/astrometry'
import { useSettings } from '../../contexts/AppSettingsContext'
import { app_colors } from '../../helpers/constants'
import { routes } from '../../helpers/routes'
import { convertDMSToDegreeFromString } from '../../helpers/scripts/astro/DmsToDegree'
import { convertHMSToDegreeFromString } from '../../helpers/scripts/astro/HmsToDegree'
import { calculateHorizonAngle } from '../../helpers/scripts/astro/calculateHorizonAngle'
import { useSpot } from '../../contexts/ObservationSpotContext'
import { extractNumbers } from '../../helpers/scripts/extractNumbers'
import dayjs, { Dayjs } from 'dayjs'
import { prettyDec, prettyRa } from '../../helpers/scripts/astro/prettyCoords'

interface SearchPlanetResultCardProps {
  planet: any
  navigation: any
}

export default function SearchPlanetResultCard({ planet, navigation }: SearchPlanetResultCardProps) {
  return (
    <TouchableOpacity onPress={() => navigation.navigate(routes.objectDetails.path)}>
      <View style={searchResultCardStyles.card}>
        <View style={searchResultCardStyles.card.header}>
          <View>
            <Text style={searchResultCardStyles.card.header.title}>{planet.name}</Text>
          </View>
          <Image style={searchResultCardStyles.card.image} source={astroImages[planet.toUpperCase()]} />
        </View>
        <View style={searchResultCardStyles.card.body}>

        </View>
        {/* <View style={searchResultCardStyles.card.footer}>
          <Text style={[searchResultCardStyles.card.footer.chip, { backgroundColor: isVisible ? app_colors.green_eighty : app_colors.red_eighty }]}>{isVisible ? `Visible` : "Non visible"}</Text>
        </View> */}
      </View>
    </TouchableOpacity>
  )
}
