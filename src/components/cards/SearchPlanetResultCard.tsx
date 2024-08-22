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
import { formatCelsius, formatKm } from '../../helpers/scripts/utils/formatters/formaters'
import { planetsSizes } from '../../helpers/scripts/astro/planets/sizes'
import { useTranslation } from '../../hooks/useTranslation'
import { planetTemps } from '../../helpers/scripts/astro/planets/temps'
import { planetSatellites } from '../../helpers/scripts/astro/planets/satellites'
import { planetsOrder } from '../../helpers/scripts/astro/planets/order'

interface SearchPlanetResultCardProps {
  planet: GlobalPlanet
  navigation: any
}

export default function SearchPlanetResultCard({ planet, navigation }: SearchPlanetResultCardProps) {

  const { currentUserLocation } = useSettings()
  const { currentLCID } = useTranslation()
  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    if (!currentUserLocation) return;
    const observer: GeographicCoordinate = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }
    const target: EquatorialCoordinate = { ra: planet.ra, dec: planet.dec }
    const horizonAngle = calculateHorizonAngle(341)
    setIsVisible(isBodyAboveHorizon(new Date(), observer, target, horizonAngle))
  }, [])

  return (
    <TouchableOpacity onPress={() => navigation.push(routes.planetDetails.path, { planet: planet, planetVisible: isVisible })}>
      <View style={searchResultCardStyles.card}>
        <View style={searchResultCardStyles.card.header}>
          <View>
            <Text style={searchResultCardStyles.card.header.title}>{planet.name}</Text>
          </View>
          <Image style={searchResultCardStyles.card.image} source={astroImages[planet.name.toUpperCase()]} />
        </View>
        <View style={searchResultCardStyles.card.body}>
          <DSOValues small title={i18n.t('detailsPages.planets.labels.position')} value={`${planetsOrder[planet.name.toUpperCase()]} / 8`} />
          <DSOValues small title={i18n.t('detailsPages.planets.labels.diameter')} value={formatKm(planetsSizes[planet.name.toUpperCase()], currentLCID).toString()} />
          <DSOValues small title={i18n.t('detailsPages.planets.labels.short.surfaceTemperature')} value={formatCelsius(planetTemps[planet.name.toUpperCase()], currentLCID).toString()} />
          <DSOValues small title={i18n.t('detailsPages.planets.labels.short.naturalSatellites')} value={planetSatellites[planet.name.toUpperCase()].toString()} />
        </View>
        <View style={searchResultCardStyles.card.footer}>
          <Text style={[searchResultCardStyles.card.footer.chip, { backgroundColor: isVisible ? app_colors.green_eighty : app_colors.red_eighty }]}>{isVisible ? i18n.t('common.visibility.visible') : i18n.t('common.visibility.notVisible')}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
