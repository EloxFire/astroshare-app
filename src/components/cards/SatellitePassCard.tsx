import React, {useEffect, useState} from 'react'
import {Image, Text, View} from 'react-native'
import { satellitePassCardStyles } from '../../styles/components/cards/satellitePassCard'
import dayjs from 'dayjs';
import {weatherImages} from "../../helpers/scripts/loadImages";
import {determineIssVisibility} from "../../helpers/scripts/astro/determineIssVisibility";
import {i18n} from "../../helpers/scripts/i18n";
import { SatellitePass } from '../../helpers/types/IssPass';

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

  return (
    <View style={satellitePassCardStyles.card}>
      <View style={satellitePassCardStyles.card.conditions}>
        {
          !isWeatherAccurate ?
            <Image style={satellitePassCardStyles.card.conditions.icon} source={require('../../../assets/icons/FiIss.png')}/>
            :
            <Image style={satellitePassCardStyles.card.conditions.icon} source={isWeatherAccurate ? weatherImages[weather[passWeatherIndex]?.weather[0].icon] : require('../../../assets/icons/FiIss.png')}/>
        }
        <View style={satellitePassCardStyles.column}>
          <Text style={satellitePassCardStyles.card.conditions.title}>{satname ? satname.replaceAll(" ", "\n") : ""}</Text>
          {
            pass.mag !== 100000 && <Text style={satellitePassCardStyles.card.conditions.subtitle}>Mag : {pass.mag}</Text>
           }
        </View>
      </View>

      <View style={satellitePassCardStyles.card.infos}>
        <View style={satellitePassCardStyles.column}>
          <Text style={satellitePassCardStyles.column.title}>{i18n.t('satelliteTrackers.details.passCard.time')}</Text>
          <Text style={satellitePassCardStyles.column.value}>{dayjs.unix(pass.startUTC).format('HH:mm')}</Text>
        </View>

        <View style={satellitePassCardStyles.column}>
          <Text style={satellitePassCardStyles.column.title}>{i18n.t('satelliteTrackers.details.passCard.maxAltitude')}</Text>
          <Text style={satellitePassCardStyles.column.value}>{pass.maxEl}°</Text>
        </View>

        <View style={satellitePassCardStyles.column}>
          <Text style={satellitePassCardStyles.column.title}>{i18n.t('satelliteTrackers.details.passCard.direction')}</Text>
          <Text style={satellitePassCardStyles.column.value}>{pass.startAzCompass}</Text>
        </View>
      </View>
    </View>
  )
}
