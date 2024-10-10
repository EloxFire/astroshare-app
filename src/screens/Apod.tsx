import React, { useEffect, useRef, useState } from 'react'
import {Dimensions, Image, ImageBackground, ScrollView, Text, View} from 'react-native'
import { globalStyles } from '../styles/global'
import { apodStyles } from '../styles/screens/apod'
import { showToast } from '../helpers/scripts/showToast'
import { APODPicture } from '../helpers/types/APODPicture'
import { app_colors } from '../helpers/constants'
import { ResizeMode, Video } from 'expo-av'
import * as Clipboard from 'expo-clipboard'
import axios from 'axios'
import Toast from 'react-native-root-toast'
import PageTitle from '../components/commons/PageTitle'
import dayjs from 'dayjs'
import WebView from 'react-native-webview'
import YoutubePlayer from "react-native-youtube-iframe";
import { i18n } from '../helpers/scripts/i18n'

export default function Apod({ navigation }: any) {

  const [apod, setApod] = useState<APODPicture | null>(null)
  const videoRef = useRef(null);

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
      <PageTitle navigation={navigation} title={i18n.t('home.buttons.apod.title')} subtitle={i18n.t('home.buttons.apod.subtitle')} />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={apodStyles.content}>
          <Text style={apodStyles.content.title}>{apod?.title.replace(/(\r\n|\n|\r)/gm, "") || i18n.t('common.loadings.simple')}</Text>
          {apod?.copyright && <Text style={[apodStyles.content.text, { color: app_colors.white_eighty }]}>Copyright : {apod?.copyright.replace(/(\r\n|\n|\r)/gm, "") || i18n.t('common.loadings.simple')}</Text>}
          <Text style={[apodStyles.content.text, { color: app_colors.white_eighty, marginTop: 5 }]}>Date : {apod?.date ? dayjs(apod?.date).format('DD/MM/YYYY') : i18n.t('common.loadings.simple')}</Text>
          {
            apod?.media_type === 'video' ?
              apod?.url.includes('youtube') ?
                <YoutubePlayer
                  width={Dimensions.get('screen').width - 20}
                  height={(Dimensions.get('screen').width - 20) / (16 / 9)}
                  play
                  videoId={apod?.url.split('embed/')[1].split('?')[0]}
                />
                :
                <Video
                  ref={videoRef}
                  source={{ uri: apod?.url || '' }}
                  isMuted={true}
                  rate={1.0}
                  shouldPlay={true}
                  isLooping={true}
                  resizeMode={ResizeMode.CONTAIN}
                  style={{ width: Dimensions.get('screen').width, height: Dimensions.get('screen').width, marginVertical: 10 }}
                />
              :
              apod?.media_type === 'image' && (
                <Image source={{ uri: apod?.url }} style={{width: Dimensions.get('screen').width, height: Dimensions.get('screen').width, marginVertical: 10}} resizeMode='contain' />
              )
          }

          <Text style={apodStyles.content.subtitle}>Description :</Text>
          <Text style={[apodStyles.content.text, { fontSize: 16, alignSelf: 'flex-start', lineHeight: 25 }]}>{apod?.explanation || i18n.t('common.loadings.simple')}</Text>
        </View>
      </ScrollView>
    </View>
  )
}
