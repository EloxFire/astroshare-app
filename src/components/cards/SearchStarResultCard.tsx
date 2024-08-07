import { Image, Text, TouchableOpacity, View } from 'react-native'
import { searchResultCardStyles } from '../../styles/components/searchResultCard'
import { astroImages } from '../../helpers/scripts/loadImages'
import { routes } from '../../helpers/routes'
import { EquatorialCoordinate, GeographicCoordinate, getConstellation, isBodyAboveHorizon, Planet } from '@observerly/astrometry'
import { GlobalPlanet } from '../../helpers/types/GlobalPlanet'
import DSOValues from '../commons/DSOValues'
import { useEffect, useState } from 'react'
import { useSettings } from '../../contexts/AppSettingsContext'
import { app_colors } from '../../helpers/constants'
import { calculateHorizonAngle } from '../../helpers/scripts/astro/calculateHorizonAngle'
import { Star } from '../../helpers/types/Star'
import { getBrightStarName } from '../../helpers/scripts/astro/objects/getBrightStarName'
import { prettyDec, prettyRa } from '../../helpers/scripts/astro/prettyCoords'
import { convertDDtoDMS } from '../../helpers/scripts/convertDDtoDMSCoords'
import { convertDegreesRaToHMS } from '../../helpers/scripts/astro/coords/convertDegreesRaToHMS'
import { convertDegreesDecToDMS } from '../../helpers/scripts/astro/coords/convertDegreesDecToDms'
import { getConstellationName } from '../../helpers/scripts/getConstellationName'

interface SearchPlanetResultCardProps {
  star: Star
  navigation: any
}

export default function SearchStarResultCard({ star, navigation }: SearchPlanetResultCardProps) {

  const { currentUserLocation } = useSettings()
  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    if (!currentUserLocation) return;
    const observer: GeographicCoordinate = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }
    const target: EquatorialCoordinate = { ra: star.ra, dec: star.dec }
    const horizonAngle = calculateHorizonAngle(341)
    setIsVisible(isBodyAboveHorizon(new Date(), observer, target, horizonAngle))
  }, [])

  return (
    <TouchableOpacity onPress={() => navigation.navigate(routes.brightStarDetails.path, { star: star })}>
      <View style={searchResultCardStyles.card}>
        <View style={searchResultCardStyles.card.header}>
          <View>
            <Text style={searchResultCardStyles.card.header.title}>{getBrightStarName(star.ids)}</Text>
          </View>
          <Image style={searchResultCardStyles.card.image} source={astroImages['BRIGHTSTAR']} />
        </View>
        <View style={searchResultCardStyles.card.body}>
          <View style={searchResultCardStyles.card.body.info}>
            <Text style={searchResultCardStyles.card.body.info.title}>Constellation :</Text>
            <Text style={searchResultCardStyles.card.body.info.value}>{getConstellationName(getConstellation({ ra: star.ra, dec: star.dec })?.abbreviation || "Inconnu")}</Text>
          </View>
          <View style={searchResultCardStyles.card.body.info}>
            <Text style={searchResultCardStyles.card.body.info.title}>Magnitude :</Text>
            <Text style={searchResultCardStyles.card.body.info.value}>{star.V.toString() || star.B.toString()}</Text>
          </View>
          <View style={searchResultCardStyles.card.body.info}>
            <Text style={searchResultCardStyles.card.body.info.title}>Ascension droite :</Text>
            <Text style={searchResultCardStyles.card.body.info.value}>{convertDegreesRaToHMS(star.ra)}</Text>
          </View>
          <View style={searchResultCardStyles.card.body.info}>
            <Text style={searchResultCardStyles.card.body.info.title}>Déclinaison :</Text>
            <Text style={searchResultCardStyles.card.body.info.value}>{convertDegreesDecToDMS(star.dec)}</Text>
          </View>

        </View>
        <View style={searchResultCardStyles.card.footer}>
          <Text style={[searchResultCardStyles.card.footer.chip, { backgroundColor: isVisible ? app_colors.green_eighty : app_colors.red_eighty }]}>{isVisible ? `Visible` : "Non visible"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
