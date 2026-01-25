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
import {useAuth} from "../../contexts/AuthContext";
import ProBadge from "../badges/ProBadge";
import {isProUser} from "../../helpers/scripts/auth/checkUserRole";
import {sendAnalyticsEvent} from "../../helpers/scripts/analytics";
import {useTranslation} from "../../hooks/useTranslation";
import {useSettings} from "../../contexts/AppSettingsContext";
import {eventTypes} from "../../helpers/constants/analytics";

export default function AppHeader({ navigation }: any) {

  const {currentUser} = useAuth()
  const { currentLocale } = useTranslation()
  const { currentUserLocation } = useSettings()

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
    console.log('[AppHeader] Current user:', currentUser)
  }, []);

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

  const handleProfilePress = () => {
    if(currentUser){
      sendAnalyticsEvent(currentUser, currentUserLocation, 'Profile button pressed', eventTypes.BUTTON_CLICK, {target: "profile screen"}, currentLocale)
      navigation.push(routes.auth.profile.path)
    }else{
      sendAnalyticsEvent(currentUser, currentUserLocation, 'Login button pressed', eventTypes.BUTTON_CLICK, {target: "login screen"}, currentLocale)
      navigation.push(routes.auth.login.path)
    }
  }

  const handleFavPress = () => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Favorites button pressed', eventTypes.BUTTON_CLICK, {}, currentLocale)
    navigation.push(routes.favorites.path)
  }

  const handleSettingsPress = () => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Settings button pressed', eventTypes.BUTTON_CLICK, {}, currentLocale)
    navigation.push(routes.settings.home.path)
  }

  const handleTutorialPress = () => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Tutorial button pressed', eventTypes.BUTTON_CLICK, {}, currentLocale)
    navigation.push(routes.settings.tutorial.path)
  }

  const handleSellscreenPress = () => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Sell screen button pressed', eventTypes.BUTTON_CLICK, {}, currentLocale)
      .then(() => {
        console.log('[Analytics] Sell screen button pressed event sent successfully');
        navigation.push(routes.sellScreen.path)
      })
  }

  return (
    <View style={appHeaderStyles.container}>
      <Image style={appHeaderStyles.container.logo}
        source={localizedWhiteLogo[i18n.locale]}
        resizeMode='contain'
      />
      <View style={appHeaderStyles.container.buttons}>
        {
          (!currentUser || !isProUser(currentUser)) && (
            <TouchableOpacity onPress={() => handleSellscreenPress()}>
              <ProBadge additionalStyles={{marginRight: 5}}/>
            </TouchableOpacity>
          )
        }

        <TouchableOpacity onPress={() => handleProfilePress()}>
          <Image source={require('../../../assets/icons/FiUser.png')} style={{ width: 20, height: 20 }} />
        </TouchableOpacity>

        {
          showTutorial &&
          <Animated.View style={{ transform: [{ scale: interpolated }] }}>
            <TouchableOpacity style={appHeaderStyles.container.tutorialButton} onPress={() => handleTutorialPress()}>
              <Text style={appHeaderStyles.container.tutorialButton.text}>{i18n.t('tutorialScreen.button')}</Text>
            </TouchableOpacity>
          </Animated.View>
        }
        <TouchableOpacity onPress={() => handleFavPress()}>
          {
            !hasFavs ?
              <Image source={require('../../../assets/icons/FiHeart.png')} style={{ width: 20, height: 20 }} />
              :
              <Image source={require('../../../assets/icons/FiHeartFill.png')} style={{ width: 20, height: 20, tintColor: app_colors.red_eighty }} />
          }
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleSettingsPress()}>
          <Image source={require('../../../assets/icons/FiSettings.png')} style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
      </View>
    </View>
  )
}
