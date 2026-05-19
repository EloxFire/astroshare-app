import React, { useEffect } from "react";
import { useSettings } from "../../contexts/AppSettingsContext";
import { useAuth } from "../../contexts/AuthContext";
import { useTranslation } from "../../hooks/useTranslation";
import { eventTypes } from "../../helpers/constants/analytics";
import { sendAnalyticsEvent } from "../../helpers/scripts/analytics";
import { ScrollView, View } from "react-native";
import { globalStyles } from "../../styles/global";
import { i18n } from "../../helpers/scripts/i18n";
import { detailedMoonMapScreenStyles } from "../../styles/screens/skymap/detailedMoonMapScreen";
import PageTitle from "../../components/commons/PageTitle";
import ScreenInfo from "../../components/ScreenInfo";

export const DetailedMoonMapScreen = ({navigation}: any) => {

  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'detailed_moon_map_screen_view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, [])

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('skymap.moon.title')}
        subtitle={i18n.t('skymap.moon.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView style={detailedMoonMapScreenStyles.content}>
        <View style={detailedMoonMapScreenStyles.content.scene}>
        </View>
        <ScreenInfo image={require('../../../assets/icons/FiCompass.png')} text={i18n.t('skymap.moon.info')} />
      </ScrollView>
    </View>
  )
}
