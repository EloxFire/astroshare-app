import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useSettings } from '../../contexts/AppSettingsContext'
import GlobalSummary from './home/GlobalSummary'
import NightSummary from './home/NightSummary'
import NextLaunchCountdownWidget from "./home/NextLaunchCountdownWidget";

export default function HomeWidgetDisplay() {

  const { selectedHomeWidget } = useSettings()

  return (
    <View>
      {selectedHomeWidget === 'Live' && <GlobalSummary />}
      {selectedHomeWidget === 'Night' && <NightSummary />}
      {selectedHomeWidget === 'NextLaunchCountdown' && <NextLaunchCountdownWidget />}
    </View>
  )
}
