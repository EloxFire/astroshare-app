import React, { useEffect, useState } from 'react'
import { Image, Keyboard, Text, TouchableOpacity, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { weatherStyles } from '../styles/screens/weather'
import { useSettings } from '../contexts/AppSettingsContext'
import { getWeather } from '../helpers/api/getWeather'
import { weatherImages } from '../helpers/scripts/loadImages'
import { getWindDir } from '../helpers/scripts/getWindDir'
import { LocationObject } from '../helpers/types/LocationObject'
import PageTitle from '../components/commons/PageTitle'
import InputWithIcon from '../components/forms/InputWithIcon'
import SingleValue from '../components/weather/SingleValue'
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import { getCityCoords } from '../helpers/api/getCityCoords'
import { convertDDtoDMS } from '../helpers/scripts/convertDDtoDMSCoords'

export default function Weather({ navigation }: any) {
  
  const { currentUserLocation } = useSettings();
  const [searchString, setSearchString] = useState<string>('')
  const [searchedCity, setSearchedCity] = useState<LocationObject | null>(null)
  const [weather, setWeather] = useState<any>(null)

  useEffect(() => {
    getCurrent()
  }, [])

  const getCurrent = async () => {
    if (currentUserLocation) {
      const weather = await getWeather(currentUserLocation.lat, currentUserLocation.lon)
      setWeather(weather)
      setSearchedCity(null)
    }
  }

  const searchWeather = async () => {
    if (searchString === '') {
      return
    }

    Keyboard.dismiss();
    
    const cityCoords = await getCityCoords(searchString)
    if (cityCoords.length === 0) return;

    const city: LocationObject = {
      lat: cityCoords[0].lat,
      lon: cityCoords[0].lon,
      common_name: cityCoords[0].local_names.fr,
      country: cityCoords[0].country,
      state: cityCoords[0].state,
      dms: convertDDtoDMS(cityCoords[0].lat, cityCoords[0].lon)
    }    
   
    const searchedWeather = await getWeather(city.lat, city.lon)
    setSearchedCity(city)    
    setWeather(searchedWeather)
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title="Météo en direct" subtitle="// C'est l'heure de sortir le télescope !" />
      <View style={globalStyles.screens.separator} />
      <View style={weatherStyles.content}>
        <InputWithIcon
          icon={require('../../assets/icons/FiSearch.png')}
          placeholder="Rechercher une ville"
          changeEvent={(text: string) => setSearchString(text)}
          search={() => searchWeather()}
          value={searchString}
        />
      </View>
      {
        searchedCity &&
        <TouchableOpacity style={weatherStyles.content.resetButton} onPress={() => getCurrent()}>
          <Image source={require('../../assets/icons/FiRepeat.png')} style={{ width: 20, height: 20, marginRight: 10}}/>
          <Text style={weatherStyles.content.text}>Retour à {currentUserLocation.common_name}</Text>
        </TouchableOpacity>
      }

      <View style={[weatherStyles.content.weatherContainer, weatherStyles.content.weather]}>
        <Text style={weatherStyles.content.weather.header.title}>{!searchedCity ? currentUserLocation.common_name || '--' : searchedCity.common_name || '--'}</Text>
        <Text style={weatherStyles.content.weather.header.subtitle}>{!searchedCity ? `${getUnicodeFlagIcon(currentUserLocation.country)}, ${currentUserLocation.state}` || '--' : getUnicodeFlagIcon(searchedCity.country || '') || '--'}</Text>
        <View style={weatherStyles.content.weather.header}>
          <View>
            <Image source={weather ? weatherImages[weather.current.weather[0].icon] : weatherImages.default} style={{ width: 100, height: 100}}/>
            {
              weather ?
                weather.current.weather[0].description.split(' ').length > 1 ?
                  <View>
                    <Text style={[weatherStyles.content.weather.header.title, weatherStyles.content.weather.header.description]}>{weather.current.weather[0].description.split(' ')[0]}</Text>
                    <Text style={[weatherStyles.content.weather.header.title, weatherStyles.content.weather.header.description]}>{weather.current.weather[0].description.split(' ')[1]}</Text>
                  </View>
                  :
                  <Text style={[weatherStyles.content.weather.header.title, weatherStyles.content.weather.header.description]}>{weather.current.weather[0].description}</Text>
                :
                <Text style={[weatherStyles.content.weather.header.title, weatherStyles.content.weather.header.description]}>--</Text>
            }
          </View>
          <View style={{display: 'flex', flexDirection: 'column' ,alignItems: 'flex-end'}}>
            <Text style={[weatherStyles.content.weather.header.title, weatherStyles.content.weather.header.temp]}>{weather ? `${Math.floor(weather.current.temp)}°C` : '--'}</Text>
            <View>
              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5}}>
                <SingleValue value={weather ? Math.floor(weather.current.feels_like) : '--'} unit="°C" icon={require('../../assets/icons/FiUser.png')} />
                <SingleValue value={weather ? Math.floor(weather.daily[0].temp.min) : '--'} unit="°C" icon={require('../../assets/icons/FiTrendingDown.png')} />
                <SingleValue value={weather ? Math.floor(weather.daily[0].temp.max) : '--'} unit="°C" icon={require('../../assets/icons/FiTrendingUp.png')} />
              </View>
              <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20}}>
                <SingleValue value={weather ? weather.current.humidity : '--'} unit="%" icon={require('../../assets/icons/FiDroplet.png')} />
                <SingleValue value={weather ? weather.current.wind_speed : '--'} unit="km/h" icon={require('../../assets/icons/FiWind.png')} />
                <SingleValue value={weather ? getWindDir(weather.current.wind_deg) : '--'} icon={require('../../assets/icons/FiCompass.png')} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  )
}
