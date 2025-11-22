import React, {useEffect, useState} from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
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
import DisclaimerBar from '../../components/banners/DisclaimerBar'
import SimpleButton from '../../components/commons/buttons/SimpleButton'
import { storageKeys } from '../../helpers/constants'
import BigButton from '../../components/commons/buttons/BigButton'
import { getObject, storeObject } from '../../helpers/storage'
import { Satellite } from '../../helpers/types/satellites/Satellite'
import { useIsFocused } from '@react-navigation/native'

export default function SatelliteTracker({ navigation }: any) {

  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()
  const isFocused = useIsFocused();

  const [userSatList, setUserSatList] = useState<Array<Satellite>>([])

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Satellite tracker screen view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, []);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    (async () => {
      const storedList = await getObject(storageKeys.satellites.customNoradList);
      console.log("Stored custom NORAD list:", storedList);

      if (storedList) {
        const parsedList = (typeof storedList === 'string' ? JSON.parse(storedList) : storedList) as Array<Satellite>;
        setUserSatList(parsedList);
      } else {
        setUserSatList([]);
      }
    })()
  }, [isFocused])

  const handleRemoveSatellite = async (satelliteId: number) => {
    const updatedList = userSatList.filter((satellite) => satellite.norad_id !== satelliteId);
    setUserSatList(updatedList);
    await storeObject(storageKeys.satellites.customNoradList, JSON.stringify(updatedList));
  }

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
        <DisclaimerBar message={i18n.t('satelliteTrackers.home.disclaimer')} type='info'/>
        <View style={{ paddingBottom: 80 }}>
          <View style={satelliteTrackerHomeStyles.buttons}>
            <ToolButton text={i18n.t('satelliteTrackers.home.buttons.25544.title', {name: KNOWN_NORAD_IDS[25544 as keyof typeof KNOWN_NORAD_IDS]})} subtitle={i18n.t('satelliteTrackers.home.buttons.25544.subtitle')} image={require('../../../assets/images/tools/isstracker.png')} onPress={() => navigation.navigate(routes.satellitesTrackers.details.path, {noradId: BASE_NORAD_IDS.ISS})} />
            <ToolButton disabled text={i18n.t('satelliteTrackers.home.buttons.starlink.title')} subtitle={i18n.t('satelliteTrackers.home.buttons.starlink.subtitle')} image={require('../../../assets/images/tools/starlinktracker.png')} onPress={() => navigation.navigate(routes.satellitesTrackers.details.path, {noradId: null})} />
            <ToolButton text={i18n.t('satelliteTrackers.home.buttons.48274.title', {name: KNOWN_NORAD_IDS[48274 as keyof typeof KNOWN_NORAD_IDS]})} subtitle={i18n.t('satelliteTrackers.home.buttons.48274.subtitle')} image={require('../../../assets/images/tools/tiangongtracker.png')} onPress={() => navigation.navigate(routes.satellitesTrackers.details.path, {noradId: BASE_NORAD_IDS.CSS})} />
          </View>
          <View style={satelliteTrackerHomeStyles.addContainer}>
            <Text style={satelliteTrackerHomeStyles.addContainer.title}>Mes satellites personnalisés</Text>
            <BigButton
              disabled={!isProUser(currentUser)}
              text={i18n.t('satelliteTrackers.home.buttons.custom.title')}
              subtitle={i18n.t('satelliteTrackers.home.buttons.custom.subtitle')}
              onPress={() => navigation.navigate(routes.satellitesTrackers.addCustomSatellite.path)}
              icon={require('../../../assets/icons/FiPlus.png')}
              isPremium={!isProUser(currentUser)}
            />
            {
              userSatList.length > 0 && (
                <>
                  {userSatList.map((satellite: Satellite) => (
                    <View key={satellite.norad_id} style={satelliteTrackerHomeStyles.addContainer.customSatelliteRow}>
                      <View style={{ flex: 1 }}>
                        <ToolButton
                          disabled={!isProUser(currentUser)}
                          text={i18n.t('satelliteTrackers.home.buttons.customSatellite.title', {name: satellite.object_name})}
                          subtitle={i18n.t('satelliteTrackers.home.buttons.customSatellite.subtitle', {noradId: satellite.norad_id})}
                          image={require('../../../assets/images/tools/satellitesconstellation.png')}
                          onPress={() => navigation.navigate(routes.satellitesTrackers.details.path, {noradId: satellite.norad_id})}
                        />
                      </View>
                      <TouchableOpacity
                        disabled={!isProUser(currentUser)}
                        onPress={() => handleRemoveSatellite(satellite.norad_id)}
                        style={satelliteTrackerHomeStyles.addContainer.deleteButton}
                        accessibilityRole="button"
                        accessibilityLabel={i18n.t('satelliteTrackers.home.buttons.customSatellite.deleteLabel', { noradId: satellite.norad_id })}
                      >
                        <Image
                          source={require('../../../assets/icons/FiTrash.png')}
                          style={satelliteTrackerHomeStyles.addContainer.deleteIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </>
              )
            }
          </View>
          <ScreenInfo image={require('../../../assets/icons/FiIss.png')} text={i18n.t('satelliteTrackers.home.info')} />
        </View>
      </ScrollView>
    </View>
  )
}
