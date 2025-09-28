import React from 'react'
import {Image, ImageSourcePropType, Linking, Text, TouchableOpacity, View} from 'react-native'
import {newsBarStyles} from "../../styles/components/banners/newsBar";
import {LinearGradient} from "expo-linear-gradient";
import { useAuth } from '../../contexts/AuthContext';
import { useTranslation } from '../../hooks/useTranslation';
import { useSettings } from '../../contexts/AppSettingsContext';
import { sendAnalyticsEvent } from '../../helpers/scripts/analytics';
import { eventTypes } from '../../helpers/constants/analytics';

interface NewsBarProps {
  navigation: any
  icon: string
  title: string
  description: string
  colors: string // String of colors (hex) separated by semicolon exemple #FFFFFF;#000000
  type: 'internal' | 'external' | 'none'
  order: number
  externalLink?: string
  internalRoute?: string
  createdAt?: Date
}

export default function NewsBar({navigation, icon, type, colors, internalRoute, externalLink, description, title}: NewsBarProps) {

  const {currentUser} = useAuth()
  const { currentLocale } = useTranslation()
  const { currentUserLocation } = useSettings()

  const handlePress = () => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'click_news_banner', eventTypes.BUTTON_CLICK, { title, type, internalRoute, externalLink }, currentLocale)
    if (type === 'internal' && internalRoute) {
      navigation.navigate(internalRoute)
    } else if (type === 'external' && externalLink) {
      Linking.openURL(externalLink)
    }
  }

  return (
    <TouchableOpacity disabled={type === 'none'} onPress={handlePress}>
      <LinearGradient style={newsBarStyles.bar} colors={[colors.split(';')[0], colors.split(';')[1]]} start={{x: 0, y: -1}} end={{x: 1, y: 2}} dither>
        <Image source={{uri: icon}} style={newsBarStyles.bar.icon} />
        <View style={newsBarStyles.bar.infos}>
          <Text style={newsBarStyles.bar.infos.title}>{title}</Text>
          <Text style={newsBarStyles.bar.infos.description}>{description}</Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  )
}
