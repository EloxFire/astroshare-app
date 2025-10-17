import React, { useEffect, useState } from 'react'
import {ActivityIndicator, Image, ScrollView, Text, View, StyleSheet} from 'react-native'
import { globalStyles } from '../styles/global'
import { moonPhasesStyles } from '../styles/screens/moonPhases'
import {
  GeographicCoordinate,
} from '@observerly/astrometry'
import { useSettings } from '../contexts/AppSettingsContext'
import dayjs, {Dayjs} from 'dayjs'
import PageTitle from '../components/commons/PageTitle'
import { i18n } from '../helpers/scripts/i18n'
import {useTranslation} from "../hooks/useTranslation";
import {ComputedMoonInfos} from "../helpers/types/objects/ComputedMoonInfos";
import {computeMoon} from "../helpers/scripts/astro/objects/computeMoon";
import VisibilityGraph from "../components/graphs/VisibilityGraph";
import {formatDays, formatKm} from "../helpers/scripts/utils/formatters/formaters";
import {astroshareApi} from "../helpers/api";
import {app_colors} from "../helpers/constants";
import {capitalize} from "../helpers/scripts/utils/formatters/capitalize";
import DisclaimerBar from "../components/banners/DisclaimerBar";
import {useAuth} from "../contexts/AuthContext";
import {sendAnalyticsEvent} from "../helpers/scripts/analytics";
import {eventTypes} from "../helpers/constants/analytics";
import {routes} from "../helpers/routes";
import SimpleButton from '../components/commons/buttons/SimpleButton'
import DateTimePicker from '@react-native-community/datetimepicker';

export default function MoonPhases({ navigation }: any) {

  const { currentUserLocation } = useSettings()
  const {currentLocale, currentLCID} = useTranslation()
  const { currentUser } = useAuth()
  dayjs().locale(currentLocale)

  const [moonData, setMoonData] = useState<ComputedMoonInfos | null>(null)
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [moonImageUrl, setMoonImageUrl] = useState<undefined | {uri: string }>(undefined)
  const [currentMonth, setCurrentMonth] = useState(dayjs().month())
  const [calendarImages, setCalendarImages] = useState<any>([])

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs())

  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Moon Phases screen view', eventTypes.SCREEN_VIEW, {currentMonth: currentMonth}, currentLocale)
  }, []);

  useEffect(() => {
    const date = selectedDate.toDate()
    const observer: GeographicCoordinate = {latitude: currentUserLocation.lat, longitude: currentUserLocation.lon}
    const data: ComputedMoonInfos = computeMoon({date: date, observer})
    setMoonData(data)
    fetchMoonImage()
  }, [currentUserLocation, selectedDate]);

  // useEffect(() => {
  //   setCurrentDate(dayjs())

  //   const interval = setInterval(() => {
  //     setCurrentDate(dayjs())
  //   }, 1000)

  //   return () => {
  //     clearInterval(interval)
  //   }
  // }, [])

  useEffect(() => {
    (async () => {
      await fetchCalendarImages(currentMonth)
    })()
  }, [currentMonth]);

  const fetchMoonImage = async () => {
    const response = await astroshareApi.get('/moon/illustration?date=2020-05-05')
    setMoonImageUrl({uri: response.data.url})
  }

  const handleMonthChange = (direction: 'next' | 'previous') => {
    if (direction === 'next') {
      setCurrentMonth(currentMonth + 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  const fetchCalendarImages = async (month: number) => {
    const response = await astroshareApi.get(`/moon/illustration/month?year=2020&month=05`)
    setCalendarImages(response.data.images)
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title={i18n.t('home.buttons.moon_phases.title')} subtitle={i18n.t('home.buttons.moon_phases.subtitle')} backRoute={routes.home.path} />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={[moonPhasesStyles.content, {marginBottom: 0}]}>
          <View style={moonPhasesStyles.content.header}>
            <View style={moonPhasesStyles.content.header.transitCard}>
              <Image source={require('../../assets/icons/FiMoonrise.png')} style={moonPhasesStyles.content.header.transitCard.icon} />
              {moonData ? <Text style={moonPhasesStyles.content.header.transitCard.text}>{moonData.visibility.objectNextRise}</Text> : <ActivityIndicator size={"small"} />}
            </View>
            <View>
              <Text style={moonPhasesStyles.content.header.transitCard.date}>{currentDate.format('DD MMMM YYYY')}</Text>
              <Text style={moonPhasesStyles.content.header.transitCard.text}>{currentDate.format('HH:mm:ss')}</Text>
            </View>
            <View style={moonPhasesStyles.content.header.transitCard}>
              <Image source={require('../../assets/icons/FiMoonset.png')} style={moonPhasesStyles.content.header.transitCard.icon} />
              {moonData ? <Text style={moonPhasesStyles.content.header.transitCard.text}>{moonData.visibility.objectNextSet}</Text> : <ActivityIndicator size={"small"} />}
            </View>
          </View>
          {
            moonData && (
              <>
                <View style={moonPhasesStyles.content.body}>
                  <SimpleButton
                    icon={require('../../assets/icons/FiCalendar.png')}
                    text={selectedDate.format('DD MMMM YYYY')}
                    textColor={app_colors.white}
                    active
                    activeBorderColor={app_colors.white_twenty}
                    onPress={() => setShowDatePicker(true)}
                  />
                  {
                    showDatePicker &&
                    <DateTimePicker
                      value={selectedDate.toDate()}
                      mode="date"
                      display="default"
                      onChange={(event, selected) => {
                        console.log('selected', event, selected);
                      }}
                    />
                  }
                  <Text style={moonPhasesStyles.content.body.phaseTitle}>{moonData.data.phase}</Text>
                  { !moonImageUrl ? <ActivityIndicator size={"large"} color={app_colors.white} /> : <Image source={moonImageUrl} style={moonPhasesStyles.content.body.icon}/> }
                  {/*MOON PHASE HERE*/}
                  <View style={moonPhasesStyles.content.body.infos}>
                    <View>
                      <Text style={moonPhasesStyles.content.body.infos.info.label}>{i18n.t('moonPhases.pills.illumination')}</Text>
                      <Text style={moonPhasesStyles.content.body.infos.info.value}>{moonData.data.illumination.toFixed((2))}%</Text>
                    </View>
                    <View>
                      <Text style={moonPhasesStyles.content.body.infos.info.label}>{i18n.t('moonPhases.pills.age')}</Text>
                      <Text style={moonPhasesStyles.content.body.infos.info.value}>{formatDays(moonData.data.age, currentLCID)}</Text>
                    </View>
                    <View>
                      <Text style={moonPhasesStyles.content.body.infos.info.label}>{i18n.t('moonPhases.pills.distance')}</Text>
                      <Text style={moonPhasesStyles.content.body.infos.info.value}>{formatKm(moonData.data.distance, currentLCID)}</Text>
                    </View>
                  </View>
                  <View style={moonPhasesStyles.content.body.infos}>
                    <View>
                      <Text style={moonPhasesStyles.content.body.infos.info.label}>{i18n.t('moonPhases.pills.full_moon')}</Text>
                      <Text style={moonPhasesStyles.content.body.infos.info.value}>{dayjs(moonData.data.nextFullMoon).format('DD MMMM')}</Text>
                    </View>
                    <View>
                      <Text style={moonPhasesStyles.content.body.infos.info.label}>{i18n.t('moonPhases.pills.new_moon')}</Text>
                      <Text style={moonPhasesStyles.content.body.infos.info.value}>{dayjs(moonData.data.nextNewMoon).format('DD MMMM')}</Text>
                    </View>
                    <View>
                      <Text style={moonPhasesStyles.content.body.infos.info.label}>{i18n.t('moonPhases.pills.elongation')}</Text>
                      <Text style={moonPhasesStyles.content.body.infos.info.value}>{moonData.data.elongation}°</Text>
                    </View>
                  </View>
                </View>
                <View>
                  <VisibilityGraph visibilityGraph={moonData?.visibility.visibilityGraph}/>
                </View>
              </>
            )
          }
        </View>

        {/*Calendar view*/}
        <View style={[moonPhasesStyles.content, {marginTop: 20}]}>
          <Text style={moonPhasesStyles.content.calendar.title}>Calendrier complet</Text>
          {
            calendarImages.length === 0 &&
              <DisclaimerBar message={"Le traitement du calendrier complet peu prendre un certain à cause de la méthode actuelle de génération des images."} type={"warning"} soft/>
          }

          <View style={moonPhasesStyles.content.calendar.selectorRow}>
            <SimpleButton
              icon={require('../../assets/icons/FiChevronLeft.png')}
              active
              activeBorderColor={app_colors.white_twenty}
              onPress={() => handleMonthChange('previous')}
            />
            <Text style={moonPhasesStyles.content.calendar.selectorRow.currentMonth}>{capitalize(dayjs().month(currentMonth).format('MMMM YYYY'))}</Text>
            <SimpleButton
              icon={require('../../assets/icons/FiChevronRight.png')}
              active
              activeBorderColor={app_colors.white_twenty}
              onPress={() => handleMonthChange('next')}
            />
          </View>

          <View style={moonPhasesStyles.content.calendar.calendarCellsContainer}>
            {
              calendarImages.length > 0 ?
              calendarImages.map((day: any, index: number) => {
                return (
                  <View key={index} style={moonPhasesStyles.content.calendar.calendarCellsContainer.cell}>
                    <Text style={moonPhasesStyles.content.calendar.calendarCellsContainer.cell.day}>{dayjs(day.date).format('ddd')}</Text>
                    <Text style={moonPhasesStyles.content.calendar.calendarCellsContainer.cell.day}>{dayjs(day.date).format('DD MMMM')}</Text>
                    <Image source={{uri: day.url}} style={moonPhasesStyles.content.calendar.calendarCellsContainer.cell.image}/>
                  </View>
                )
              })
                :
                <ActivityIndicator size={"large"} color={app_colors.white}/>
            }
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
