import React from 'react'
import { Text, View } from 'react-native'
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

  return (
    <View style={issPassCardStyles.card}>
      <View style={issPassCardStyles.card.header.title}>
        <Text style={issPassCardStyles.card.header.title}>{dayjs(pass.startTime).format('DD MMM YYYY')}</Text>
      </View>
      <DSOValues title='Début' value={dayjs(pass.startTime).format('HH:mm:ss')} />
      <DSOValues title='Fin' value={dayjs(pass.endTime).format('HH:mm:ss')} />
      <DSOValues title='Élévation' value={`${Math.round(pass.maxElevation)}°`} />
      {/* <DSOValues title='Durée' value={formatMinutes(pass.duration, currentLocale)} /> */}
    </View>
  )
}
