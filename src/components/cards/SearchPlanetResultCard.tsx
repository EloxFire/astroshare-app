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
import { i18n } from '../../helpers/scripts/i18n'

interface SearchPlanetResultCardProps {
  planet: GlobalPlanet
  navigation: any
}

export default function SearchPlanetResultCard({ planet, navigation }: SearchPlanetResultCardProps) {

  const { currentUserLocation } = useSettings()
  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    if (!currentUserLocation) return;
    const observer: GeographicCoordinate = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }
    const target: EquatorialCoordinate = { ra: planet.ra, dec: planet.dec }
    const horizonAngle = calculateHorizonAngle(341)
    setIsVisible(isBodyAboveHorizon(new Date(), observer, target, horizonAngle))
  }, [])

  return (
    <TouchableOpacity onPress={() => navigation.navigate(routes.planetDetails.path, { planet: planet, planetVisible: isVisible })}>
      <View style={searchResultCardStyles.card}>
        <View style={searchResultCardStyles.card.header}>
          <View>
            <Text style={searchResultCardStyles.card.header.title}>{planet.name}</Text>
          </View>
          <Image style={searchResultCardStyles.card.image} source={astroImages[planet.name.toUpperCase()]} />
        </View>
        <View style={searchResultCardStyles.card.body}>
          <View style={searchResultCardStyles.card.body.info}>
            <Text style={searchResultCardStyles.card.body.info.title}>{i18n.t('resultCards.planetCard.inclination')} :</Text>
            <Text style={searchResultCardStyles.card.body.info.value}>{(23.5 + parseFloat(planet.i.toFixed(1))).toString() + "°"}</Text>
          </View>
          <View style={searchResultCardStyles.card.body.info}>
            <Text style={searchResultCardStyles.card.body.info.title}>{i18n.t('resultCards.planetCard.mass')} :</Text>
            <Text style={searchResultCardStyles.card.body.info.value}>{planet.name === 'Earth' ? (9.972e24 + " Kg").toString() : (planet.m.toFixed(2)) + i18n.t('resultCards.planetCard.massUnit')}</Text>
          </View>
          <View style={searchResultCardStyles.card.body.info}>
            <Text style={searchResultCardStyles.card.body.info.title}>{i18n.t('resultCards.planetCard.diameter')} :</Text>
            <Text style={searchResultCardStyles.card.body.info.value}>{(planet.r * 2).toString() + " Km"}</Text>
          </View>
        </View>
        <View style={searchResultCardStyles.card.footer}>
          <Text style={[searchResultCardStyles.card.footer.chip, { backgroundColor: isVisible ? app_colors.green_eighty : app_colors.red_eighty }]}>{isVisible ? i18n.t('common.visibility.visible') : i18n.t('common.visibility.notVisible')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
