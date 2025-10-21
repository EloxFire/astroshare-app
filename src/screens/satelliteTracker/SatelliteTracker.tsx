import React, {useEffect} from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { i18n } from '../../helpers/scripts/i18n'
import { globalStyles } from '../../styles/global'
import { routes } from '../../helpers/routes'
import { satelliteTrackerHomeStyles } from '../../styles/screens/satelliteTracker/home'
import PageTitle from '../../components/commons/PageTitle'
import ToolButton from '../../components/commons/buttons/ToolButton'
import ScreenInfo from '../../components/ScreenInfo'
import { useSpacex } from '../../contexts/SpaceXContext'
import {useSettings} from "../../contexts/AppSettingsContext";
import {useAuth} from "../../contexts/AuthContext";
import {useTranslation} from "../../hooks/useTranslation";
import {sendAnalyticsEvent} from "../../helpers/scripts/analytics";
import {eventTypes} from "../../helpers/constants/analytics";
import { isProUser } from '../../helpers/scripts/auth/checkUserRole'
import { BASE_NORAD_IDS, KNOWN_NORAD_IDS } from '../../helpers/constants/norad'

export default function SatelliteTracker({ navigation }: any) {

  const {constellation} = useSpacex()
  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Satellite tracker screen view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, []);

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('home.buttons.satellite_tracker.title')}
        subtitle={i18n.t('home.buttons.satellite_tracker.subtitle')}
        backRoute={routes.home.path}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={satelliteTrackerHomeStyles.buttons}>
          <ToolButton text={i18n.t('satelliteTrackers.home.buttons.25544.title', {name: KNOWN_NORAD_IDS[25544 as keyof typeof KNOWN_NORAD_IDS]})} subtitle={i18n.t('satelliteTrackers.home.buttons.25544.subtitle')} image={require('../../../assets/images/tools/isstracker.png')} onPress={() => navigation.navigate(routes.satellitesTrackers.details.path, {noradId: BASE_NORAD_IDS.ISS})} />
          {/* <ToolButton disabled={constellation.length === 0} text={i18n.t('satelliteTracker.home.buttons.starlinkTracker.title')} subtitle={i18n.t('satelliteTracker.home.buttons.starlinkTracker.subtitle')} image={require('../../../assets/images/tools/starlinktracker.png')} onPress={() => navigation.navigate(routes.satellitesTrackers.details.path)} /> */}
          <ToolButton disabled={!isProUser(currentUser)} text={i18n.t('satelliteTrackers.home.buttons.48274.title', {name: KNOWN_NORAD_IDS[48274 as keyof typeof KNOWN_NORAD_IDS]})} subtitle={i18n.t('satelliteTrackers.home.buttons.48274.subtitle')} image={require('../../../assets/images/tools/tiangongtracker.png')} onPress={() => navigation.navigate(routes.satellitesTrackers.details.path, {noradId: BASE_NORAD_IDS.CSS})} isPremium />
        </View>
        <ScreenInfo image={require('../../../assets/icons/FiIss.png')} text={i18n.t('satelliteTrackers.home.info')} />
      </ScrollView>
    </View>
  )
}