import React from 'react'
import { ImageBackground, Text, View } from 'react-native'
import { moonInfosStyles } from '../../styles/components/weather/moonInfos'
import dayjs from 'dayjs'
import SingleValue from './SingleValue'

export default function MoonInfos({moonInfos}: any) {
  return (
    <View style={moonInfosStyles.container}>
      <ImageBackground source={require('../../../assets/icons/astro/moon/Full Moon.png')} style={moonInfosStyles.container.illustration} />
      <View>
        <Text style={moonInfosStyles.container.title}>{moonInfos && moonInfos.moon.phase_name}</Text>
        <View style={moonInfosStyles.container.infos}>
          <View style={{gap: 5}}>
            <SingleValue icon={require('../../../assets/icons/FiMoonrise.png')} value={moonInfos ? moonInfos.moon.moonrise.replace(':', 'h') : '--'} />
            <SingleValue icon={require('../../../assets/icons/FiMoonset.png')} value={moonInfos ? moonInfos.moon.moonset.replace(':', 'h') : '--'} />
          </View>
          <View style={{gap: 5}}>
            <SingleValue icon={require('../../../assets/icons/FiSun.png')} value={moonInfos ? moonInfos.moon.illumination : '--'} />
            <SingleValue icon={require('../../../assets/icons/FiGift.png')} value={moonInfos ? `${moonInfos.moon.age_days} jour${moonInfos.moon.age_days > 1 ? 's' : ''}` : '--'} />
          </View>
        </View>
      </View>
    </View>
  )
}
