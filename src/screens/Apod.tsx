import React, { useEffect, useState } from 'react'
import { Dimensions, Image, ScrollView, Text, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { apodStyles } from '../styles/screens/apod'
import { showToast } from '../helpers/scripts/showToast'
import { APODPicture } from '../helpers/types/APODPicture'
import axios from 'axios'
import Toast from 'react-native-root-toast'
import PageTitle from '../components/commons/PageTitle'
import { app_colors } from '../helpers/constants'
import dayjs from 'dayjs'

export default function Apod({ navigation }: any) {

  const [apod, setApod] = useState<APODPicture | null>(null)
  
  useEffect(() => {
    getApod()
  }, [])

  const getApod = async () => {
    try {
      const picture = await axios.get(process.env.EXPO_PUBLIC_ASTROSHARE_API_URL + '/apod');
      setApod(picture.data.data);   
      showToast({ message: 'Image récupérée', duration: Toast.durations.SHORT, type: 'success' });
    } catch (error) {
      console.log(error)
      showToast({ message: 'Une erreur est survenue', duration: Toast.durations.SHORT, type: 'error' });
    }
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title="APOD" subtitle="// Image du jour de la NASA" />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={apodStyles.content}>
          <Text style={apodStyles.content.title}>The 37 Cluster</Text>
          <Text style={[apodStyles.content.text, {color: app_colors.white_eighty}]}>Copyright : {apod?.copyright || "Chargement"}</Text>
          <Text style={[apodStyles.content.text, {color: app_colors.white_eighty, marginTop: 5}]}>Date : {apod?.date ? dayjs(apod?.date).format('DD/MM/YYYY') : "Chargement"}</Text>
          {
            apod?.media_type === 'image' && (
              <Image source={{ uri: apod?.url }} style={{ width: Dimensions.get('screen').width, height: Dimensions.get('screen').width }} resizeMode='contain'/>
            )
          }
          {
            apod?.media_type === 'video' && (
              <Text style={[apodStyles.content.text, {color: app_colors.white_eighty}]}>Vidéo non supportée...</Text>
            )
          }
          <Text style={apodStyles.content.subtitle}>Description :</Text>
          <Text style={[apodStyles.content.text, {fontSize: 20, alignSelf: 'flex-start', lineHeight: 28}]}>{apod?.explanation || 'Chargement'}</Text>
        </View>
      </ScrollView>
    </View>
  )
}
