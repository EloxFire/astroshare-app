import React, { useEffect, useState } from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import { launchCardStyles } from '../../styles/components/cards/launchCard'
import { getLaunchStatusColor } from '../../helpers/scripts/launches/getLaunchStatusColor'
import axios from 'axios'

interface LaunchCardProps {
  launch: any
  navigation: any
}

export default function LaunchCard({ launch, navigation }: LaunchCardProps) {

  const [agencyDetails, setAgencyDetails] = useState<any>(null)

  useEffect(() => {
    getAgencyDetails()
  }, [])

  const getAgencyDetails = async () => {
    const agency = await axios.get(launch.launch_service_provider.url)
    setAgencyDetails(agency.data)
  }

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
        <View style={launchCardStyles.card.content.body}>
          <View style={launchCardStyles.card.content.body.info}>
            <Text style={launchCardStyles.card.content.body.info.label}>Lanceur</Text>
            <Text style={launchCardStyles.card.content.body.info.text}>{launch.rocket.configuration.full_name}</Text>
          </View>
          <View style={launchCardStyles.card.content.body.info}>
            <Text style={launchCardStyles.card.content.body.info.label}>Pas de tir</Text>
            <Text style={launchCardStyles.card.content.body.info.text}>{launch.pad.name}</Text>
          </View>
        </View>
        <View style={launchCardStyles.card.content.body}>
          <View style={launchCardStyles.card.content.body.info}>
            <Text style={launchCardStyles.card.content.body.info.label}>Opérateur</Text>
            <Image source={{uri: agencyDetails?.social_logo.image_url}} style={{marginTop: 2}} resizeMode='contain' width={30} height={30} />
          </View>
          <View style={launchCardStyles.card.content.body.info}>
            <Text style={launchCardStyles.card.content.body.info.label}>Pas de tir</Text>
            <Text style={launchCardStyles.card.content.body.info.text}>{launch.pad.name}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}
