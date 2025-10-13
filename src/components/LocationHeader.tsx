import React, { useEffect, useRef, useState } from 'react'
import { Animated, Easing, Image, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native'
import { locationHeaderStyles } from '../styles/components/locationHeader'
import { useSettings } from '../contexts/AppSettingsContext';
import LocationModal from './LocationModal';
import RefreshButton from './commons/buttons/RefreshButton';
import * as Linking from 'expo-linking';
import { app_colors } from '../helpers/constants';
import { i18n } from '../helpers/scripts/i18n';

export default function LocationHeader() {

  const { currentUserLocation, locationPermissions, locationLoading, refreshCurrentUserLocation } = useSettings();

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
    if (!currentUserLocation) return;
    setIsModalShown(!isModalShown);
  }

  return (
    <TouchableWithoutFeedback onPress={() => handleModal()}>
      <View style={locationHeaderStyles.container}>
        <LocationModal visible={isModalShown} onClose={handleModal} />
        <TouchableOpacity style={locationHeaderStyles.container.location} onPress={() => handleModal()}>
          <View style={locationHeaderStyles.container.location.text}>
            <Text style={locationHeaderStyles.container.location.title}>{i18n.t('locationHeader.title')}</Text>
            {
              locationLoading ?
                <Animated.Text style={[locationHeaderStyles.container.location.value, { opacity: interpolated }]}>{i18n.t('locationHeader.aquisition')}</Animated.Text>
                :
                locationPermissions ?
                  currentUserLocation ?
                    <Text style={locationHeaderStyles.container.location.value}>{currentUserLocation?.common_name}</Text>
                    :
                    <Text style={[locationHeaderStyles.container.location.value, { color: app_colors.red_eighty }]}>{i18n.t('locationHeader.error')}</Text>
                  :
                  <TouchableOpacity style={locationHeaderStyles.container.location.settingsButton} onPress={() => Linking.openSettings()}>
                    <Text style={locationHeaderStyles.container.location.settingsButton.value}>{i18n.t('locationHeader.settings')}</Text>
                  </TouchableOpacity>
            }
          </View>
          <Image source={require('../../assets/icons/FiChevronDown.png')} style={{ width: 20, height: 20 }} />
        </TouchableOpacity>
        <RefreshButton action={() => refreshCurrentUserLocation()} />
      </View>
    </TouchableWithoutFeedback>
  )
}
