import React, { useEffect, useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { getObject, storeObject } from '../helpers/storage'
import { app_colors, storageKeys } from '../helpers/constants'
import { DSO } from '../helpers/types/DSO'
import { useIsFocused } from "@react-navigation/native";
import { favouriteScreenStyles } from '../styles/screens/favouriteScreen'
import PageTitle from '../components/commons/PageTitle'
import { i18n } from '../helpers/scripts/i18n'
import { GlobalPlanet } from '../helpers/types/GlobalPlanet'
import { Star } from '../helpers/types/Star'
import ScreenInfo from '../components/ScreenInfo'
import CelestialBodyCardLite from "../components/cards/CelestialBodyCardLite";
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from '../hooks/useTranslation'
import { useSettings } from '../contexts/AppSettingsContext'
import { sendAnalyticsEvent } from '../helpers/scripts/analytics'
import { eventTypes } from '../helpers/constants/analytics'
import SimpleButton from '../components/commons/buttons/SimpleButton'

export default function FavouritesScreen({ navigation }: any) {

  const {currentUser} = useAuth()
  const { currentLocale } = useTranslation()
  const { currentUserLocation } = useSettings()

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

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'view_favourites_screen', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, [])

  const handleClearAll = async () => {
    await storeObject(storageKeys.favouriteObjects, [])
    await storeObject(storageKeys.favouritePlanets, [])
    await storeObject(storageKeys.favouriteStars, [])
    setObjects([])
    setPlanets([])
    setStars([])
    sendAnalyticsEvent(currentUser, currentUserLocation, 'clear_all_favourites', eventTypes.BUTTON_CLICK, {}, currentLocale)
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

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 50 }}>
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
                        return <CelestialBodyCardLite key={index} object={object} navigation={navigation} />
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
                        return <CelestialBodyCardLite key={index} object={planet} navigation={navigation} />
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
                        return <CelestialBodyCardLite key={index} object={star} navigation={navigation} />
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
        {
          (objects.length > 0 || planets.length > 0 || stars.length > 0) &&
            <SimpleButton
              align='center'
              text={i18n.t('favouriteScreen.emptyButton')}
              fullWidth
              icon={require('../../assets/icons/FiTrash.png')}
              textColor={app_colors.red_eighty}
              iconColor={app_colors.red_eighty}
              backgroundColor={app_colors.white_no_opacity}
              activeBorderColor={app_colors.red_eighty}
              active
              onPress={handleClearAll}
            />
        }
      </ScrollView>
    </View>
  )
}
