import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { launchCardStyles } from '../../styles/components/cards/launchCard'
import { getLaunchStatusColor } from '../../helpers/scripts/launches/getLaunchStatusColor'

interface LaunchCardProps {
  launch: any
  navigation: any
}

export default function LaunchCard({ launch, navigation }: LaunchCardProps) {
  return (
    <TouchableOpacity style={launchCardStyles.card}>
      <Image style={launchCardStyles.card.thumbnail} resizeMode='cover' source={{uri: launch.image.thumbnail_url}} />
      <View style={launchCardStyles.card.content}>
        <View style={launchCardStyles.card.content.header}>
          <View>
            <Text style={launchCardStyles.card.content.header.title}>{launch.name.split('|')[0].trim()}</Text>
            <View style={launchCardStyles.card.content.header.subtitleContainer}>
              <Text style={launchCardStyles.card.content.header.subtitleContainer.label}>Mission : </Text>
              <Text style={launchCardStyles.card.content.header.subtitleContainer.text}>{launch.name.split('|')[1].trim()}</Text>
            </View>
          </View>
          <Text style={[launchCardStyles.card.content.header.badge, {backgroundColor: getLaunchStatusColor(launch.status.id).backgroundColor, color: getLaunchStatusColor(launch.status.id).textColor }]}>{launch.status.abbrev}</Text>
        </View>
      </View>
    </TouchableOpacity>
  )
}
