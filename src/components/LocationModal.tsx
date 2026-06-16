import React from 'react'
import { Image, Modal, Platform, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import { locationHeaderStyles } from '../styles/components/locationHeader'
import { useSpot } from '../contexts/ObservationSpotContext'
import { mapStyle } from '../helpers/mapJsonStyle'
import { app_colors } from '../helpers/constants'
import { i18n } from '../helpers/scripts/i18n'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import { useSettings } from '../contexts/AppSettingsContext'
import { useObservatories } from '../contexts/ObservatoriesContext'
import { routes } from '../helpers/routes'

interface LocationModalProps {
  visible: boolean
  onClose: () => void
}

function InfoCell({ label, value }: { label: string; value: string }) {
  return (
    <View style={{
      flex: 1,
      minWidth: '45%',
      backgroundColor: app_colors.white_no_opacity,
      borderRadius: 10,
      paddingHorizontal: 12,
      paddingVertical: 10,
    }}>
      <Text style={{
        color: app_colors.white,
        fontSize: 9,
        fontFamily: 'DMMonoRegular',
        opacity: 0.5,
        textTransform: 'uppercase',
        letterSpacing: 0.4,
        marginBottom: 4,
      }}>
        {label}
      </Text>
      <Text style={{
        color: app_colors.white,
        fontSize: 13,
        fontFamily: 'DMMonoMedium',
      }} numberOfLines={1}>
        {value || '—'}
      </Text>
    </View>
  )
}

export default function LocationModal({ visible, onClose }: LocationModalProps) {

  const navigation = useNavigation<any>()
  const { currentUserLocation } = useSettings()
  const { defaultAltitude, selectedSpot } = useSpot()
  const { observatories, selectedObservatory, selectObservatory } = useObservatories()

  const handleSelectObservatory = async (id: string) => {
    const obs = observatories.find((o: any) => o.id === id)
    if (!obs) return
    await selectObservatory(obs)
    onClose()
  }

  const handleSelectGps = async () => {
    await selectObservatory(null)
    onClose()
  }

  const handleManageObservatories = () => {
    onClose()
    navigation.navigate(routes.auth.profile.observatories.home.path)
  }

  const locationName = selectedObservatory
    ? selectedObservatory.name
    : (currentUserLocation?.common_name ?? i18n.t('locationModal.observatories.gps'))

  const coordsShort = currentUserLocation
    ? `${currentUserLocation.lat.toFixed(4)}°  /  ${currentUserLocation.lon.toFixed(4)}°`
    : '—'

  const altitudeDisplay = selectedObservatory?.altitude != null
    ? `${selectedObservatory.altitude} m`
    : selectedSpot
      ? selectedSpot.equipments.altitude
      : defaultAltitude

  return (
    <Modal animationType='slide' visible={visible} transparent>
      <View style={locationHeaderStyles.modal}>

        {/* ── Header ── */}
        <View style={locationHeaderStyles.modal.header}>
          <Text style={locationHeaderStyles.modal.header.title}>{i18n.t('locationModal.title')}</Text>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Image source={require('../../assets/icons/FiXCircle.png')} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

          {/* ── Active location hero ── */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 14,
            paddingHorizontal: 16,
            paddingVertical: 14,
            borderBottomWidth: 1,
            borderBottomColor: app_colors.white_no_opacity,
          }}>
            <View style={{
              width: 46,
              height: 46,
              borderRadius: 23,
              backgroundColor: app_colors.white_no_opacity,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 1,
              borderColor: app_colors.white_no_opacity,
            }}>
              <Image
                source={selectedObservatory
                  ? require('../../assets/icons/FiPinMap.png')
                  : require('../../assets/icons/FiCrosshair.png')}
                style={{ width: 22, height: 22 }}
              />
            </View>

            <View style={{ flex: 1, gap: 3 }}>
              <Text style={{
                color: app_colors.white,
                fontSize: 17,
                fontFamily: 'GilroyBlack',
                lineHeight: 20,
              }} numberOfLines={1}>
                {locationName}
              </Text>
              <Text style={{
                color: app_colors.white,
                fontSize: 11,
                fontFamily: 'DMMonoRegular',
                opacity: 0.5,
              }}>
                {coordsShort}
              </Text>
            </View>

            <View style={{
              backgroundColor: app_colors.white_no_opacity,
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 8,
              alignItems: 'center',
              minWidth: 56,
            }}>
              <Text style={{
                color: app_colors.white,
                fontSize: 14,
                fontFamily: 'GilroyBlack',
                lineHeight: 16,
              }}>
                {altitudeDisplay}
              </Text>
              <Text style={{
                color: app_colors.white,
                fontSize: 9,
                fontFamily: 'DMMonoRegular',
                opacity: 0.5,
                textTransform: 'uppercase',
              }}>
                {i18n.t('locationModal.chips.altitude')}
              </Text>
            </View>
          </View>

          {/* ── Map ── */}
          <MapView
            provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
            customMapStyle={mapStyle}
            userInterfaceStyle="dark"
            style={locationHeaderStyles.modal.mapContainer}
            zoomEnabled
            scrollEnabled
            rotateEnabled={false}
            pitchEnabled={false}
            showsUserLocation
            initialRegion={{
              latitude: currentUserLocation?.lat ?? 0,
              longitude: currentUserLocation?.lon ?? 0,
              latitudeDelta: 0.05,
              longitudeDelta: 0.05,
            }}
          />

          {/* ── Switch location ── */}
          <View style={{
            paddingTop: 16,
            paddingBottom: 12,
            borderTopWidth: 1,
            borderTopColor: app_colors.white_no_opacity,
          }}>
            <Text style={{
              color: app_colors.white,
              fontSize: 10,
              fontFamily: 'DMMonoRegular',
              opacity: 0.5,
              textTransform: 'uppercase',
              letterSpacing: 0.6,
              marginBottom: 10,
              paddingHorizontal: 16,
            }}>
              {i18n.t('locationModal.observatories.title')}
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
            >
              {/* GPS chip */}
              <TouchableOpacity
                onPress={handleSelectGps}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 7,
                  paddingHorizontal: 14,
                  paddingVertical: 9,
                  borderRadius: 22,
                  borderWidth: 1,
                  borderColor: !selectedObservatory ? app_colors.white : app_colors.white_no_opacity,
                  backgroundColor: !selectedObservatory ? 'rgba(255,255,255,0.1)' : 'transparent',
                }}
              >
                <Image source={require('../../assets/icons/FiCrosshair.png')} style={{ width: 13, height: 13 }} />
                <Text style={{
                  color: app_colors.white,
                  fontFamily: !selectedObservatory ? 'GilroyBlack' : 'GilroyRegular',
                  fontSize: 13,
                }}>
                  {i18n.t('locationModal.observatories.gps')}
                </Text>
              </TouchableOpacity>

              {/* Observatory chips */}
              {observatories.map((obs: any) => {
                const isActive = selectedObservatory?.id === obs.id
                return (
                  <TouchableOpacity
                    key={obs.id}
                    onPress={() => handleSelectObservatory(obs.id)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 7,
                      paddingHorizontal: 14,
                      paddingVertical: 9,
                      borderRadius: 22,
                      borderWidth: 1,
                      borderColor: isActive ? app_colors.white : app_colors.white_no_opacity,
                      backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                    }}
                  >
                    <Image source={require('../../assets/icons/FiPinMap.png')} style={{ width: 13, height: 13 }} />
                    <Text style={{
                      color: app_colors.white,
                      fontFamily: isActive ? 'GilroyBlack' : 'GilroyRegular',
                      fontSize: 13,
                    }}>
                      {obs.name}
                    </Text>
                  </TouchableOpacity>
                )
              })}
            </ScrollView>

            {/* Manage observatories link */}
            <TouchableOpacity
              onPress={handleManageObservatories}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginTop: 10,
                marginHorizontal: 16,
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: app_colors.white_no_opacity,
              }}
            >
              <Image source={require('../../assets/icons/FiPinMap.png')} style={{ width: 15, height: 15 }} />
              <Text style={{
                color: app_colors.white,
                fontFamily: 'GilroyRegular',
                fontSize: 14,
                flex: 1,
              }}>
                {i18n.t('locationModal.observatories.manage')}
              </Text>
              <Image source={require('../../assets/icons/FiChevronRight.png')} style={{ width: 14, height: 14, opacity: 0.5 }} />
            </TouchableOpacity>
          </View>

          {/* ── Coordinates detail grid ── */}
          <View style={{
            paddingHorizontal: 16,
            paddingTop: 16,
            paddingBottom: 24,
            borderTopWidth: 1,
            borderTopColor: app_colors.white_no_opacity,
            gap: 8,
          }}>
            <Text style={{
              color: app_colors.white,
              fontSize: 10,
              fontFamily: 'DMMonoRegular',
              opacity: 0.5,
              textTransform: 'uppercase',
              letterSpacing: 0.6,
              marginBottom: 4,
            }}>
              Détails
            </Text>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <InfoCell
                label={i18n.t('locationModal.chips.latitude')}
                value={currentUserLocation?.dms?.dms_lat ?? ''}
              />
              <InfoCell
                label={i18n.t('locationModal.chips.longitude')}
                value={currentUserLocation?.dms?.dms_lon ?? ''}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <InfoCell
                label={i18n.t('locationModal.chips.degrees_latitude')}
                value={currentUserLocation ? `${currentUserLocation.lat}` : ''}
              />
              <InfoCell
                label={i18n.t('locationModal.chips.degrees_longitude')}
                value={currentUserLocation ? `${currentUserLocation.lon}` : ''}
              />
            </View>

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <InfoCell
                label={i18n.t('locationModal.chips.common_name')}
                value={currentUserLocation?.common_name ?? ''}
              />
              <InfoCell
                label={i18n.t('locationModal.chips.country')}
                value={currentUserLocation?.country ?? ''}
              />
            </View>
          </View>

        </ScrollView>
      </View>
    </Modal>
  )
}
