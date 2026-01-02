import React, {useEffect} from 'react'
import {View, ScrollView, StatusBar} from 'react-native'
import { routes } from '../../helpers/routes'
import { i18n } from '../../helpers/scripts/i18n'
import { globalStyles } from '../../styles/global'
import { satelliteTrackerHomeStyles } from '../../styles/screens/satelliteTracker/home'
import ToolButton from '../../components/commons/buttons/ToolButton'
import PageTitle from '../../components/commons/PageTitle'
import ScreenInfo from '../../components/ScreenInfo'
import { useSettings } from '../../contexts/AppSettingsContext'
import {useStarCatalog} from "../../contexts/StarsContext";
import DisclaimerBar from "../../components/banners/DisclaimerBar";
import {useAuth} from "../../contexts/AuthContext";
import {useTranslation} from "../../hooks/useTranslation";
import {sendAnalyticsEvent} from "../../helpers/scripts/analytics";
import {eventTypes} from "../../helpers/constants/analytics";
import { isProUser } from '../../helpers/scripts/auth/checkUserRole'
import { useDsoCatalog } from '../../contexts/DSOContext'

export default function SkyMapSelection({ navigation }: any) {

  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()
  const { starCatalogLoading, starsLoaded, starsTotal, starsLoadedPercentage } = useStarCatalog();
  const { dsoCatalogLoading } = useDsoCatalog();

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Skymap selection screen view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, []);

  const handleToolButtonPress = (route: string) => {
    sendAnalyticsEvent(currentUser, currentUserLocation, `Selecting`, eventTypes.BUTTON_CLICK, {}, currentLocale);
    navigation.navigate(route);
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('home.buttons.skymap_generator.title')}
        subtitle={i18n.t('home.buttons.skymap_generator.subtitle')}
        backRoute={routes.home.path}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        {
          starCatalogLoading && (
            <DisclaimerBar message={`Chargement du catalogue d'étoiles en cours... Merci de patienter (${starsLoaded}/${starsTotal}) ${starsLoadedPercentage}%`} type={"info"} />
          )
        }
        <View style={satelliteTrackerHomeStyles.buttons}>
          <ToolButton
            disabled={starCatalogLoading}
            text={i18n.t('skymap.buttons.flatmap.title')}
            subtitle={i18n.t('skymap.buttons.flatmap.subtitle')}
            image={require('../../../assets/images/tools/skymap.png')}
            onPress={() => navigation.navigate(routes.skymaps.flatmap.path)}
          />
          <ToolButton
            disabled={starCatalogLoading || dsoCatalogLoading}
            text={i18n.t('skymap.buttons.planetarium.title')}
            subtitle={i18n.t('skymap.buttons.planetarium.subtitle')}
            image={require('../../../assets/images/tools/skymap.png')}
            onPress={() => navigation.navigate(routes.skymaps.planetarium.path)}
          />
          <ToolButton
            disabled
            isPremium
            text={i18n.t('skymap.buttons.constellations.title')}
            subtitle={i18n.t('skymap.buttons.constellations.subtitle')}
            image={require('../../../assets/images/tools/skymap.png')}
            onPress={() => navigation.navigate(routes.skymaps.constellations.path)}
          />
        </View>
        <ScreenInfo image={require('../../../assets/icons/FiCompass.png')} text={i18n.t('skymap.info')} />
      </ScrollView>
    </View>
  )
}
