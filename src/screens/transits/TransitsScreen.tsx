import React, {useEffect} from 'react'
import { View, ScrollView } from 'react-native'
import { i18n } from '../../helpers/scripts/i18n'
import { globalStyles } from '../../styles/global'
import PageTitle from '../../components/commons/PageTitle'
import ToolButton from '../../components/commons/buttons/ToolButton'
import ScreenInfo from '../../components/ScreenInfo'
import {routes} from "../../helpers/routes";
import {useAuth} from "../../contexts/AuthContext";
import {isProUser} from "../../helpers/scripts/auth/checkUserRole";
import ProLocker from "../../components/cards/ProLocker";
import {useSettings} from "../../contexts/AppSettingsContext";
import {useTranslation} from "../../hooks/useTranslation";
import {sendAnalyticsEvent} from "../../helpers/scripts/analytics";
import {eventTypes} from "../../helpers/constants/analytics";

export default function TransitsScreen({ navigation }: any) {

  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Transits screen view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, []);

  const handleAnalytics = (user: any, location: any, action: string, type: string, params: object, locale: string) => {
    sendAnalyticsEvent(user, location, action, type, params, locale);
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('home.buttons.transits.title')}
        subtitle={i18n.t('home.buttons.transits.subtitle')}
        backRoute={routes.home.path}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View>
          <ToolButton
            disabled={!isProUser(currentUser)}
            isPremium={!isProUser(currentUser)}
            targetScreen={routes.transits.planetary.path}
            navigation={navigation}
            text={i18n.t('transits.planetaryConjunction.title')}
            subtitle={i18n.t('transits.planetaryConjunction.subtitle')}
            image={require('../../../assets/images/tools/conjunction.png')}
            onPress={() => handleAnalytics(currentUser, currentUserLocation, 'Planetary conjunctions', eventTypes.BUTTON_CLICK, {}, currentLocale)}
          />
          <ToolButton
            disabled={!isProUser(currentUser)}
            isPremium={!isProUser(currentUser)}
            targetScreen={routes.transits.eclipses.solar.path}
            navigation={navigation}
            text={i18n.t('transits.solarEclipse.title')}
            subtitle={i18n.t('transits.solarEclipse.subtitle')}
            image={require('../../../assets/images/tools/solareclipse.png')}
            onPress={() => handleAnalytics(currentUser, currentUserLocation, 'Solar eclipses', eventTypes.BUTTON_CLICK, {}, currentLocale)}
          />
          <ToolButton
            disabled={!isProUser(currentUser)}
            isPremium={!isProUser(currentUser)}
            targetScreen={routes.transits.eclipses.lunar.path}
            navigation={navigation}
            text={i18n.t('transits.lunarEclipse.title')}
            subtitle={i18n.t('transits.lunarEclipse.subtitle')}
            image={require('../../../assets/images/tools/lunareclipse.png')}
            onPress={() => handleAnalytics(currentUser, currentUserLocation, 'Lunar eclipses', eventTypes.BUTTON_CLICK, {}, currentLocale)}
          />
          {/*<ToolButton disabled isPremium navigation={navigation} text={i18n.t('transits.issTransit.title')} subtitle={i18n.t('transits.issTransit.subtitle')} image={require('../../../assets/images/tools/isstransit.png')} />*/}
          {
            !isProUser(currentUser) &&
            <ProLocker navigation={navigation} image={require('../../../assets/images/tools/solareclipse.png')} darker multipleFeatures/>
          }
          <ScreenInfo text={i18n.t('transits.info')} image={require("../../../assets/icons/FiTransit.png")} />
        </View>
      </ScrollView>
    </View>
  )
}
