import React, { useEffect, useRef, useState } from 'react'
import {ActivityIndicator, Dimensions, Image, ScrollView, Text, View} from 'react-native'
import { globalStyles } from '../styles/global'
import { apodStyles } from '../styles/screens/apod'
import { showToast } from '../helpers/scripts/showToast'
import { APODPicture } from '../helpers/types/APODPicture'
import { app_colors } from '../helpers/constants'
import { ResizeMode, Video } from 'expo-av'
import axios from 'axios'
import Toast from 'react-native-root-toast'
import PageTitle from '../components/commons/PageTitle'
import dayjs from 'dayjs'
import YoutubePlayer from "react-native-youtube-iframe";
import { i18n } from '../helpers/scripts/i18n'

export default function Apod({ navigation }: any) {

  const [apod, setApod] = useState<APODPicture | null>(null)
  const [apodSize, setApodSize] = useState({ width: 0, height: 0 })
  const videoRef = useRef(null);
  const [loading, setLoading] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    getApod()
  }, [])

  const getApod = async () => {
    setLoading(true)
    try {
      const picture = await axios.get(process.env.EXPO_PUBLIC_ASTROSHARE_API_URL + '/apod');
      setApod(picture.data.data);

      if(picture.data.data.media_type === 'image'){
        Image.getSize(picture.data.data.url, (width, height) => {
          const maxWidth = Dimensions.get('window').width - 20;
          const maxHeight = Dimensions.get('window').width - 20;

          if (width > maxWidth) {
            const ratio = maxWidth / width;
            width = maxWidth;
            height = height * ratio;
          }

          if (height > maxHeight) {
            const ratio = maxHeight / height;
            height = maxHeight;
            width = width * ratio;
          }

          console.log("Adjusted Image size: ", width, height);
          setApodSize({ width, height });
        });
      }
      showToast({ message: 'Image récupérée', duration: Toast.durations.SHORT, type: 'success' });
      setLoading(false)
    } catch (error) {
      console.log(error)
      showToast({ message: 'Une erreur est survenue', duration: Toast.durations.SHORT, type: 'error' });
      setLoading(false)
    }
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title={i18n.t('home.buttons.apod.title')} subtitle={i18n.t('home.buttons.apod.subtitle')} />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={apodStyles.content}>
          <Text style={apodStyles.content.title}>{apod?.title.replace(/(\r\n|\n|\r)/gm, "") || i18n.t('common.loadings.simple')}</Text>
          {apod?.copyright && <Text style={[apodStyles.content.text, { color: app_colors.white_eighty, textAlign: 'center', fontFamily: 'DMMonoRegular' }]}>Copyright : {apod?.copyright.replace(/(\r\n|\n|\r)/gm, "") || i18n.t('common.loadings.simple')}</Text>}
          <Text style={[apodStyles.content.text, { color: app_colors.white_eighty, marginTop: 5, fontFamily: 'DMMonoRegular' }]}>Date : {apod?.date ? dayjs(apod?.date).format('DD/MM/YYYY') : i18n.t('common.loadings.simple')}</Text>
            {
              loading &&
              <ActivityIndicator size="large" color={app_colors.white} />
            }
            {
              !loading && apod && apod.media_type === 'video' && (
                apod?.url.includes('youtube') ?
                  <YoutubePlayer
                    width={Dimensions.get('screen').width}
                    height={(Dimensions.get('screen').width) / (16 / 9)}
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
              )
            }
            {
              !loading && apod && apod.media_type === 'image' && (
                <Image source={!loaded ? require('../../assets/images/placeholders/fr/image.png') : { uri: apod.url }} onLoad={() => setLoaded(true)} width={apodSize.width} height={apodSize.height} style={apodStyles.content.image} resizeMode='contain' />
              )
            }
          {
            !loading && apod && apod.media_type === 'other' && (
              <View style={{marginVertical: 40}}>
                <Text style={{ color: app_colors.red, textAlign: 'center', fontFamily: 'DMMonoRegular', paddingHorizontal: 20, paddingVertical: 10, backgroundColor: app_colors.white_no_opacity, borderWidth: 1, borderColor: app_colors.white_twenty, borderRadius: 10 }}>Aperçu non disponible ou type de contenu non supporté...</Text>
              </View>
            )
          }

          <Text style={apodStyles.content.subtitle}>Description :</Text>
          <Text style={[apodStyles.content.text, { fontSize: 16, alignSelf: 'flex-start', lineHeight: 25 }]}>{apod?.explanation || i18n.t('common.loadings.simple')}</Text>
        </View>
      </ScrollView>
    </View>
  )
}
