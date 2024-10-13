import React, {ReactNode, useEffect, useState} from 'react'
import {Image, ScrollView, Text, TouchableOpacity, View} from 'react-native'
import {globalStyles} from "../../styles/global";
import {i18n} from "../../helpers/scripts/i18n";
import {launchDetailsStyles} from "../../styles/screens/launches/launchDetails";
import {truncate} from "../../helpers/scripts/utils/formatters/truncate";
import {getLaunchStatusColor} from "../../helpers/scripts/launches/getLaunchStatusColor";
import {getData, removeData, storeData} from "../../helpers/storage";
import dayjs from "dayjs";
import DSOValues from "../../components/commons/DSOValues";
import PageTitle from "../../components/commons/PageTitle";
import {scheduleNotification, unScheduleNotification} from "../../helpers/scripts/notifications/sendNotification";
import {showToast} from "../../helpers/scripts/showToast";
import {getTimeFromLaunch} from "../../helpers/scripts/utils/getTimeFromLaunch";

interface LaunchCardProps {
  route: any
  navigation: any
}

export default function LaunchDetails({ route, navigation }: LaunchCardProps): ReactNode {

  const { launch } = route.params;
  const [isNotificationPlanned, setIsNotificationPlanned] = useState(false);
  const [countdown, setCountdown] = useState<string>('00:00:00:00') // DD:HH:mm:ss

  useEffect(() => {
    if(launch) {
      checkAsNotificationPlanned();
    }
  }, [launch])

  const checkAsNotificationPlanned = async () => {
    // Check if a storage key for this launch exists already
    const notificationKey = await getData(`notification_${launch.id}`);
    if(notificationKey) {
      setIsNotificationPlanned(true);
    }
  }

  useEffect(() => {
    setCountdown(getTimeFromLaunch(dayjs(launch.net).toDate()))

    const interval = setInterval(() => {
      setCountdown(getTimeFromLaunch(dayjs(launch.net).toDate()))
    }, 1000)

    return () => clearInterval(interval)
  }, [launch])


  const handleNotification = async () => {
    if(isNotificationPlanned){
      // Remove notification
      const notificationId = await getData(`notification_${launch.id}`)
      if(notificationId){
        await unScheduleNotification(notificationId)
        await removeData(`notification_${launch.id}`)
        setIsNotificationPlanned(false)
        showToast({message: i18n.t('notifications.successRemove'), type: 'success', duration: 4000})
      }
    } else {
      // Add notification
      const notif = await scheduleNotification({
        title: i18n.t('notifications.launches.title', {timeTo: countdown}),
        body: i18n.t('notifications.launches.body', {launch_name: launch.name}),
        data: launch,
        date: dayjs(launch.net).subtract(1, 'hour').toDate()
      })

      if(notif){
        setIsNotificationPlanned(true)
        await storeData(`notification_${launch.id}`, notif)
        showToast({message: i18n.t('notifications.successSchedule'), type: 'success', duration: 4000})
      }
    }
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('launchesScreen.details.title')}
        subtitle={i18n.t('launchesScreen.details.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={launchDetailsStyles.content}>
          <View style={launchDetailsStyles.content.mainCard}>
            <Image style={launchDetailsStyles.content.mainCard.thumbnail} resizeMode='cover' source={{uri: launch.image.image_url}} />
            <View style={launchDetailsStyles.content.mainCard.body}>
              <Text style={launchDetailsStyles.content.mainCard.body.title}>{launch.name.split('|')[0].trim()}</Text>
              <View style={launchDetailsStyles.content.mainCard.body.subtitleContainer}>
                <Text style={launchDetailsStyles.content.mainCard.body.subtitleContainer.subtitle}>Mission : </Text>
                <Text style={launchDetailsStyles.content.mainCard.body.subtitleContainer.subtitle_text}>{launch.name.split('|')[1].trim()}</Text>
              </View>
              <View style={[launchDetailsStyles.content.mainCard.body.subtitleContainer, {marginBottom: 20}]}>
                <Text style={launchDetailsStyles.content.mainCard.body.subtitleContainer.subtitle}>T- </Text>
                <Text style={launchDetailsStyles.content.mainCard.body.subtitleContainer.subtitle_text}>{countdown}</Text>
              </View>
              <DSOValues title={`${i18n.t('launchesScreen.launchCards.date')} ${launch.status.id === 2 || launch.status.id === 8 ? i18n.t('launchesScreen.launchCards.temporary') : ""}`} value={dayjs(launch.net).format("DD MMM YYYY")} />
              <DSOValues title={`T-0`} value={`${dayjs(launch.net).format("HH:mm:ss").replace(':', 'h').replace(':', 'm')}s`} />
              <DSOValues title={i18n.t('launchesScreen.launchCards.launcher')} value={launch.rocket.configuration.full_name} />
              <DSOValues title={i18n.t('launchesScreen.launchCards.operator')} value={launch.launch_service_provider.name.length > 30 ? launch.launch_service_provider.abbrev : truncate(launch.launch_service_provider.name, 30)} />
              <DSOValues title={i18n.t('launchesScreen.launchCards.launchPad')} value={truncate(launch.pad.name, 30)} />
              <DSOValues title={i18n.t('launchesScreen.launchCards.client')} value={launch.mission.agencies.length > 0 ? launch.mission.agencies[0].name.length > 30 ? launch.mission.agencies[0].abbrev : truncate(launch.mission.agencies[0].name, 30) : i18n.t('common.errors.unknown') } />
              <View style={launchDetailsStyles.content.mainCard.body.statusContainer}>
                <DSOValues title={i18n.t('launchesScreen.details.status')} value={launch.status.name} wideChip chipValue chipColor={getLaunchStatusColor(launch.status.id).backgroundColor} chipForegroundColor={getLaunchStatusColor(launch.status.id).textColor} />
              </View>
              {
                launch.status.id === 1 &&
                  <View style={launchDetailsStyles.content.notificationButtonContainer}>
                      <TouchableOpacity style={launchDetailsStyles.content.notificationButtonContainer.button} onPress={() => handleNotification()}>
                        {
                          isNotificationPlanned ?
                            <Image source={require('../../../assets/icons/FiBellOff.png')} style={launchDetailsStyles.content.notificationButtonContainer.button.image} />
                            :
                            <Image source={require('../../../assets/icons/FiBell.png')} style={launchDetailsStyles.content.notificationButtonContainer.button.image} />
                        }
                          <Text style={launchDetailsStyles.content.notificationButtonContainer.button.text}>{isNotificationPlanned ? i18n.t('launchesScreen.details.notificationButton.remove') : i18n.t('launchesScreen.details.notificationButton.add')}</Text>
                      </TouchableOpacity>
                  </View>
              }
            </View>
          </View>

          {
            launch.mission &&
              <View style={launchDetailsStyles.content.missionCard}>
                  <Text style={launchDetailsStyles.content.missionCard.title}>{i18n.t('launchesScreen.details.mission.title')}</Text>
                  <DSOValues title={i18n.t('launchesScreen.details.mission.name')} value={launch.mission.name}/>
                  <DSOValues title={i18n.t('launchesScreen.details.mission.type')} value={launch.mission.type}/>
                  <DSOValues title={i18n.t('launchesScreen.details.mission.flightProfile')} value={launch.mission.orbit.name}/>
                  <Text style={launchDetailsStyles.content.missionCard.subtitle}>{i18n.t('launchesScreen.details.mission.description')}</Text>
                  <Text style={launchDetailsStyles.content.missionCard.description}>{launch.mission.description}</Text>
              </View>
          }

          {
            launch.program.length > 0 &&
              <View style={launchDetailsStyles.content.programCard}>
                  <Text style={launchDetailsStyles.content.programCard.title}>{i18n.t('launchesScreen.details.program.title')}</Text>
                  <DSOValues title={i18n.t('launchesScreen.details.program.name')} value={launch.program[0].name}/>
                  <DSOValues title={i18n.t('launchesScreen.details.program.start')} value={dayjs(launch.program[0].start_date).format('DD/MM/YYYY')}/>
                  <DSOValues title={i18n.t('launchesScreen.details.program.founder')} value={launch.program[0].agencies[0].name.length > 30 ? launch.program[0].agencies[0].abbrev : launch.program[0].agencies[0].name}/>

                  <Text style={launchDetailsStyles.content.programCard.subtitle}>{i18n.t('launchesScreen.details.program.description')}</Text>
                  <Text style={launchDetailsStyles.content.programCard.description}>{launch.program[0].description}</Text>
              </View>
          }

        </View>
      </ScrollView>
    </View>
  )
}
