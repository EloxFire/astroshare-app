import React, {useEffect, useState} from 'react'
import { ActivityIndicator, Dimensions, ScrollView, Text, View } from 'react-native'
import { globalStyles } from '../styles/global'
import { apodStyles } from '../styles/screens/apod'
import { APODPicture } from '../helpers/types/APODPicture'
import { app_colors } from '../helpers/constants'
import PageTitle from '../components/commons/PageTitle'
import dayjs from 'dayjs'
import { i18n } from '../helpers/scripts/i18n'
import { useSettings } from '../contexts/AppSettingsContext'
import { useAuth } from '../contexts/AuthContext'
import { useTranslation } from '../hooks/useTranslation'
import { sendAnalyticsEvent } from '../helpers/scripts/analytics'
import { eventTypes } from '../helpers/constants/analytics'
import {renderApodMedia} from "../helpers/scripts/apod/renderApod";
import {fetchApod} from "../helpers/scripts/apod/getApod";

export default function Apod({ navigation }: any) {
  const { currentUserLocation } = useSettings()
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()

  const [loadingMedia, setLoadingMedia] = useState(false)
  const [apod, setApod] = useState<APODPicture | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      setLoadingMedia(true)
      setError(null)
      const res = await fetchApod({ timeoutMs: 7000 }) // ex: timeout custom

      if (res.ok) {
        setApod(res.data)
        setError(null)
      } else {
        // Différencier les erreurs ici
        switch (res.reason) {
          case 'timeout':
            // ex: proposer un retry agressif, garder dummy en fond
            setError(i18n.t('apod.errors.timeout') || "Le serveur met trop de temps à répondre. Réessaie.")
            setApod(null)
            break
          case 'network':
            setError(i18n.t('apod.errors.network') || "Problème de connexion réseau.")
            break
          case 'http':
            setError(
              (i18n.t('apod.errors.httpWithCode', { code: res.status }) as string) ||
              `Le serveur a répondu avec le code ${res.status}.`
            )
            break
          case 'parse':
            setError(i18n.t('apod.errors.malformed') || "Réponse serveur invalide.")
            break
          default:
            setError(i18n.t('apod.errors.fetchError') || "Erreur inattendue.")
        }
      }

      setLoadingMedia(false)

      // Analytics quand on a des données (même dummy)
      sendAnalyticsEvent(
        currentUser,
        currentUserLocation,
        'APOD screen view',
        eventTypes.SCREEN_VIEW,
        { media_type: (res.ok ? res.data : apod)?.media_type, apodTitle: (res.ok ? res.data : apod)?.title || 'N/A' },
        currentLocale
      )
    })()
  }, []);

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('home.buttons.apod.title')}
        subtitle={i18n.t('home.buttons.apod.subtitle')}
      />

      <View style={globalStyles.screens.separator} />

      <ScrollView contentContainerStyle={{paddingBottom: 80}}>
        {
          loadingMedia && (
            <View style={{height: Dimensions.get('window').height - 200, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <ActivityIndicator size="large" color={app_colors.white} style={{marginBottom: 20}} />
              <Text style={apodStyles.content.loadingText}>{i18n.t('common.loadings.simple')}</Text>
            </View>
          )
        }
        {
          !loadingMedia && error && (
            <View style={{height: Dimensions.get('window').height - 200, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <View style={apodStyles.content.errorBox}>
                <Text style={apodStyles.content.loadingText}>{error}</Text>
              </View>
            </View>
          )
        }
        {
          !loadingMedia && !error && apod && (
            <View>
              { renderApodMedia(apod, currentLocale) }
              <Text style={apodStyles.content.imageTitle}>{apod.title}</Text>
              { apod.copyright && <Text style={apodStyles.content.imageSubtitle}>{i18n.t('apod.copyrights')} : {apod.copyright.replace(/\n/g, '')}</Text>}
              <Text style={apodStyles.content.imageSubtitle}>{i18n.t('apod.date')} : {dayjs(apod.date).format("DD/MM/YYYY")}</Text>
              <Text style={apodStyles.content.imageDescriptionTitle}>{i18n.t('apod.explanation')} :</Text>
              <Text style={apodStyles.content.imageDescription}>{apod.explanation}</Text>
            </View>
          )
        }
      </ScrollView>
    </View>
  )
}
