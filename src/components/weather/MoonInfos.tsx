import React, { useEffect, useState } from 'react'
import { Image, ImageBackground, Text, View } from 'react-native'
import { moonInfosStyles } from '../../styles/components/weather/moonInfos'
import { getMoon } from '../../helpers/api/getMoon'
import { useSettings } from '../../contexts/AppSettingsContext'
import dayjs from 'dayjs'

export default function MoonInfos({moonInfos}: any) {

  const { currentUserLocation } = useSettings()
  console.log(moonInfos.moon.phase_name);
  

  return (
    <View style={moonInfosStyles.container}>
      <ImageBackground source={require('../../../assets/icons/astro/moon/Full Moon.png')} style={moonInfosStyles.container.illustration} />
      <View>
        <Text style={moonInfosStyles.container.title}>{moonInfos && moonInfos.moon.phase_name}</Text>
        <View style={moonInfosStyles.container.infos}>
          <Text style={moonInfosStyles.container.infos.label}>Lever:</Text>
          <Text style={moonInfosStyles.container.infos.value}>{moonInfos && dayjs.unix(moonInfos.moon.moonrise_timestamp).format('HH:mm').replace(':', 'h')}</Text>
        </View>
        <View style={moonInfosStyles.container.infos}>
          <Text style={moonInfosStyles.container.infos.label}>Coucher:</Text>
          <Text style={moonInfosStyles.container.infos.value}>{moonInfos && dayjs.unix(moonInfos.moon.moonset_timestamp).format('HH:mm').replace(':', 'h')}</Text>
        </View>
      </View>
    </View>
  )
}
