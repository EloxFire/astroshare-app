import React, { useEffect, useState } from 'react'
import { Image, Keyboard, Text, TouchableOpacity, View } from 'react-native'
import PageTitle from '../components/commons/PageTitle'
import { globalStyles } from '../styles/global'
import { moonPhasesStyles } from '../styles/screens/moonPhases'
import { getLunarAge, getLunarDistance, getLunarElongation, getLunarIllumination, getLunarPhase, isFullMoon, isNewMoon } from '@observerly/astrometry'
import InputWithIcon from '../components/forms/InputWithIcon'
import { showToast } from '../helpers/scripts/showToast'
import Toast from 'react-native-root-toast'
import dayjs from 'dayjs'
import BigValue from '../components/commons/BigValue'
import { moonIcons } from '../helpers/scripts/loadImages'
import DateTimePicker from '@react-native-community/datetimepicker';
import SimpleButton from '../components/commons/buttons/SimpleButton'

export default function MoonPhases({ navigation }: any) {

  const [date, setDate] = useState<Date>(new Date())
  const [moonData, setMoonData] = useState<any>(null)
  const [isDateModalVisible, setIsDateModalVisible] = useState(false)

  const formatter = new Intl.NumberFormat("fr-FR", {
    style: 'unit',
    unit: 'kilometer',
    unitDisplay: 'short',
    maximumFractionDigits: 0
  });

  useEffect(() => {
    getMoonData()
  }, [date])

  const getMoonData = () => {
    const phase = getLunarPhase(date)
    const illumination = Math.floor(getLunarIllumination(date))
    const distance = Math.floor(getLunarDistance(date))
    const elongation = Math.floor(getLunarElongation(date))
    const newMoon = isNewMoon(date)
    const fullMoon = isFullMoon(date)
    const age = Math.floor(getLunarAge(date).age)

    setMoonData({
      phase,
      illumination,
      distance,
      elongation,
      newMoon,
      fullMoon,
      age
    })
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title="Phases de la lune" subtitle="// Calculez les phases de la Lune" />
      <View style={globalStyles.screens.separator} />
      <View style={moonPhasesStyles.content}>
        <Text style={moonPhasesStyles.content.title}>Lune du {dayjs(date).format('DD MMMM YYYY')}</Text>
        <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
          <TouchableOpacity onPress={() => setIsDateModalVisible(true)} style={moonPhasesStyles.content.selectButton}>
            <Text style={moonPhasesStyles.content.selectButton.text}>Sélectioner une date</Text>
          </TouchableOpacity>
          <SimpleButton icon={require('../../assets/icons/FiRepeat.png')} small onPress={() => setDate(new Date())} />
        </View>

        {
          isDateModalVisible &&
          <DateTimePicker
            value={date}
            mode='date'
            display='default'
            onChange={(event, selectedDate) => {
              console.log(selectedDate);

              if (event.type === 'dismissed') {
                setIsDateModalVisible(false)
              }
              if (event.type === 'set' && selectedDate) {
                setIsDateModalVisible(false)
                setDate(selectedDate)
              }
            }}
          />
        }

        <Image source={moonData?.phase ? moonIcons[moonData?.phase] : moonIcons["Full"]} style={{ height: 200, width: 200, alignSelf: 'center', marginVertical: 20 }} resizeMode='contain' />

        <View style={moonPhasesStyles.content.values}>
          <BigValue label="Phase" value={moonData?.phase} />
          <BigValue right label="Illumination" value={moonData?.illumination + '%'} />
        </View>
        <View style={moonPhasesStyles.content.values}>
          <BigValue label="Distance" value={formatter.format(moonData?.distance)} />
          <BigValue right label="Élongation" value={moonData?.elongation + '°'} />
        </View>
        <View style={moonPhasesStyles.content.values}>
          <BigValue label="Nouvelle lune" value={moonData?.newMoon ? 'Oui' : 'Non'} />
          <BigValue right label="Pleine lune" value={moonData?.fullMoon ? 'Oui' : 'Non'} />
        </View>
        <View style={moonPhasesStyles.content.values}>
          <BigValue label="Âge" value={moonData?.age + `${moonData?.age > 1 ? ' jours' : ' jour'}`} />
        </View>
      </View>
    </View>
  )
}
