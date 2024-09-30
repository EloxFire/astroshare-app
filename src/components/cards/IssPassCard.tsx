import React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { issPassCardStyles } from '../../styles/components/cards/issPassCard'
import { IssPass } from '../../helpers/scripts/utils/satellites/getNextIssPasses'
import dayjs from 'dayjs';
import { useTranslation } from '../../hooks/useTranslation';
import { formatMinutes } from '../../helpers/scripts/utils/formatters/formaters';
import DSOValues from '../commons/DSOValues';

interface IssPassCardProps {
  pass: IssPass;
  navigation: any;
}

export default function IssPassCard({ pass, navigation }: IssPassCardProps) {

  const {currentLocale} = useTranslation()

  const passLength = `${dayjs(pass.endTime).diff(dayjs(pass.startTime), 'minute')} min`
  return (
    <TouchableOpacity style={issPassCardStyles.card}>
      <View style={issPassCardStyles.card.header.title}>
        <Text style={issPassCardStyles.card.header.title}>{dayjs(pass.startTime).format('ddd DD MMM YYYY')}</Text>
      </View>
      <DSOValues title='Début' value={dayjs(pass.startTime).format('HH:mm:ss')} />
      <DSOValues title='Fin' value={dayjs(pass.endTime).format('HH:mm:ss')} />
      <DSOValues title='Élévation initiale' value={`${Math.round(pass.startElevation)}°`} />
      <DSOValues title='Élévation max' value={`${Math.round(pass.maxElevation)}°`} />
      <DSOValues title='Élévation finale' value={`${Math.round(pass.endElevation)}°`} />
      <DSOValues title='Durée' value={passLength} />
      <DSOValues title='Direction initiale' value={`${pass.startDirectionCardinal} (${Math.round(pass.startAzimuth)}°)`} />
      <DSOValues title='Direction finale' value={`${pass.endDirectionCardinal} (${Math.round(pass.endAzimuth)}°)`} />
    </TouchableOpacity>
  )
}
