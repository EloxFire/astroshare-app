import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { polarClockStyles } from '../styles/components/polarClock';
import { app_colors } from '../helpers/constants';
import NorthenPolarScope from './polarScopes/NorthenPolarScope';
import SouthenPolarScope from './polarScopes/SouthenPolarScope';
import { i18n } from '../helpers/scripts/i18n';
import { useSettings } from '../contexts/AppSettingsContext';

export default function PolarClock() {

  const { currentUserLocation } = useSettings();

  const [selectedHemisphere, setSelectedHemisphere] = useState<'north' | 'south'>(currentUserLocation.lat > 0 ? 'north' : 'south');

  return (
    <View style={polarClockStyles.container}>
      {/* <View style={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 10, marginVertical: 15 }}>
        <TouchableOpacity onPress={() => setSelectedHemisphere('north')} style={[polarClockStyles.button, { backgroundColor: selectedHemisphere === "north" ? app_colors.white : app_colors.white_no_opacity }]}>
          <Text style={[polarClockStyles.button.text, { color: selectedHemisphere === "north" ? app_colors.black : app_colors.white }]}>{i18n.t('scopeAlignment.polarClock.mode.north')}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedHemisphere('south')} style={[polarClockStyles.button, { backgroundColor: selectedHemisphere === "south" ? app_colors.white : app_colors.white_no_opacity }]}>
          <Text style={[polarClockStyles.button.text, { color: selectedHemisphere === "south" ? app_colors.black : app_colors.white }]}>{i18n.t('scopeAlignment.polarClock.mode.south')}</Text>
        </TouchableOpacity>
      </View> */}

      {selectedHemisphere === 'north' && <NorthenPolarScope />}
      {selectedHemisphere === 'south' && <SouthenPolarScope />}

    </View>
  )
}