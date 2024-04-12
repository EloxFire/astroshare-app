import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { getWindDir } from '../../helpers/scripts/getWindDir'
import { weatherImages } from '../../helpers/scripts/loadImages'
import { weatherStyles } from '../../styles/screens/weather'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import SingleValue from './SingleValue'
import { LocationObject } from '../../helpers/types/LocationObject'
import { app_colors } from '../../helpers/constants'

interface WeatherOverviewProps {
  weather: any
  searchedCity: LocationObject | null
  currentUserLocation: LocationObject
  refresh: () => void
}

export default function WeatherOverview({ weather, currentUserLocation, searchedCity, refresh }: WeatherOverviewProps) {
  return (
    <View style={[weatherStyles.weatherContainer, weatherStyles.content.weather]}>
      <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15}}>
        <View>
          <Text style={weatherStyles.weatherContainer.title}>{!searchedCity ? currentUserLocation.common_name || '--' : searchedCity.common_name || '--'}</Text>
        <Text style={weatherStyles.content.weather.header.subtitle}>{!searchedCity ? `${getUnicodeFlagIcon(currentUserLocation.country || 'ZZ')}, ${currentUserLocation.state}` || '--' : `${getUnicodeFlagIcon(searchedCity.country || 'ZZ')}, ${searchedCity.state}` || '--'}</Text>
        </View>
        <TouchableOpacity style={{backgroundColor: app_colors.white_no_opacity, padding: 5, justifyContent: 'center', alignItems: 'center', borderRadius: 10, display: 'flex', width: 30, height: 30}} onPress={() => refresh()}>
          <Image source={require('../../../assets/icons/FiRepeat.png')} style={{ width: 15, height: 15}}/>
        </TouchableOpacity>
        </View>
        <View style={weatherStyles.content.weather.header}>
          <View>
            <Image source={weather ? weatherImages[weather.current.weather[0].icon] : weatherImages.default} style={{ width: 100, height: 100, marginBottom: 8}}/>
            {
              weather ?
                (weather.current.weather[0].description.split(' ').length > 1 && weather.current.weather[0].description.length > 13) ?
                  <View>
                    <Text style={[weatherStyles.weatherContainer.title, weatherStyles.content.weather.header.description]}>{weather.current.weather[0].description.split(' ')[0]}</Text>
                    <Text style={[weatherStyles.weatherContainer.title, weatherStyles.content.weather.header.description]}>{weather.current.weather[0].description.split(' ')[1]}</Text>
                  </View>
                  :
                  <Text style={[weatherStyles.weatherContainer.title, weatherStyles.content.weather.header.description]}>{weather.current.weather[0].description}</Text>
                  :
                  <Text style={[weatherStyles.weatherContainer.title, weatherStyles.content.weather.header.description]}>--</Text>
                }
          </View>
          <View style={{display: 'flex', flexDirection: 'column' ,alignItems: 'flex-end'}}>
            <Text style={[weatherStyles.weatherContainer.title, weatherStyles.content.weather.header.temp]}>{weather ? `${Math.floor(weather.current.temp)}°C` : '--'}</Text>
            <View>
              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5}}>
                <SingleValue value={weather ? Math.floor(weather.current.feels_like) : '--'} unit="°C" icon={require('../../../assets/icons/FiUser.png')} />
                <SingleValue value={weather ? Math.floor(weather.daily[0].temp.min) : '--'} unit="°C" icon={require('../../../assets/icons/FiTrendingDown.png')} />
                <SingleValue value={weather ? Math.floor(weather.daily[0].temp.max) : '--'} unit="°C" icon={require('../../../assets/icons/FiTrendingUp.png')} />
              </View>
              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20}}>
                <SingleValue value={weather ? weather.current.humidity : '--'} unit="%" icon={require('../../../assets/icons/FiDroplet.png')} />
                <SingleValue value={weather ? weather.current.wind_speed : '--'} unit="km/h" icon={require('../../../assets/icons/FiWind.png')} />
                <SingleValue value={weather ? getWindDir(weather.current.wind_deg) : '--'} icon={require('../../../assets/icons/FiCompass.png')} />
              </View>
            </View>
          </View>
        </View>
      </View>
  )
}
