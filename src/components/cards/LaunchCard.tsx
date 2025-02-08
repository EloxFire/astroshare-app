import React, {ReactNode} from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'
import {i18n} from "../../helpers/scripts/i18n";
import { launchCardStyles } from '../../styles/components/cards/launchCard'
import { getLaunchStatusColor } from '../../helpers/scripts/launches/getLaunchStatusColor'
import DSOValues from "../commons/DSOValues";
import dayjs from "dayjs";
import {truncate} from "../../helpers/scripts/utils/formatters/truncate";
import {routes} from "../../helpers/routes";
import {localizedNoRocketImageSmall} from "../../helpers/scripts/loadImages";
import {useTranslation} from "../../hooks/useTranslation";

interface LaunchCardProps {
  launch: any
  navigation: any
  noFollow?: boolean
}

export default function LaunchCard({ launch, navigation, noFollow }: LaunchCardProps): ReactNode {

  const {currentLocale} = useTranslation()

  return (
    <TouchableOpacity style={launchCardStyles.card} disabled={noFollow} onPress={() => navigation.navigate(routes.launchDetails.path, {launch: launch})}>
      {
        launch.image ?
        <Image style={launchCardStyles.card.thumbnail} resizeMode='cover' source={{uri: launch.image.thumbnail_url}} />
          :
        <Image style={launchCardStyles.card.thumbnail} resizeMode='cover' source={localizedNoRocketImageSmall[currentLocale]} />
      }
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
          <DSOValues title={`${i18n.t('launchesScreen.launchCards.date')} ${launch.status.id === 2 || launch.status.id === 8 ? i18n.t('launchesScreen.launchCards.temporary') : ""}`} value={dayjs(launch.net).format("DD MMM YYYY")} />
          <DSOValues title={i18n.t('launchesScreen.launchCards.launcher')} value={launch.rocket.configuration.full_name} />
          <DSOValues title={i18n.t('launchesScreen.launchCards.operator')} value={truncate(launch.launch_service_provider.name, 18)} />
          <DSOValues title={i18n.t('launchesScreen.launchCards.launchPad')} value={truncate(launch.pad.name, 15)} />
          <DSOValues title={i18n.t('launchesScreen.launchCards.client')} value={launch.mission.agencies.length > 0 ? launch.mission.agencies[0].name.length > 25 ? launch.mission.agencies[0].abbrev : truncate(launch.mission.agencies[0].name, 25) : "N/A" } />
        </View>
      </View>
    </TouchableOpacity>
  )
}
