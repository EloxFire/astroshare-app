import { Image, Linking, Platform, Text, TouchableOpacity, View } from "react-native"
import { router, useLocalSearchParams } from "expo-router"
import { useUserDataStore } from "../../../../store/userData.store"
import { globalStyles } from "../../../../helpers/globalStyles"
import { ImageHeaderScrollView } from "../../../../components/ImageHeaderScrollView/ImageHeaderScrollView"
import { useTranslation } from "react-i18next"
import { Copy, Navigation, Pencil, Share2, Trash2 } from "lucide-react-native"
import { observatoryDetailsStyles } from "./ObservatoryDetails.styles"
import MapView, { Marker } from "react-native-maps"
import { useEffect, useRef } from "react"
import { observatoriesAccessTypes, observatoriesEquipments } from "../../../../helpers/observatories/observatories"
import { app_colors } from "../../../../helpers/variables"
import ListCard from "../../../../components/cards/ListCard/ListCard"
import { convertDecimalLatitudeToDMS, convertDecimalLongitudeToDMS } from "../../../../helpers/location/convert"
import * as Clipboard from 'expo-clipboard';
import ListBadge from "../../../../components/Badges/ListBadge/ListBadge"
import Badge from "../../../../components/Badges/Badge/Badge"
import MapTargetMarker from "../../../../components/MapTargetMarker/MapTargetMarker"

const ObservatoryDetails = () => {

  const { t, i18n } = useTranslation("settings/observatoryDetails")
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

  const handleCopyCoordinates = () => {
    if(!observatory) return;
    Clipboard.setStringAsync(`${observatory.latitude}, ${observatory.longitude}`)
  }

  const handleGetDirections = () => {
    if(!observatory) return;

    // Open the default maps app with the observatory's coordinates: on iOS, a maps.apple.com
    // link opens Apple Maps directly (no Info.plist declaration needed); Google Maps elsewhere.
    const destination = `${observatory.latitude},${observatory.longitude}`;
    const url = Platform.OS === "ios"
      ? `https://maps.apple.com/?daddr=${destination}`
      : `https://www.google.com/maps/dir/?api=1&destination=${destination}`;
    Linking.openURL(url);
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
      <ImageHeaderScrollView title={t('screenTitle')} image={observatory.image ? {uri: observatory.image} : require('../../../../../assets/images/placeholders/observatory-landscape.png')}>
        <View style={[globalStyles.screen.content, {backgroundColor: 'transparent'}]}>

          <View style={observatoryDetailsStyles.titleContainer}>
            <Text style={observatoryDetailsStyles.titleContainer.title}>{observatory?.display_name || (observatory?.local_names ? observatory?.local_names[i18n.language] : t('common.errors.unknown'))}</Text>
            <Text style={observatoryDetailsStyles.titleContainer.subtitle}>{observatory?.name} {observatory.state ? ` - ${observatory.state}` : ''} {observatory.country ? ` - ${observatory.country}` : ''}</Text>

            <View style={observatoryDetailsStyles.titleContainer.tags}>
              <Badge
                icon={observatoriesAccessTypes.find((accessType) => accessType.id === observatory.access)?.icon}
                text={t(`observatories.observatoryAccess.${observatory.access}`, {ns: 'settings'})}
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
                <Text style={observatoryDetailsStyles.skyQualityContainer.body.bortleBadge.label}>{t('observatories.observatoryCard.bortle', {ns: 'settings'})}</Text>
                <Text style={observatoryDetailsStyles.skyQualityContainer.body.bortleBadge.value}>{observatory.light_pollution?.bortle}</Text>
              </View>
              <View style={observatoryDetailsStyles.skyQualityContainer.body.observatoryInfos}>
                <Text style={observatoryDetailsStyles.skyQualityContainer.body.observatoryInfos.bortleDescription}>{t(`lightPollution.indicators.${observatory.light_pollution?.bortle}`, {ns: 'common'})}</Text>
                <Text style={observatoryDetailsStyles.skyQualityContainer.body.observatoryInfos.bortleValue}>{observatory.light_pollution?.mpsas ? t(`stepTwo.skyQuality.sqm.value`, {ns: 'settings/addObservatory', sqm: observatory.light_pollution?.mpsas}) : t(`lightPollution.sqm.numeric.${observatory.light_pollution?.bortle}`, {ns: 'common'})}</Text>
                {/* <Text style={observatoryDetailsStyles.skyQualityContainer.body.observatoryInfos.bortleSource}>{t(`lightPollution.sqm.numeric.${observatory.light_pollution?.bortle}`, {ns: 'common'})}</Text> */}
              </View>
            </View>
            <View style={observatoryDetailsStyles.skyQualityContainer.bortleScale}>
              {
                [1,2,3,4,5,6,7,8,9].map((number) => (
                  <View key={number} style={[observatoryDetailsStyles.skyQualityContainer.bortleScale.bortleValue, {
                    ...(observatory.light_pollution?.bortle && number <= observatory.light_pollution.bortle ? observatoryDetailsStyles.skyQualityContainer.bortleScale.bortleValue.active : {})
                  }]} />
                ))
              }
            </View>
            <View style={observatoryDetailsStyles.skyQualityContainer.bortleScale.scaleExtremes}>
              <Text style={observatoryDetailsStyles.skyQualityContainer.bortleScale.scaleExtremes.text}>{t('stepTwo.skyQuality.scaleExtremes.low', {ns: 'settings/addObservatory'})}</Text>
              <Text style={observatoryDetailsStyles.skyQualityContainer.bortleScale.scaleExtremes.text}>{t('stepTwo.skyQuality.scaleExtremes.high', {ns: 'settings/addObservatory'})}</Text>
            </View>
          </View>

          <View>
            <View style={observatoryDetailsStyles.mapContainer}>
              <MapView
                ref={mapRef}
                style={{flex: 1}}
                initialRegion={{
                  latitude: observatory.latitude,
                  longitude: observatory.longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <MapTargetMarker
                  coordinate={{
                    latitude: observatory.latitude,
                    longitude: observatory.longitude,
                  }}
                />
              </MapView>
            </View>
            
            <ListCard
              items={[
                {
                  title: t('location.latitude'),
                  value: convertDecimalLatitudeToDMS(observatory.latitude)
                },
                {
                  title: t('location.longitude'),
                  value: convertDecimalLongitudeToDMS(observatory.longitude)
                },
                {
                  title: t('location.elevation'),
                  value: observatory.elevation ? `${observatory.elevation} m` : t('errors.unknown', {ns: 'common'})
                }
              ]}

              additionalContainerStyles={{
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                borderTopWidth: 0
              }}

              buttons={[
                {
                  title: t('location.buttons.copy'),
                  onPress: () => handleCopyCoordinates(),
                  icon: Copy
                },
                {
                  title: t('location.buttons.navigate'),
                  onPress: () => handleGetDirections(),
                  icon: Navigation
                }
              ]}
            />
          </View>

          <View style={observatoryDetailsStyles.equipmentsContainer}>
            <Text style={observatoryDetailsStyles.equipmentsContainer.title}>{t('equipments.title')}</Text>

            {
              observatory.equipment && observatory.equipment.length > 0 ? (
                <View style={observatoryDetailsStyles.equipmentsContainer.grid}>
                  {
                    observatory.equipment.map((equipment) => {
                      const equipmentData = observatoriesEquipments.find((eq) => eq.id === equipment)
                      return (
                        <View key={equipment} style={observatoryDetailsStyles.equipmentsContainer.grid.cell}>
                          <ListBadge
                            text={equipmentData!.label}
                            icon={equipmentData!.icon}
                            backgroundColor={app_colors.accent.light}
                            foregroundColor={app_colors.primary.main}
                          />
                        </View>
                      )
                    })
                  }
                </View>
              ) : (
                <Text style={observatoryDetailsStyles.equipmentsContainer.noEquipmentsText}>{t('equipments.noEquipments')}</Text>
              )
            }
          </View>

          <View style={observatoryDetailsStyles.notesContainer}>
            <Text style={observatoryDetailsStyles.notesContainer.title}>{t('notes.title')}</Text>
            <Text style={observatoryDetailsStyles.notesContainer.text}>{observatory.notes || t('notes.noNotes')}</Text>
          </View>

          <ListCard
            items={[
              {
                title: t('metadata.createdAt'),
                value: observatory.createdAt ? new Date(observatory.createdAt).toLocaleDateString(i18n.language, {year: 'numeric', month: 'long', day: 'numeric'}) : t('errors.unknown', {ns: 'common'})
              },
              {
                title: t('metadata.updatedAt'),
                value: observatory.updatedAt ? new Date(observatory.updatedAt).toLocaleDateString(i18n.language, {year: 'numeric', month: 'long', day: 'numeric'}) : t('errors.unknown', {ns: 'common'})
              }
            ]}
          />
        </View>
      </ImageHeaderScrollView>

      <View style={globalStyles.screen.content}>
        <View style={observatoryDetailsStyles.actions}>
          <TouchableOpacity style={[globalStyles.button, {flex: 1, height: '100%'}]} onPress={() => router.push("/settings/observatories")}>
            <Pencil color="white" size={14} />
            <Text style={globalStyles.button.text}>{t('editButton')}</Text>
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