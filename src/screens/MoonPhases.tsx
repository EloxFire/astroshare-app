import React, { useEffect, useState } from 'react'
import {ActivityIndicator, Image, ScrollView, Text, View, Platform} from 'react-native'
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
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export default function MoonPhases({ navigation }: any) {

  const { currentUserLocation } = useSettings()
  const {currentLocale, currentLCID} = useTranslation()
  const { currentUser } = useAuth()
  dayjs().locale(currentLocale)

  const [moonData, setMoonData] = useState<ComputedMoonInfos | null>(null)
  const [moonImageUrl, setMoonImageUrl] = useState<undefined | {uri: string }>(undefined)
  const [calendarImages, setCalendarImages] = useState<any>([])
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [loadingMonth, setLoadingMonth] = useState(true)


  const [clock, setClock] = useState(dayjs()); // Pour montrer l'heure actuelle
  const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs())
  const [selectedYear, setSelectedYear] = useState<number>(dayjs().year())
  const [selectedMonth, setSelectedMonth] = useState<number>(dayjs().month())


  // Envoi des analytiques
  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Moon Phases screen view', eventTypes.SCREEN_VIEW, {currentMonth: selectedMonth}, currentLocale)
  }, []);

  // Mise a jour de l'horloge chaque seconde (pause quand le date picker est ouvert)
  useEffect(() => {
    if (showDatePicker) {
      return
    }

    setClock(dayjs())

    const interval = setInterval(() => {
      setClock(dayjs());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [showDatePicker]);

  // Mise à jour des données lunaires
  useEffect(() => {
    const date = selectedDate.toDate()
    const observer: GeographicCoordinate = {latitude: currentUserLocation.lat, longitude: currentUserLocation.lon}
    const data: ComputedMoonInfos = computeMoon({date: date, observer})
    setMoonData(data)
    fetchMoonImage()
    fetchCalendarImages(selectedMonth)
  }, [currentUserLocation, selectedDate]);

  useEffect(() => {
    fetchCalendarImages(selectedMonth)
  }, [selectedMonth]);


  const fetchMoonImage = async () => {
    const response = await astroshareApi.get('/moon/illustration?date=' + selectedDate.format('YYYY-MM-DD'))
    setMoonImageUrl({uri: response.data.url})
  }

  const fetchCalendarImages = async (month: number) => {
    setLoadingMonth(true)
    console.log(`Fetching calendar images for ${selectedYear}-${month} ---- ${dayjs().month()}}`);
    
    const response = await astroshareApi.get(`/moon/illustration/month?year=${selectedYear}&month=${selectedMonth}`)
    setCalendarImages(response.data.images)
    setLoadingMonth(false)
  }

  const handleDatePickerChange = (event: DateTimePickerEvent, date?: Date) => {
    if (event.type === 'dismissed') {
      setShowDatePicker(false)
      return
    }

    if (date) {
      setSelectedDate(dayjs(date))
      setSelectedYear(dayjs(date).year())
      setSelectedMonth(dayjs(date).month())
    }

    if (Platform.OS === 'android') {
      setShowDatePicker(false)
    }
  }

  const handleMonthChange = (direction: 'next' | 'previous') => {
    if (direction === 'next' && (selectedYear === dayjs().year() && selectedMonth === 11)) {
      return
    }
    if (direction === 'previous' && (selectedYear === 2011 && selectedMonth === 0)) {
      return
    }
    if (direction === 'next') {
      setSelectedMonth(selectedMonth + 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
  }

  const handleResetDate = () => {
    setSelectedDate(dayjs())
    setSelectedYear(dayjs().year())
    setSelectedMonth(dayjs().month())
  }

  

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title={i18n.t('home.buttons.moon_phases.title')} subtitle={i18n.t('home.buttons.moon_phases.subtitle')} backRoute={routes.home.path} />
      <View style={globalStyles.screens.separator} />

      {
        showDatePicker &&
        <DateTimePicker
          value={selectedDate.toDate()}
          mode="date"
          display="default"
          onChange={handleDatePickerChange}
          accentColor={app_colors.yellow}
          // Maximum date at 31 december of current year
          maximumDate={new Date(dayjs().year(), 11, 31)}
          // Minimum date at 1 january 2011
          minimumDate={new Date(2011, 0, 1)}
        />
      }

      <ScrollView>
      <DisclaimerBar message={i18n.t('moonPhases.disclaimer', {startDate: dayjs('2011-01-01').format('DD MMMM YYYY'), endDate: dayjs().endOf('year').format('DD MMMM YYYY')})} type={"info"} soft/>
      <View style={[moonPhasesStyles.content, {marginBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}]}>
        <SimpleButton
          icon={require('../../assets/icons/FiChevronLeft.png')}
          onPress={() => setSelectedDate(selectedDate.subtract(1, 'day'))}
          active
          activeBorderColor={app_colors.white_twenty}
        />
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10}}>
            <SimpleButton
              icon={require('../../assets/icons/FiCalendar.png')}
              text={selectedDate.format('DD MMMM YYYY')}
              textColor={app_colors.white}
              textAdditionalStyles={{textTransform: 'uppercase', fontFamily: 'DMMonoMedium'}}
              active
              activeBorderColor={app_colors.white_twenty}
              onPress={() => setShowDatePicker((current) => !current)}
            />
            {
              !selectedDate.isSame(dayjs(), 'day') &&
              <SimpleButton
                icon={require('../../assets/icons/FiRepeat.png')}
                textColor={app_colors.white}
                textAdditionalStyles={{textTransform: 'uppercase', fontFamily: 'DMMonoMedium', fontSize: 12}}
                active
                activeBorderColor={app_colors.white_twenty}
                onPress={() => handleResetDate()}
              />
            }
          </View>
          <Text style={moonPhasesStyles.content.header.transitCard.text}>{clock.format('HH:mm:ss')}</Text>
        </View>
        <SimpleButton
          icon={require('../../assets/icons/FiChevronRight.png')}
          onPress={() => setSelectedDate(selectedDate.add(1, 'day'))}
          active
          activeBorderColor={app_colors.white_twenty}
        />
      </View>
        <View style={[moonPhasesStyles.content, {marginBottom: 0}]}>
          <View style={moonPhasesStyles.content.header}>
            <View style={moonPhasesStyles.content.header.transitCard}>
              <Image source={require('../../assets/icons/FiMoonrise.png')} style={moonPhasesStyles.content.header.transitCard.icon} />
              {moonData ? <Text style={moonPhasesStyles.content.header.transitCard.text}>{moonData.visibility.objectNextRise}</Text> : <ActivityIndicator size={"small"} />}
            </View>
            <Text style={moonPhasesStyles.content.body.phaseTitle}>{!moonData ? <ActivityIndicator size={"small"} /> : moonData.data.phase}</Text>
            <View style={moonPhasesStyles.content.header.transitCard}>
              <Image source={require('../../assets/icons/FiMoonset.png')} style={moonPhasesStyles.content.header.transitCard.icon} />
              {moonData ? <Text style={moonPhasesStyles.content.header.transitCard.text}>{moonData.visibility.objectNextSet}</Text> : <ActivityIndicator size={"small"} />}
            </View>
          </View>
          {
            moonData && (
              <>
                <View style={moonPhasesStyles.content.body}>
                  
                  { !moonImageUrl ? <ActivityIndicator size={"large"} color={app_colors.white} /> : <Image source={moonImageUrl} style={moonPhasesStyles.content.body.image}/> }
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
        <View style={[moonPhasesStyles.content, {marginTop: 20, marginBottom: 5}]}>
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
            <Text style={moonPhasesStyles.content.calendar.selectorRow.currentMonth}>{capitalize(dayjs().month(selectedMonth).format('MMMM YYYY'))}</Text>
            <SimpleButton
              icon={require('../../assets/icons/FiChevronRight.png')}
              active
              activeBorderColor={app_colors.white_twenty}
              onPress={() => handleMonthChange('next')}
            />
          </View>

          <View style={moonPhasesStyles.content.calendar.calendarCellsContainer}>
            {
              loadingMonth ?
                <ActivityIndicator size={"large"} color={app_colors.white}/>
                :
                <>
                  {
                    calendarImages.length > 0 ?
                    calendarImages.map((day: any, index: number) => {
                      
                      return (
                        <View key={index} style={moonPhasesStyles.content.calendar.calendarCellsContainer.cell}>
                          <Text style={moonPhasesStyles.content.calendar.calendarCellsContainer.cell.day}>{dayjs(day.date).add(1, 'month').format('ddd')}</Text>
                          <Text style={moonPhasesStyles.content.calendar.calendarCellsContainer.cell.day}>{dayjs(day.date).add(1, 'month').format('DD MMMM')}</Text>
                          <Image source={{uri: day.url}} style={moonPhasesStyles.content.calendar.calendarCellsContainer.cell.image}/>
                        </View>
                      )
                    })
                      :
                      <ActivityIndicator size={"large"} color={app_colors.white}/>
                  }
                </>
            }
            
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
