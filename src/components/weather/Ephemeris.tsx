import dayjs from 'dayjs'
import React, { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { calculateDayPercentage } from '../../helpers/scripts/astro/calculateDayPercentage'
import { weatherStyles } from '../../styles/screens/weather'
import EphemerisBar from './EphemerisBar'
import MoonInfos from './MoonInfos'

interface EphemerisProps {
  weather: any
}

export default function Ephemeris({ weather }: EphemerisProps) {

  const [mode, setMode] = useState<'day' | 'night'>('day')

  useEffect(() => {
    if (weather && dayjs.unix(weather.current.sunset).isBefore(dayjs())) {
      setMode('night')
    } else {
      setMode('day')
    }
  }, [weather])

  return (
    <View style={[weatherStyles.weatherContainer, { marginBottom: 50 }]}>
      <Text style={[weatherStyles.weatherContainer.title, { marginBottom: 20 }]}>Éphéméride</Text>
      {
        weather &&
        <EphemerisBar
          mode={(weather && dayjs.unix(weather.current.sunset).isBefore(dayjs())) ? 'night' : 'day'}
          percentage={weather ? calculateDayPercentage(dayjs.unix(weather.current.sunrise), dayjs.unix(weather.current.sunset), mode === 'day' ? 0 : 1) : 0}
          sunrise={mode === 'night' ? dayjs.unix(weather.daily[1].sunrise).format('HH:mm') : dayjs.unix(weather.current.sunrise).format('HH:mm')}
          sunset={mode === 'night' ? dayjs.unix(weather.current.sunset).format('HH:mm') : dayjs.unix(weather.daily[1].sunset).format('HH:mm')}
        />
      }
      <MoonInfos />
    </View>
  )
}
