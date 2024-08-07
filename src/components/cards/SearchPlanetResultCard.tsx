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
    <TouchableOpacity onPress={() => navigation.navigate(routes.planetDetails.path, { planet: planet })}>
      <View style={searchResultCardStyles.card}>
        <View style={searchResultCardStyles.card.header}>
          <View>
            <Text style={searchResultCardStyles.card.header.title}>{planet.name}</Text>
          </View>
          <Image style={searchResultCardStyles.card.image} source={astroImages[planet.name.toUpperCase()]} />
        </View>
        <View style={searchResultCardStyles.card.body}>
          <DSOValues title="Inclinaison" value={(23.5 + parseFloat(planet.i.toFixed(1))).toString() + "°"} />
          <DSOValues title="Masse" value={planet.name === 'Earth' ? (9.972e24 + " Kg").toString() : planet.i.toFixed(2) + "x Terre"} />
          <DSOValues title="Distance" value={planet.name === 'Earth' ? "Vous êtes ici" : planet.a.toFixed(2) + "M Km"} />
          <DSOValues title="Diamètre" value={(planet.r * 2).toString() + " Km"} />
        </View>
        <View style={searchResultCardStyles.card.footer}>
          <Text style={[searchResultCardStyles.card.footer.chip, { backgroundColor: isVisible ? app_colors.green_eighty : app_colors.red_eighty }]}>{isVisible ? `Visible` : "Non visible"}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
