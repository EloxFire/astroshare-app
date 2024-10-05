import React, {ReactNode} from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import {i18n} from "../../helpers/scripts/i18n";
import { launchCardStyles } from '../../styles/components/cards/launchCard'
import { getLaunchStatusColor } from '../../helpers/scripts/launches/getLaunchStatusColor'
import DSOValues from "../commons/DSOValues";
import dayjs from "dayjs";

interface LaunchCardProps {
  launch: any
  navigation: any
}

export default function LaunchCard({ launch, navigation }: LaunchCardProps): ReactNode {

  return (
    <TouchableOpacity style={launchCardStyles.card}>
      <Image style={launchCardStyles.card.thumbnail} resizeMode='cover' source={{uri: launch.image.thumbnail_url}} />
      <View style={launchCardStyles.card.content}>
        <View style={launchCardStyles.card.content.header}>
          <View>
            <Text style={launchCardStyles.card.content.header.title}>{launch.name.split('|')[0].trim()}</Text>
            <View style={launchCardStyles.card.content.header.subtitleContainer}>
              <Text style={launchCardStyles.card.content.header.subtitleContainer.label}>Mission : </Text>
              <Text style={launchCardStyles.card.content.header.subtitleContainer.text}>{launch.name.split('|')[1].trim().length > 20 ? `${launch.name.split('|')[1].trim().slice(0, 20)}...` : launch.name.split('|')[1].trim()}</Text>
            </View>
          </View>
          <Text style={[launchCardStyles.card.content.header.badge, {backgroundColor: getLaunchStatusColor(launch.status.id).backgroundColor, color: getLaunchStatusColor(launch.status.id).textColor }]}>{launch.status.abbrev}</Text>
        </View>
        <View style={launchCardStyles.card.content.body}>
          <DSOValues small title={`${i18n.t('launchesScreen.launchCards.date')} ${launch.status.id !== 1 ? i18n.t('launchesScreen.launchCards.temporary') : ""}`} value={dayjs(launch.net).format("DD MMM YYYY")} />
          <DSOValues small title={i18n.t('launchesScreen.launchCards.launcher')} value={launch.rocket.configuration.full_name} />
          <DSOValues small title={i18n.t('launchesScreen.launchCards.operator')} value={`${launch.launch_service_provider.name.length > 25 ? `${launch.launch_service_provider.name.slice(0, 25)}...` : launch.launch_service_provider.name}`} />
          <DSOValues small title={i18n.t('launchesScreen.launchCards.launchPad')} value={launch.pad.name} />
          <DSOValues small title={i18n.t('launchesScreen.launchCards.client')} value={launch.mission.agencies.length > 0 ? launch.mission.agencies[0].name : "N/A" } />
        </View>
      </View>
    </TouchableOpacity>
  )
}
