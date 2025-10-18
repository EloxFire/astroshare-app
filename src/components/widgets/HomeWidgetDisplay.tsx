import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import { useSettings } from '../../contexts/AppSettingsContext'
import GlobalSummary from './home/GlobalSummary'
import NightSummary from './home/NightSummary'
import NextLaunchCountdownWidget from "./home/NextLaunchCountdownWidget";
import { HomeWidget } from '../../helpers/types/HomeWidget'
import { ClockWidget } from './home/ClockWidget'

export default function HomeWidgetDisplay() {

  const { selectedHomeWidget } = useSettings()

  console.log('[HomeWidgetDisplay] Selected home widget:', selectedHomeWidget);
  

  return (
    <View>
      {selectedHomeWidget === HomeWidget['Live'] && <GlobalSummary />}
      {selectedHomeWidget === HomeWidget['Night'] && <NightSummary />}
      {selectedHomeWidget === HomeWidget['NextLaunchCountdown'] && <NextLaunchCountdownWidget />}
      {selectedHomeWidget === HomeWidget['Clock'] && <ClockWidget />}
    </View>
  )
}
