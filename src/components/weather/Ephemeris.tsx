import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { calculateDayPercentage } from '../../helpers/scripts/astro/calculateDayPercentage'
import { weatherStyles } from '../../styles/screens/weather'
import EphemerisBar from './EphemerisBar'
import MoonInfos from './MoonInfos'
import { i18n } from '../../helpers/scripts/i18n'
import DSOValues from '../commons/DSOValues'
import { getNight, getTwilightBandsForDay } from '@observerly/astrometry'
import { useSettings } from '../../contexts/AppSettingsContext'
import { app_colors } from '../../helpers/constants'

interface EphemerisProps {
  weather: any
}

export default function Ephemeris({ weather }: EphemerisProps) {

  const { currentUserLocation } = useSettings()
  const [mode, setMode] = useState<'day' | 'night'>('day')
  const [twilightBands, setTwilightBands] = useState<any>()

  useEffect(() => {
    if (weather && dayjs.unix(weather.current.sunset).isBefore(dayjs())) {
      setMode('night')
    } else {
      setMode('day')
    }
  }, [weather])

  useEffect(() => {
    setTwilightBands(getTwilightBandsForDay(new Date(), {latitude: currentUserLocation.lat, longitude: currentUserLocation.lon}))
    console.log(getTwilightBandsForDay(new Date(), {latitude: currentUserLocation.lat, longitude: currentUserLocation.lon}));
    
  }, [])

  return (
    <View style={[weatherStyles.weatherContainer, { marginBottom: 50 }]}>
      <Text style={[weatherStyles.weatherContainer.title, { marginBottom: 20 }]}>{i18n.t('ephemerisBar.title')}</Text>
      {
        weather &&
        <EphemerisBar
          mode={(weather && dayjs.unix(weather.current.sunset).isBefore(dayjs())) ? 'night' : 'day'}
          percentage={weather ? calculateDayPercentage(dayjs.unix(weather.current.sunrise), dayjs.unix(weather.current.sunset), mode === 'day' ? 0 : 1) : 0}
          sunrise={mode === 'night' ? dayjs.unix(weather.daily[1].sunrise).format('HH:mm') : dayjs.unix(weather.current.sunrise).format('HH:mm')}
          sunset={mode === 'night' ? dayjs.unix(weather.current.sunset).format('HH:mm') : dayjs.unix(weather.daily[1].sunset).format('HH:mm')}
        />
      }
      <View>
        {
          twilightBands &&
          twilightBands.map((band: any, index: number) => {
            if(dayjs(band.from).isBefore(dayjs().hour(12).minute(0).second(0))){
              return (
                <DSOValues chipValue key={`twilight-band-${index}`} title={i18n.t(`ephemerisBar.twilightBands.dawn.${band.name.toLowerCase()}`)} value={`${dayjs(band.interval.from).format('HH:mm').replace(':', 'h')} → ${dayjs(band.interval.to).format('HH:mm').replace(':', 'h')}`} chipColor={app_colors.white_twenty} />
              )
            }else{
              return (
                <DSOValues chipValue key={`twilight-band-${index}`} title={i18n.t(`ephemerisBar.twilightBands.dusk.${band.name.toLowerCase()}`)} value={`${dayjs(band.interval.from).format('HH:mm').replace(':', 'h')} → ${dayjs(band.interval.to).format('HH:mm').replace(':', 'h')}`} chipColor={app_colors.white_twenty} />
              )
            }
          })
        }
      </View>
      <MoonInfos />
    </View>
  )
}
