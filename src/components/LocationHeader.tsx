import React, { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Image, Modal, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { locationHeaderStyles } from '../styles/components/locationHeader'
import { useSettings } from '../contexts/AppSettingsContext';
import LocationModal from './LocationModal';
import RefreshButton from './commons/buttons/RefreshButton';
import * as Linking from 'expo-linking';

export default function LocationHeader() {

  const { currentUserLocation, locationPermissions, locationLoading, getUserCurrentPosition } = useSettings();
  
  const [isModalShown, setIsModalShown] = useState<boolean>(false);

  const blinkAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blinkAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.linear
        }),
        Animated.timing(blinkAnim, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
          easing: Easing.linear
        })
      ])
    ).start();
  }, []);

  const interpolated = blinkAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0]
  });

  const handleModal = () => {
    if(!currentUserLocation) return;
    setIsModalShown(!isModalShown);
  }

  return (
    <TouchableWithoutFeedback onPress={() => handleModal()}>
      <View style={locationHeaderStyles.container}>
        <LocationModal visible={isModalShown} onClose={handleModal} coords={currentUserLocation!} />
        <TouchableOpacity style={locationHeaderStyles.container.location} onPress={() => handleModal()}>
          <View style={locationHeaderStyles.container.location.text}>
            <Text style={locationHeaderStyles.container.location.title}>Votre position</Text>
            {
              locationLoading ?
                <Animated.Text style={[locationHeaderStyles.container.location.value, {opacity: interpolated}]}>Acquisition GPS...</Animated.Text>
                :
                locationPermissions ?
                  <Text style={locationHeaderStyles.container.location.value}>{currentUserLocation?.common_name}</Text>
                  :
                  <TouchableOpacity style={locationHeaderStyles.container.location.settingsButton} onPress={() => Linking.openSettings()}>
                    <Text style={locationHeaderStyles.container.location.settingsButton.value}>Paramètres de localisation</Text>
                  </TouchableOpacity>
            }
          </View>
          <Image source={require('../../assets/icons/FiChevronDown.png')} />
        </TouchableOpacity>
        <RefreshButton action={() => getUserCurrentPosition()} />
      </View>
    </TouchableWithoutFeedback>
  )
}
