import React, { useState } from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { polarClockStyles } from '../styles/components/polarClock';
import { app_colors } from '../helpers/constants';
import NorthenPolarScope from './polarScopes/NorthenPolarScope';
import SouthenPolarScope from './polarScopes/SouthenPolarScope';

export default function PolarClock() {

  const [selectedHemisphere, setSelectedHemisphere] = useState<'north' | 'south'>('north');

  return (
    <View style={polarClockStyles.container}>
      <View style={{ width: '100%', display: 'flex', flexDirection: 'row', gap: 10, marginVertical: 15 }}>
        <TouchableOpacity onPress={() => setSelectedHemisphere('north')} style={[polarClockStyles.button, { backgroundColor: selectedHemisphere === "north" ? app_colors.white : app_colors.white_no_opacity }]}>
          <Text style={[polarClockStyles.button.text, { color: selectedHemisphere === "north" ? app_colors.black : app_colors.white }]}>Hémisphère nord</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSelectedHemisphere('south')} style={[polarClockStyles.button, { backgroundColor: selectedHemisphere === "south" ? app_colors.white : app_colors.white_no_opacity }]}>
          <Text style={[polarClockStyles.button.text, { color: selectedHemisphere === "south" ? app_colors.black : app_colors.white }]}>Hémisphère sud</Text>
        </TouchableOpacity>
      </View>

      {selectedHemisphere === 'north' && <NorthenPolarScope />}
      {selectedHemisphere === 'south' && <SouthenPolarScope />}

    </View>
  )
}