import React from 'react'
import { Image, ScrollView, Text, View } from 'react-native'
import { weatherStyles } from '../../styles/screens/weather'
import { hourlyStyles } from '../../styles/components/weather/hourly'
import { getWindDir } from '../../helpers/scripts/getWindDir'
import { weatherImages } from '../../helpers/scripts/loadImages'
import dayjs from 'dayjs'
import SingleValue from './SingleValue'
import { i18n } from '../../helpers/scripts/i18n'

interface HourlyProps {
  weather: any
}

export default function Hourly({ weather }: HourlyProps) {
  return (
    <View style={weatherStyles.weatherContainer}>
      <Text style={weatherStyles.weatherContainer.title}>{i18n.t('weather_hourly_overview.title')}</Text>
      <ScrollView style={hourlyStyles.content} nestedScrollEnabled>
        {
          weather ?
            weather.hourly.slice(0, 24).map((hour: any, index: number) => {
              return (
                <View key={index} style={hourlyStyles.content.hour}>
                  <View style={[hourlyStyles.content.hour.row, { alignItems: 'flex-start' }]}>
                    <Text style={{ color: 'white', fontSize: 14, fontFamily: 'GilroyBlack' }}>{dayjs.unix(hour.dt).format('HH')}H</Text>
                    <Text style={{ color: 'white', fontSize: 14, fontFamily: 'GilroyBlack' }}>{hour.weather[0].description.toUpperCase()}</Text>
                  </View>
                  <View style={[hourlyStyles.content.hour.row, { alignItems: 'flex-end' }]}>
                    <Image style={{ height: 30, width: 30 }} source={weatherImages[hour.weather[0].icon]} />
                    <SingleValue icon={require('../../../assets/icons/FiThermometer.png')} value={Math.floor(hour.temp)} unit='°C' />
                    <SingleValue icon={require('../../../assets/icons/FiDroplet.png')} value={Math.floor(hour.humidity)} unit='%' />
                    <SingleValue icon={require('../../../assets/icons/FiWind.png')} value={Math.floor(hour.wind_speed)} unit='Km/h' />
                    <SingleValue icon={require('../../../assets/icons/FiCompass.png')} value={getWindDir(hour.wind_deg)} />
                    <SingleValue icon={require('../../../assets/icons/FiAlignCenter.png')} value={Math.floor(hour.clouds)} unit='%' />
                  </View>
                </View>
              )
            })
            :
            <Text style={weatherStyles.weatherContainer.title}>{i18n.t('common.loadings.simple')}</Text>
        }
      </ScrollView>
    </View>
  )
}
