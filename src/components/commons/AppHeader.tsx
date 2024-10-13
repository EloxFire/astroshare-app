import React, { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Image, Text, TouchableOpacity, View } from 'react-native'
import { appHeaderStyles } from '../../styles/components/commons/appHeader'
import { routes } from '../../helpers/routes'
import { useIsFocused } from '@react-navigation/native'
import { getObject } from '../../helpers/storage'
import { app_colors, storageKeys } from '../../helpers/constants'
import { isFirstLaunch } from '../../helpers/scripts/checkFirstLaunch'
import { i18n } from '../../helpers/scripts/i18n'
import { localizedWhiteLogo } from '../../helpers/scripts/loadImages'

export default function AppHeader({ navigation }: any) {

  const isFocused = useIsFocused();
  const [hasFavs, setHasFavs] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)

  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    (async () => {
      const favsObjects = await getObject(storageKeys.favouriteObjects)
      const favsPlanets = await getObject(storageKeys.favouritePlanets)
      const favsStars = await getObject(storageKeys.favouriteStars)
      setHasFavs(favsObjects && favsObjects.length > 0 || favsPlanets && favsPlanets.length > 0 || favsStars && favsStars.length > 0)
    })()
  }, [isFocused])

  useEffect(() => {
    (async () => {
      const firstLaunch = await isFirstLaunch();
      if (firstLaunch) {
        setShowTutorial(true);
      }
    })()
  }, [])

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.linear
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
          easing: Easing.linear
        }),
      ])
    ).start();
  }, []);

  const interpolated = pulseAnim.interpolate({
    inputRange: [1, 1.2],
    outputRange: [1.2, 1]
  });

  return (
    <View style={appHeaderStyles.container}>
      <Image style={appHeaderStyles.container.logo}
        source={localizedWhiteLogo[i18n.locale]}
        resizeMode='contain'
      />
      <View style={appHeaderStyles.container.buttons}>
        {/*<TouchableOpacity onPress={() => sendPushNotification()}>*/}
        {/*  <Image source={require('../../../assets/icons/FiUnlock.png')} style={{ width: 20, height: 20, tintColor: app_colors.gold }} />*/}
        {/*</TouchableOpacity>*/}
        {
          showTutorial &&
          <Animated.View style={{ transform: [{ scale: interpolated }] }}>
            <TouchableOpacity style={appHeaderStyles.container.tutorialButton} onPress={() => navigation.push(routes.tutorial.path)}>
              <Text style={appHeaderStyles.container.tutorialButton.text}>{i18n.t('tutorialScreen.button')}</Text>
            </TouchableOpacity>
          </Animated.View>
        }
        <TouchableOpacity onPress={() => navigation.push(routes.favorites.path)}>
          {
            !hasFavs ?
              <Image source={require('../../../assets/icons/FiHeart.png')} style={{ width: 20, height: 20 }} />
              :
              <Image source={require('../../../assets/icons/FiHeartFill.png')} style={{ width: 20, height: 20, tintColor: app_colors.red_eighty }} />
          }
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.push(routes.settings.path)}>
          <Image source={require('../../../assets/icons/FiSettings.png')} style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
      </View>
    </View>
  )
}
