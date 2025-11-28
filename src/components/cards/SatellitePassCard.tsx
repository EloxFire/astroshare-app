import React, {useEffect, useMemo, useState} from 'react'
import {Image, Text, View} from 'react-native'
import { satellitePassCardStyles } from '../../styles/components/cards/satellitePassCard'
import dayjs from 'dayjs';
import {weatherImages} from "../../helpers/scripts/loadImages";
import {determineIssVisibility} from "../../helpers/scripts/astro/determineIssVisibility";
import {i18n} from "../../helpers/scripts/i18n";
import { SatellitePass } from '../../helpers/types/IssPass';
import SimpleButton from '../commons/buttons/SimpleButton';
import { app_colors, storageKeys } from '../../helpers/constants';
import { scheduleLocalNotification, unScheduleNotification } from '../../helpers/scripts/notifications/scheduleLocalNotification';
import { isLocalNotificationPlanned, deleteLocalNotificationRecord } from '../../helpers/scripts/notifications/checkPlannedLocalNOtifications';
import { getData, storeData } from '../../helpers/storage';
import { showToast } from '../../helpers/scripts/showToast';

interface SatellitePassCardProps {
  satname: string;
  pass: SatellitePass;
  passIndex: number;
  navigation: any;
  weather: any;
}

export default function SatellitePassCard({ satname, pass, passIndex, navigation, weather }: SatellitePassCardProps) {

  const [passLength, setPassLength] = useState<string>('')
  const [isWeatherAccurate, setIsWeatherAccurate] = useState<boolean>(false)
  const [visibilityBadge, setVisibilityBadge] = useState<any>({})
  const [passWeatherIndex, setPassWeatherIndex] = useState<number>(0)
  const [isNotificationPlanned, setIsNotificationPlanned] = useState<boolean>(false)

  const notificationStorageKey = useMemo(() => {
    const safeSatname = satname.replace(/[^a-zA-Z0-9_-]/g, '_')
    return `${storageKeys.notifications.satellitePrefix}${safeSatname}_${pass.startUTC}`
  }, [satname, pass.startUTC])


  useEffect(() => {
    const weatherDateLimit = dayjs().add(6, 'days').unix()
    const weatherAccurate = dayjs.unix(pass.startUTC).isBefore(dayjs.unix(weatherDateLimit))
    setIsWeatherAccurate(weatherAccurate)

    if(weatherAccurate){
      const weatherIndex = weather.findIndex((w: any) => dayjs.unix(w.dt).isSame(dayjs.unix(pass.startUTC), 'day'))
      setPassWeatherIndex(weatherIndex)
    }
  }, []);

  useEffect(() => {
    if(passIndex <= 6){
      const badge = determineIssVisibility(pass.maxEl, weather[passIndex]?.weather[0].icon, pass.startUTC)
      setVisibilityBadge(badge)
    }
  }, [weather]);

  useEffect(() => {
    (async () => {
      const planned = await isLocalNotificationPlanned(notificationStorageKey)
      setIsNotificationPlanned(planned)
    })()
  }, [notificationStorageKey]);

  const handleNotification = async () => {
    const passDate = dayjs.unix(pass.startUTC)
    const notificationDate = passDate.subtract(5, 'minutes')

    if(isNotificationPlanned){
      const notificationId = await getData(notificationStorageKey)
      if(notificationId){
        await unScheduleNotification(notificationId)
      }
      await deleteLocalNotificationRecord(notificationStorageKey)
      setIsNotificationPlanned(false)
      showToast({message: i18n.t('notifications.successRemove'), type: 'success', duration: 4000})
      return
    }

    if(notificationDate.isBefore(dayjs())){
      showToast({message: i18n.t('notifications.satellitePass.tooSoon'), type: 'error'})
      return
    }

    const notif = await scheduleLocalNotification({
      title: i18n.t('notifications.satellitePass.title', { satname }),
      body: i18n.t('notifications.satellitePass.body', { satname, time: passDate.format('HH:mm') }),
      data: { satname, pass },
      date: notificationDate.toDate(),
    })

    if(notif){
      await storeData(notificationStorageKey, notif)
      setIsNotificationPlanned(true)
      showToast({message: i18n.t('notifications.successSchedule'), type: 'success', duration: 4000})
    }
  }

  return (
    <View style={satellitePassCardStyles.card}>
      <View style={satellitePassCardStyles.card.conditions}>
        {
          !isWeatherAccurate ?
            <Image style={satellitePassCardStyles.card.conditions.icon} source={require('../../../assets/icons/FiIss.png')}/>
            :
            <Image style={satellitePassCardStyles.card.conditions.icon} source={isWeatherAccurate ? weatherImages[weather[passWeatherIndex]?.weather[0].icon] : require('../../../assets/icons/FiIss.png')}/>
        }
      </View>

      <View style={satellitePassCardStyles.card.infos}>
        <View style={satellitePassCardStyles.column}>
          <Text style={satellitePassCardStyles.column.title}>{i18n.t('satelliteTrackers.details.passCard.magnitude')}</Text>
          <Text style={satellitePassCardStyles.column.value}>{pass.mag !== 100000 ? pass.mag : 'N/A'}</Text>
          <Text style={[satellitePassCardStyles.column.title, {marginTop: 5}]}>{i18n.t('satelliteTrackers.details.passCard.direction')}</Text>
          <Text style={satellitePassCardStyles.column.value}>{pass.startAzCompass}</Text>
        </View>
        <View style={satellitePassCardStyles.column}>
          <Text style={satellitePassCardStyles.column.title}>{i18n.t('satelliteTrackers.details.passCard.time')}</Text>
          <Text style={satellitePassCardStyles.column.value}>{dayjs.unix(pass.startUTC).format('HH:mm')}</Text>
          <Text style={[satellitePassCardStyles.column.title, {marginTop: 5}]}>{i18n.t('satelliteTrackers.details.passCard.maxAltitude')}</Text>
          <Text style={satellitePassCardStyles.column.value}>{pass.maxEl}°</Text>
        </View>

        <View style={satellitePassCardStyles.column}>
          <SimpleButton
            icon={isNotificationPlanned ? require('../../../assets/icons/FiBellOff.png') : require('../../../assets/icons/FiBell.png')}
            backgroundColor={app_colors.white}
            iconColor={app_colors.black}
            textColor={app_colors.black}
            align={'center'}
            onPress={() => handleNotification()}
          />
        </View>
      </View>
    </View>
  )
}
