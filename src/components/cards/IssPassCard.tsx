import React, {useEffect, useState} from 'react'
import {Image, Text, View} from 'react-native'
import { issPassCardStyles } from '../../styles/components/cards/issPassCard'
import dayjs from 'dayjs';
import {IssPass} from "../../helpers/types/IssPass";
import {weatherImages} from "../../helpers/scripts/loadImages";
import {determineIssVisibility} from "../../helpers/scripts/astro/determineIssVisibility";
import {i18n} from "../../helpers/scripts/i18n";

interface IssPassCardProps {
  pass: IssPass;
  passIndex: number;
  navigation: any;
  weather: any;
}

export default function IssPassCard({ pass, passIndex, navigation, weather }: IssPassCardProps) {

  const [passLength, setPassLength] = useState<string>('')
  const [isWeatherAccurate, setIsWeatherAccurate] = useState<boolean>(false)
  const [visibilityBadge, setVisibilityBadge] = useState<any>({})
  const [passWeatherIndex, setPassWeatherIndex] = useState<number>(0)

  // https://api.n2yo.com/rest/v1/satellite/visualpasses/25544/43.5314643/5.4508237/341/1/45/&apiKey=SQCWS8-7VQKED-JG2RHW-5DGF

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
    <View style={issPassCardStyles.card}>
      <View style={issPassCardStyles.card.conditions}>
        {
          !isWeatherAccurate ?
            <Image style={issPassCardStyles.card.conditions.icon} source={require('../../../assets/icons/FiIss.png')}/>
            :
            <Image style={issPassCardStyles.card.conditions.icon} source={isWeatherAccurate ? weatherImages[weather[passWeatherIndex]?.weather[0].icon] : require('../../../assets/icons/FiIss.png')}/>
        }
        <View style={issPassCardStyles.column}>
          <Text style={issPassCardStyles.card.conditions.title}>ISS</Text>
          <Text style={issPassCardStyles.card.conditions.subtitle}>Mag : {pass.mag}</Text>
        </View>
      </View>

      <View style={issPassCardStyles.card.infos}>
        <View style={issPassCardStyles.column}>
          <Text style={issPassCardStyles.column.title}>{i18n.t('satelliteTracker.issTracker.passCard.time')}</Text>
          <Text style={issPassCardStyles.column.value}>{dayjs.unix(pass.startUTC).format('HH:mm')}</Text>
        </View>

        <View style={issPassCardStyles.column}>
          <Text style={issPassCardStyles.column.title}>{i18n.t('satelliteTracker.issTracker.passCard.maxAltitude')}</Text>
          <Text style={issPassCardStyles.column.value}>{pass.maxEl}°</Text>
        </View>

        <View style={issPassCardStyles.column}>
          <Text style={issPassCardStyles.column.title}>{i18n.t('satelliteTracker.issTracker.passCard.direction')}</Text>
          <Text style={issPassCardStyles.column.value}>{pass.startAzCompass}</Text>
        </View>
      </View>
    </View>
  )
}
