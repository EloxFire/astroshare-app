import React, {useEffect, useState} from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { issPassCardStyles } from '../../styles/components/cards/issPassCard'
import dayjs from 'dayjs';
import { useTranslation } from '../../hooks/useTranslation';
import { formatMinutes } from '../../helpers/scripts/utils/formatters/formaters';
import DSOValues from '../commons/DSOValues';
import {IssPass} from "../../helpers/types/IssPass";

interface IssPassCardProps {
  pass: IssPass;
  navigation: any;
}

export default function IssPassCard({ pass, navigation }: IssPassCardProps) {

  const {currentLocale} = useTranslation()

  const [passLength, setPassLength] = useState<string>('')

  // https://api.n2yo.com/rest/v1/satellite/visualpasses/25544/43.5314643/5.4508237/341/1/45/&apiKey=SQCWS8-7VQKED-JG2RHW-5DGF
  useEffect(() => {
    const date1 = dayjs.unix(pass.startUTC)
    const date2 = dayjs.unix(pass.endUTC)
    const diff = date2.diff(date1)
    setPassLength(dayjs.duration(diff).format('mm:ss').replace(':', 'm') + 's')
  }, []);

  return (
    <TouchableOpacity style={issPassCardStyles.card}>
      <View style={issPassCardStyles.card.header.title}>
        <Text style={issPassCardStyles.card.header.title}>{dayjs.unix(pass.startUTC).format('ddd DD MMM YYYY')}</Text>
      </View>
      <DSOValues title='Début' value={dayjs.unix(pass.startUTC).format('HH:mm:ss')} />
      <DSOValues title='Fin' value={dayjs.unix(pass.endUTC).format('HH:mm:ss')} />
      <DSOValues title='Durée' value={passLength} />
    </TouchableOpacity>
  )
}
