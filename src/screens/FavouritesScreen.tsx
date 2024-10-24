import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { getObject, storeObject } from '../helpers/storage'
import { app_colors, storageKeys } from '../helpers/constants'
import { DSO } from '../helpers/types/DSO'
import { useIsFocused } from "@react-navigation/native";
import { favouriteScreenStyles } from '../styles/screens/favouriteScreen'
import { viewPointsManagerStyles } from '../styles/screens/viewPointsManager'
import PageTitle from '../components/commons/PageTitle'
import ObjectCardLite from '../components/cards/ObjectCardLite'
import { i18n } from '../helpers/scripts/i18n'
import { GlobalPlanet } from '../helpers/types/GlobalPlanet'
import { Star } from '../helpers/types/Star'
import PlanetCardLite from '../components/cards/PlanetCardLite'
import BrightStarCardLite from '../components/cards/BrightStarCardLite'
import ScreenInfo from '../components/ScreenInfo'

export default function FavouritesScreen({ navigation }: any) {

  const isFocused = useIsFocused();
  const [objects, setObjects] = useState<DSO[]>([])
  const [planets, setPlanets] = useState<GlobalPlanet[]>([])
  const [stars, setStars] = useState<Star[]>([])

  const [objectsTabOppened, setObjectsTabOppened] = useState(false)
  const [planetsTabOppened, setPlanetsTabOppened] = useState(false)
  const [starsTabOppened, setStarsTabOppened] = useState(false)

  useEffect(() => {
    (async () => {
      const favs = await getObject(storageKeys.favouriteObjects)
      const favsPlanets = await getObject(storageKeys.favouritePlanets)
      const favsStars = await getObject(storageKeys.favouriteStars)
      if (favs) setObjects(favs)
      if (favsPlanets) setPlanets(favsPlanets)
      if (favsStars) setStars(favsStars)
    })()
  }, [isFocused])

  const handleClearAll = async () => {
    await storeObject(storageKeys.favouriteObjects, [])
    setObjects([])
  }

  const handleOpenTab = (tab: string) => {
    switch (tab) {
      case 'dso':
        setObjectsTabOppened(!objectsTabOppened)
        break;
      case 'planet':
        setPlanetsTabOppened(!planetsTabOppened)
        break;
      case 'star':
        setStarsTabOppened(!starsTabOppened)
        break;
    }
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title={i18n.t('favouriteScreen.title')} subtitle={i18n.t('favouriteScreen.subtitle')} />
      <View style={globalStyles.screens.separator} />

      <ScrollView style={{ flex: 1 }}>
        {
          (objects.length === 0 && planets.length === 0 && stars.length === 0) ? (
            <View>
              <Text style={favouriteScreenStyles.noFavsBadge}>{i18n.t('favouriteScreen.noFavs')}</Text>
              <ScreenInfo image={require('../../assets/icons/FiHeart.png')} text={i18n.t('favouriteScreen.noFavsHint')} />
            </View>
          )
            :
            <>
              <TouchableOpacity onPress={() => handleOpenTab('dso')} style={favouriteScreenStyles.listButton}>
                <Text style={favouriteScreenStyles.listButton.text}>{i18n.t('favouriteScreen.dso.title')} - ({objects.length})</Text>
                <Image source={require('../../assets/icons/FiChevronDown.png')} style={[favouriteScreenStyles.listButton.icon, { transform: [{ rotate: objectsTabOppened ? '-180deg' : '0deg' }] }]} />
              </TouchableOpacity>
              {
                objectsTabOppened &&
                <View style={{ marginBottom: 10 }}>
                  {
                    objects.length > 0 ?
                      objects.map((object: DSO, index: number) => {
                        return <ObjectCardLite key={index} object={object} navigation={navigation} />
                      }) :
                      <View>
                        <Text style={favouriteScreenStyles.noFavsBadge}>{i18n.t('favouriteScreen.dso.noFavs')}</Text>
                      </View>
                  }
                </View>
              }
              <TouchableOpacity onPress={() => handleOpenTab('planet')} style={favouriteScreenStyles.listButton}>
                <Text style={favouriteScreenStyles.listButton.text}>{i18n.t('favouriteScreen.planet.title')} - ({planets.length})</Text>
                <Image source={require('../../assets/icons/FiChevronDown.png')} style={[favouriteScreenStyles.listButton.icon, { transform: [{ rotate: planetsTabOppened ? '-180deg' : '0deg' }] }]} />
              </TouchableOpacity>
              {
                planetsTabOppened &&
                <View style={{ marginBottom: 10 }}>
                  {
                    planets.length > 0 ?
                      planets.map((planet: GlobalPlanet, index: number) => {
                        return <PlanetCardLite key={index} planet={planet} navigation={navigation} />
                      })
                      :
                      <View>
                        <Text style={favouriteScreenStyles.noFavsBadge}>{i18n.t('favouriteScreen.planet.noFavs')}</Text>
                      </View>
                  }
                </View>
              }
              <TouchableOpacity onPress={() => handleOpenTab('star')} style={favouriteScreenStyles.listButton} >
                <Text style={favouriteScreenStyles.listButton.text}>{i18n.t('favouriteScreen.star.title')} - ({stars.length})</Text>
                <Image source={require('../../assets/icons/FiChevronDown.png')} style={[favouriteScreenStyles.listButton.icon, { transform: [{ rotate: starsTabOppened ? '-180deg' : '0deg' }] }]} />
              </TouchableOpacity>
              {
                starsTabOppened &&
                <View style={{ marginBottom: 10 }}>
                  {
                    stars.length > 0 ?
                      stars.map((star: Star, index: number) => {
                        return <BrightStarCardLite key={index} star={star} navigation={navigation} />
                      })
                      :
                      <View>
                        <Text style={favouriteScreenStyles.noFavsBadge}>{i18n.t('favouriteScreen.star.noFavs')}</Text>
                      </View>
                  }
                </View>
              }
            </>
        }
      </ScrollView>
    </View>
  )
}
