import React, {ReactNode, useEffect, useState} from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { globalStyles } from "../../styles/global";
import { i18n } from "../../helpers/scripts/i18n";
import { launcheScreenStyles } from "../../styles/launches/launches";
import { app_colors, storageKeys } from "../../helpers/constants";
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
import { subscribeToAllLaunches, unsubscribeFromAllLaunches } from "../../helpers/api/notifications";
import { getData, removeData, storeData } from "../../helpers/storage";
import { showToast } from "../../helpers/scripts/showToast";

export default function LaunchesScreen({ navigation }: any) {

  const {launchData, launchContextLoading, launchDataLastUpdate} = useLaunchData()
  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()
  const [launchNotificationsEnabled, setLaunchNotificationsEnabled] = useState<boolean>(false)
  const [launchNotificationLoading, setLaunchNotificationLoading] = useState<boolean>(false)

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Launches screen view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, []);

  useEffect(() => {
    (async () => {
      const stored = await getData(storageKeys.notifications.launchesAll)
      setLaunchNotificationsEnabled(!!stored)
    })()
  }, [])

  const handleLaunchNotifications = async () => {
    if (launchNotificationLoading) return

    setLaunchNotificationLoading(true)
    try {
      if (!launchNotificationsEnabled) {
        const subscribed = await subscribeToAllLaunches({
          locale: currentLocale,
          userId: currentUser?.uid,
        })

        if (subscribed) {
          await storeData(storageKeys.notifications.launchesAll, '1')
          setLaunchNotificationsEnabled(true)
          showToast({ message: i18n.t('common.notifications.launchesSubscribed'), type: 'success' })
        } else {
          showToast({ message: i18n.t('common.notifications.pushTokenError'), type: 'error' })
        }
      } else {
        const unsubscribed = await unsubscribeFromAllLaunches({
          userId: currentUser?.uid,
        })

        if (unsubscribed) {
          await removeData(storageKeys.notifications.launchesAll)
          setLaunchNotificationsEnabled(false)
          showToast({ message: i18n.t('common.notifications.launchesUnsubscribed'), type: 'success' })
        } else {
          showToast({ message: i18n.t('common.notifications.pushTokenError'), type: 'error' })
        }
      }
    } catch (error) {
      console.log('[Notifications] Error toggling launch notifications', error)
    } finally {
      setLaunchNotificationLoading(false)
    }
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('home.buttons.launches_screen.title')}
        subtitle={i18n.t('home.buttons.launches_screen.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={{ paddingHorizontal: 20, marginTop: 5 }}>
          <SimpleButton
            text={launchNotificationsEnabled ? i18n.t('launchesScreen.notifications.unsubscribeAll') : i18n.t('launchesScreen.notifications.subscribeAll')}
            onPress={() => handleLaunchNotifications()}
            disabled={launchNotificationLoading}
            fullWidth
            align={'center'}
          />
        </View>
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
