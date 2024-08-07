import { Image, Text, TouchableOpacity, View } from 'react-native'
import { searchResultCardStyles } from '../../styles/components/searchResultCard'
import { astroImages } from '../../helpers/scripts/loadImages'
import { routes } from '../../helpers/routes'
import { Planet } from '@observerly/astrometry'

interface SearchPlanetResultCardProps {
  planet: Planet
  navigation: any
}

export default function SearchPlanetResultCard({ planet, navigation }: SearchPlanetResultCardProps) {
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

        </View>
        {/* <View style={searchResultCardStyles.card.footer}>
          <Text style={[searchResultCardStyles.card.footer.chip, { backgroundColor: isVisible ? app_colors.green_eighty : app_colors.red_eighty }]}>{isVisible ? `Visible` : "Non visible"}</Text>
        </View> */}
      </View>
    </TouchableOpacity>
  )
}
