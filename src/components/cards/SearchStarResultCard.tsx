import { Image, Text, TouchableOpacity, View } from 'react-native'
import { searchResultCardStyles } from '../../styles/components/searchResultCard'
import { astroImages } from '../../helpers/scripts/loadImages'
import { routes } from '../../helpers/routes'
import { EquatorialCoordinate, GeographicCoordinate, getConstellation, isBodyAboveHorizon, Planet } from '@observerly/astrometry'
import { GlobalPlanet } from '../../helpers/types/GlobalPlanet'
import DSOValues from '../commons/DSOValues'
import React, { useEffect, useState } from 'react'
import { useSettings } from '../../contexts/AppSettingsContext'
import { app_colors } from '../../helpers/constants'
import { calculateHorizonAngle } from '../../helpers/scripts/astro/calculateHorizonAngle'
import { Star } from '../../helpers/types/Star'
import { getBrightStarName } from '../../helpers/scripts/astro/objects/getBrightStarName'
import { convertDegreesRaToHMS } from '../../helpers/scripts/astro/coords/convertDegreesRaToHMS'
import { convertDegreesDecToDMS } from '../../helpers/scripts/astro/coords/convertDegreesDecToDms'
import { getConstellationName } from '../../helpers/scripts/getConstellationName'
import { useSpot } from '../../contexts/ObservationSpotContext'
import { extractNumbers } from '../../helpers/scripts/extractNumbers'
import { i18n } from '../../helpers/scripts/i18n'

interface SearchPlanetResultCardProps {
  star: Star
  navigation: any
}

export default function SearchStarResultCard({ star, navigation }: SearchPlanetResultCardProps) {

  const { selectedSpot, defaultAltitude } = useSpot()
  const { currentUserLocation } = useSettings()
  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    const altitude = selectedSpot ? selectedSpot.equipments.altitude : defaultAltitude;
    if (!currentUserLocation) return;
    const observer: GeographicCoordinate = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }
    const target: EquatorialCoordinate = { ra: star.ra, dec: star.dec }
    const horizonAngle = calculateHorizonAngle(extractNumbers(altitude))
    const visible = isBodyAboveHorizon(new Date(), observer, target, horizonAngle)
    setIsVisible(visible)
  }, [currentUserLocation])

  return (
    <TouchableOpacity onPress={() => navigation.push(routes.celestialBodies.details.path, { object: star })}>
      <View style={searchResultCardStyles.card}>
        <View style={searchResultCardStyles.card.header}>
          <View>
            <Text style={searchResultCardStyles.card.header.title}>{getBrightStarName(star.ids)?.length > 11 ? getBrightStarName(star.ids)?.slice(0, 11) + '...' : getBrightStarName(star.ids) || star.ids.split('|')[0]}</Text>
          </View>
          <Image style={searchResultCardStyles.card.image} source={astroImages['BRIGHTSTAR']} />
        </View>
        <View style={searchResultCardStyles.card.body}>
          <DSOValues small title={i18n.t('detailsPages.stars.labels.constellation')} value={getConstellationName(getConstellation({ ra: star.ra, dec: star.dec })?.abbreviation || "Inconnu")} />
          <DSOValues small title={i18n.t('detailsPages.stars.labels.magnitude')} value={star.V.toString() || star.V.toString()} />
          <DSOValues small title={i18n.t('detailsPages.stars.labels.rightAscension')} value={convertDegreesRaToHMS(star.ra)} />
          <DSOValues small title={i18n.t('detailsPages.stars.labels.declination')} value={convertDegreesDecToDMS(star.dec)} />
        </View>
        <View style={searchResultCardStyles.card.footer}>
          <Text style={[searchResultCardStyles.card.footer.chip, { backgroundColor: isVisible ? app_colors.green_eighty : app_colors.red_eighty }]}>{isVisible ? i18n.t('common.visibility.visible') : i18n.t('common.visibility.notVisible')}</Text>
          <Text style={[searchResultCardStyles.card.footer.chip, { backgroundColor: app_colors.white_forty, color: app_colors.white }]}>{i18n.t('common.other.more')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
