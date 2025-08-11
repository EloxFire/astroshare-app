import React, {ReactNode, useEffect} from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { globalStyles } from "../../styles/global";
import { i18n } from "../../helpers/scripts/i18n";
import { launcheScreenStyles } from "../../styles/launches/launches";
import { app_colors } from "../../helpers/constants";
import { useLaunchData } from "../../contexts/LaunchContext";
import SimpleButton from "../../components/commons/buttons/SimpleButton";
import PageTitle from "../../components/commons/PageTitle";
import LaunchCard from "../../components/cards/LaunchCard";
import {useSettings} from "../../contexts/AppSettingsContext";
import {useAuth} from "../../contexts/AuthContext";
import {useTranslation} from "../../hooks/useTranslation";
import {sendAnalyticsEvent} from "../../helpers/scripts/analytics";
import {eventTypes} from "../../helpers/constants/analytics";
import {LaunchData} from "../../helpers/types/LaunchData";

export default function LaunchesScreen({ navigation }: any) {

  const {launchData, launchContextLoading, launchDataLastUpdate} = useLaunchData()
  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Launches screen view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, []);

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('home.buttons.launches_screen.title')}
        subtitle={i18n.t('home.buttons.launches_screen.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <Text style={launcheScreenStyles.content.lastUpdateText}>{i18n.t('launchesScreen.lastUpdate', {lastUpdate: launchDataLastUpdate.fromNow()})}</Text>
        <View style={launcheScreenStyles.content}>
          {
            !launchContextLoading ?
              launchData.length > 0 ?
              launchData.map((launch: LaunchData, index: number): ReactNode => (
                  <LaunchCard key={index} launch={launch} navigation={navigation} />
                ))
                :
                <SimpleButton disabled text={i18n.t('launchesScreen.launchCards.noLaunches')}/>
            :
            <ActivityIndicator size="large" color={app_colors.white} />
          }
        </View>
      </ScrollView>
    </View>
  );
}
