import React, {ReactNode} from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import {i18n} from "../../helpers/scripts/i18n";
import { launchCardStyles } from '../../styles/components/cards/launchCard'
import { getLaunchStatusColor } from '../../helpers/scripts/launches/getLaunchStatusColor'
import DSOValues from "../commons/DSOValues";
import dayjs from "dayjs";
import {truncate} from "../../helpers/scripts/utils/formatters/truncate";

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
              <Text style={launchCardStyles.card.content.header.subtitleContainer.text}>{truncate(launch.name.split('|')[1].trim(), 25)}</Text>
            </View>
          </View>
          <Text style={[launchCardStyles.card.content.header.badge, {backgroundColor: getLaunchStatusColor(launch.status.id).backgroundColor, color: getLaunchStatusColor(launch.status.id).textColor }]}>{launch.status.abbrev}</Text>
        </View>
        <View style={launchCardStyles.card.content.body}>
          <DSOValues small title={`${i18n.t('launchesScreen.launchCards.date')} ${launch.status.id !== 1 ? i18n.t('launchesScreen.launchCards.temporary') : ""}`} value={dayjs(launch.net).format("DD MMM YYYY")} />
          <DSOValues small title={i18n.t('launchesScreen.launchCards.launcher')} value={launch.rocket.configuration.full_name} />
          <DSOValues small title={i18n.t('launchesScreen.launchCards.operator')} value={truncate(launch.launch_service_provider.name, 25)} />
          <DSOValues small title={i18n.t('launchesScreen.launchCards.launchPad')} value={truncate(launch.pad.name, 25)} />
          <DSOValues small title={i18n.t('launchesScreen.launchCards.client')} value={launch.mission.agencies.length > 0 ? truncate(launch.mission.agencies[0].name, 25) : "N/A" } />
        </View>
      </View>
    </TouchableOpacity>
  )
}
