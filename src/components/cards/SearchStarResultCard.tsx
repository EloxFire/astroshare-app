import { Image, Text, TouchableOpacity, View } from 'react-native'
import { searchResultCardStyles } from '../../styles/components/searchResultCard'
import { astroImages } from '../../helpers/scripts/loadImages'
import { routes } from '../../helpers/routes'
import { EquatorialCoordinate, GeographicCoordinate, isBodyAboveHorizon, Planet } from '@observerly/astrometry'
import { GlobalPlanet } from '../../helpers/types/GlobalPlanet'
import DSOValues from '../commons/DSOValues'
import { useEffect, useState } from 'react'
import { useSettings } from '../../contexts/AppSettingsContext'
import { app_colors } from '../../helpers/constants'
import { calculateHorizonAngle } from '../../helpers/scripts/astro/calculateHorizonAngle'
import { Star } from '../../helpers/types/Star'
import { getBrightStarName } from '../../helpers/scripts/astro/objects/getBrightStarName'

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
        </View>
        <View style={searchResultCardStyles.card.footer}>
          <Text style={[searchResultCardStyles.card.footer.chip, { backgroundColor: isVisible ? app_colors.green_eighty : app_colors.red_eighty }]}>{isVisible ? `Visible` : "Non visible"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
