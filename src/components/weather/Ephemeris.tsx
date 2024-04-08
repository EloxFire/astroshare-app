import dayjs from 'dayjs'
import React from 'react'
import { Image, Text, View } from 'react-native'
import { calculateDayPercentage } from '../../helpers/scripts/astro/calculateDayPercentage'
import { weatherStyles } from '../../styles/screens/weather'
import SingleValue from './SingleValue'

interface EphemerisProps {
  weather: any
}

export default function Ephemeris({ weather }: EphemerisProps) {
  return (
    <View style={weatherStyles.content.weatherContainer}>
        <Text style={weatherStyles.content.weather.header.title}>Éphéméride</Text>
        
        <View style={weatherStyles.content.ephemerisBar}>
          {weather && dayjs.unix(weather.current.sunset).isBefore(dayjs()) ? <Image source={require('../../../assets/icons/weather/01n.png')} style={{ width: 20, height: 20, marginBottom: 3}}/> : <Image source={require('../../../assets/icons/weather/01d.png')} style={{ width: 20, height: 20, marginBottom: 3}}/>}
          <View style={weatherStyles.content.ephemerisBar.container} />
          {
            (weather && dayjs.unix(weather.current.sunset).isBefore(dayjs())) ?
            <View style={[weatherStyles.content.ephemerisBar.progress, {width: weather ? calculateDayPercentage(dayjs.unix(weather.current.sunset), dayjs.unix(weather.daily[1].sunrise)) : 0}]}/>
              :
              <View style={[weatherStyles.content.ephemerisBar.progress, {width: weather ? calculateDayPercentage(dayjs.unix(weather.current.sunrise), dayjs.unix(weather.current.sunset)) : 0}]}/>
          }
          {weather && dayjs.unix(weather.current.sunset).isBefore(dayjs()) ? <Image source={require('../../../assets/icons/weather/01d.png')} style={{ width: 20, height: 20, marginBottom: 3}}/> : <Image source={require('../../../assets/icons/weather/01n.png')} style={{ width: 20, height: 20, marginBottom: 3}}/>}
        </View>
        {
          (weather && dayjs.unix(weather.current.sunset).isBefore(dayjs())) ?
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
            <SingleValue value={weather ? dayjs.unix(weather.current.sunset).format('HH:mm') : '--'} icon={require('../../../assets/icons/FiSunset.png')} />
            <SingleValue value={weather ? dayjs.unix(weather.daily[1].sunrise).format('HH:mm') : '--'} icon={require('../../../assets/icons/FiSunrise.png')} />
          </View>
          :
          <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
            <SingleValue value={weather ? dayjs.unix(weather.current.sunrise).format('HH:mm') : '--'} icon={require('../../../assets/icons/FiSunrise.png')} />
            <SingleValue value={weather ? dayjs.unix(weather.current.sunset).format('HH:mm') : '--'} icon={require('../../../assets/icons/FiSunset.png')} />
          </View>
        }
      </View>
  )
}
