import React from 'react'
import { Image, View } from 'react-native'
import { ephemerisBarStyles } from '../../styles/components/weather/ephemerisBar'
import SingleValue from './SingleValue'

interface EphemerisBarProps {
  mode: 'day' | 'night'
  percentage: number
  sunrise: string
  sunset: string
}

export default function EphemerisBar({ mode, percentage, sunrise, sunset }: EphemerisBarProps) {
  return (
    <View style={ephemerisBarStyles.container}>
      <View style={ephemerisBarStyles.container.sideColumn}>
        <Image style={ephemerisBarStyles.container.sideColumn.icon} source={mode === 'day' ? require('../../../assets/icons/weather/01d.png') : require('../../../assets/icons/weather/01n.png')} />
        <SingleValue value={mode === 'day' ? sunrise : sunset} />
      </View>
      <View style={ephemerisBarStyles.container.bar}>
        <View style={[ephemerisBarStyles.container.bar.progress, {width: `${percentage}%`}]}/>
      </View>
      <View style={ephemerisBarStyles.container.sideColumn}>
        <Image style={ephemerisBarStyles.container.sideColumn.icon} source={mode === 'day' ? require('../../../assets/icons/weather/01n.png') : require('../../../assets/icons/weather/01d.png')} />
        <SingleValue value={mode === 'day' ? sunset : sunrise} />
      </View>
    </View>
  )
}
