import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { useUserDataStore } from "../../../../store/userData.store"
import { globalStyles } from "../../../../helpers/globalStyles"
import { ScreenHeader } from "../../../../components/ScreenHeader/ScreenHeader"
import { useTranslation } from "react-i18next"
import { Pencil, Trash2 } from "lucide-react-native"
import { observatoryDetailsStyles } from "./ObservatoryDetails.styles"
import MapView from "react-native-maps"
import { useEffect, useRef } from "react"
import MapTargetMarker from "../../../../components/MapTargetMarker/MapTargetMarker"
import Badge from "../../../../components/Badge/Badge"
import { observatoriesAccessTypes } from "../../../../helpers/observatories/observatories"
import { app_colors } from "../../../../helpers/variables"
import { getBortleMpsas } from "../../../../helpers/lightPollution/lightPollution"

const ObservatoryDetails = () => {

  const { t, i18n } = useTranslation("settings")
  const userObservatories = useUserDataStore((state) => state.observatories)
  const removeObservatory = useUserDataStore((state) => state.removeObservatory)
  const observatoryId = useLocalSearchParams().observatory as string
  const observatory = userObservatories.find((observatory) => observatory.id === observatoryId)

  const mapRef = useRef<MapView>(null)

  const handleDeleteObservatory = () => {
    if (!observatory) return;
    // Pas de router.push ici : la suppression fait disparaître `observatory` du store, donc
    // ObservatoryDetails se re-rend avec observatory === undefined juste après, et c'est le
    // useEffect ci-dessous qui se charge de la redirection.
    removeObservatory(observatory.id)
  }

  // La redirection ne peut pas se faire directement dans le corps du rendu : ça déclencherait
  // une mise à jour de la navigation PENDANT le rendu d'ObservatoryDetails (ex: juste après une
  // suppression, qui fait passer `observatory` à undefined au re-render), ce que React refuse
  // ("Cannot update a component while rendering a different component"). Un useEffect s'exécute
  // après le rendu, donc c'est le bon endroit pour cet effet de bord.
  useEffect(() => {
    if (!observatory) {
      router.push("/settings/observatories")
    }
  }, [observatory])

  if (!observatory) {
    return null
  }

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t('observatoryDetails.screenTitle')} main={false} />

      <ScrollView>
        <View style={[globalStyles.screen.content, {backgroundColor: 'transparent'}]}>


          <Image
            source={
              observatory.image
                ? { uri: observatory.image }
                : require('../../../../../assets/images/placeholders/observatory-landscape.png')
            }
            style={observatoryDetailsStyles.locationContainer.image}
          />

          
          <View style={observatoryDetailsStyles.titleContainer}>
            <Text style={observatoryDetailsStyles.titleContainer.title}>{observatory?.display_name || (observatory?.local_names ? observatory?.local_names[i18n.language] : t('common.errors.unknown'))}</Text>
            <Text style={observatoryDetailsStyles.titleContainer.subtitle}>{observatory?.name}</Text>

            <View style={observatoryDetailsStyles.titleContainer.tags}>
              <Badge
                icon={observatoriesAccessTypes.find((accessType) => accessType.id === observatory.access)?.icon}
                text={t(`observatories.observatoryAccess.${observatory.access}`)}
                backgroundColor={app_colors.accent.light}
                foregroundColor={app_colors.primary.main}
              />

              {
                observatory.tags && observatory.tags.length > 0 && (
                  observatory.tags.map((tag) => (
                    <Badge
                      key={tag}
                      text={`#${tag}`}
                      backgroundColor={app_colors.white}
                      foregroundColor={app_colors.primary.main}
                      borderColor={app_colors.primary.light}
                    />
                  ))
                )
              }
            </View>
          </View>

          <View style={observatoryDetailsStyles.skyQualityContainer}>
            <View style={observatoryDetailsStyles.skyQualityContainer.body}>
              <View style={observatoryDetailsStyles.skyQualityContainer.body.bortleBadge}>
                <Text style={observatoryDetailsStyles.skyQualityContainer.body.bortleBadge.label}>{t('observatories.observatoryCard.bortle')}</Text>
                <Text style={observatoryDetailsStyles.skyQualityContainer.body.bortleBadge.value}>{observatory.light_pollution?.bortle}</Text>
              </View>
              <View style={observatoryDetailsStyles.skyQualityContainer.body.observatoryInfos}>
                <Text style={observatoryDetailsStyles.skyQualityContainer.body.observatoryInfos.bortleDescription}>{t(`lightPollution.indicators.${observatory.light_pollution?.bortle}`, {ns: 'common'})}</Text>
                <Text style={observatoryDetailsStyles.skyQualityContainer.body.observatoryInfos.bortleValue}>{observatory.light_pollution?.mpsas ? t(`addObservatory.stepTwo.skyQuality.sqm.value`, {sqm: observatory.light_pollution?.mpsas}) : t(`lightPollution.sqm.numeric.${observatory.light_pollution?.bortle}`, {ns: 'common'})}</Text>
                {/* <Text style={observatoryDetailsStyles.skyQualityContainer.body.observatoryInfos.bortleSource}>{t(`lightPollution.sqm.numeric.${observatory.light_pollution?.bortle}`, {ns: 'common'})}</Text> */}
              </View>
            </View>
            <View style={observatoryDetailsStyles.skyQualityContainer.bortleScale}>
              {
                [1,2,3,4,5,6,7,8,9].map((number) => (
                  <View style={[observatoryDetailsStyles.skyQualityContainer.bortleScale.bortleValue, {
                    ...(observatory.light_pollution?.bortle && number <= observatory.light_pollution.bortle ? observatoryDetailsStyles.skyQualityContainer.bortleScale.bortleValue.active : {})
                  }]} />
                ))
              }
            </View>
            <View style={observatoryDetailsStyles.skyQualityContainer.bortleScale.scaleExtremes}>
              <Text style={observatoryDetailsStyles.skyQualityContainer.bortleScale.scaleExtremes.text}>{t('addObservatory.stepTwo.skyQuality.scaleExtremes.low')}</Text>
              <Text style={observatoryDetailsStyles.skyQualityContainer.bortleScale.scaleExtremes.text}>{t('addObservatory.stepTwo.skyQuality.scaleExtremes.high')}</Text>
            </View>
          </View>
          
          <View style={observatoryDetailsStyles.locationContainer}>
            <View style={observatoryDetailsStyles.locationContainer.mapContainer}>
              <MapView
                ref={mapRef}
                style={observatoryDetailsStyles.locationContainer.mapContainer.map}
                initialRegion={{
                  latitude: observatory?.latitude || 0,
                  longitude: observatory?.longitude || 0,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <MapTargetMarker
                  coordinate={{
                    latitude: observatory?.latitude || 0,
                    longitude: observatory?.longitude || 0,
                  }}
                />
              </MapView>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <View style={globalStyles.screen.content}>
        <View style={observatoryDetailsStyles.actions}>
          <TouchableOpacity style={[globalStyles.button, {flex: 1, height: '100%'}]} onPress={() => router.push("/settings/observatories")}>
            <Pencil color="white" size={14} />
            <Text style={globalStyles.button.text}>{t('observatoryDetails.editButton')}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[globalStyles.button, {backgroundColor: app_colors.red.main}]} onPress={() => handleDeleteObservatory()}>
            <Trash2 color="white" size={22} />
          </TouchableOpacity>
        </View>
      </View>

    </View>
  )
}

export default ObservatoryDetails