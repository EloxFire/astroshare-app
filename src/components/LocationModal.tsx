import React from 'react'
import { Image, Modal, Text, TouchableOpacity, View } from 'react-native'
import { locationHeaderStyles } from '../styles/components/locationHeader'
import { LocationObject } from '../helpers/types/LocationObject'
import { useSpot } from '../contexts/ObservationSpotContext'
import { mapStyle } from '../helpers/mapJsonStyle'
import { app_colors } from '../helpers/constants'
import { i18n } from '../helpers/scripts/i18n'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'
import DSOValues from './commons/DSOValues'
import { useSettings } from '../contexts/AppSettingsContext'

interface LocationModalProps {
  visible: boolean
  onClose: () => void
}

export default function LocationModal({ visible, onClose }: LocationModalProps) {

  const { currentUserLocation } = useSettings()
  const { defaultAltitude, selectedSpot } = useSpot()


  return (
    <Modal animationType='slide' visible={visible} transparent>
      <View style={locationHeaderStyles.modal}>
        <View style={locationHeaderStyles.modal.header}>
          <Text style={locationHeaderStyles.modal.header.title}>{i18n.t('locationModal.title')}</Text>
          <TouchableOpacity onPress={() => onClose()}>
            <Image source={require('../../assets/icons/FiXCircle.png')} style={{ width: 20, height: 20 }} />
          </TouchableOpacity>
        </View>
        <View style={{ marginBottom: 20 }}>
          <MapView
            provider={PROVIDER_GOOGLE}
            customMapStyle={mapStyle}
            style={locationHeaderStyles.modal.mapContainer}
            zoomEnabled={true}
            scrollEnabled={true}
            rotateEnabled={false}
            pitchEnabled={false}
            showsUserLocation={true}
            initialRegion={{
              latitude: currentUserLocation ? currentUserLocation.lat : 0,
              longitude: currentUserLocation ? currentUserLocation.lon : 0,
              latitudeDelta: 0,
              longitudeDelta: 0.05,
            }}
          >
          </MapView>
        </View>
        <View style={locationHeaderStyles.modal.body}>
          <DSOValues chipValue value={`${currentUserLocation?.dms ? currentUserLocation?.dms.dms_lat : ''}`} title={i18n.t('locationModal.chips.latitude')} chipColor={app_colors.white_no_opacity} />
          <DSOValues chipValue value={`${currentUserLocation?.dms ? currentUserLocation?.dms.dms_lon : ''}`} title={i18n.t('locationModal.chips.longitude')} chipColor={app_colors.white_no_opacity} />
          <DSOValues chipValue value={`${currentUserLocation?.lat}`} title={i18n.t('locationModal.chips.degrees_latitude')} chipColor={app_colors.white_no_opacity} />
          <DSOValues chipValue value={`${currentUserLocation?.lon}`} title={i18n.t('locationModal.chips.degrees_longitude')} chipColor={app_colors.white_no_opacity} />
          <DSOValues chipValue value={selectedSpot ? selectedSpot.equipments.altitude : `${defaultAltitude} ${i18n.t('locationModal.chips.default_altitude')}`} title={i18n.t('locationModal.chips.altitude')} chipColor={app_colors.white_no_opacity} />
          <DSOValues chipValue value={currentUserLocation?.common_name ? currentUserLocation?.common_name : "N/A"} title={i18n.t('locationModal.chips.common_name')} chipColor={app_colors.white_no_opacity} />
          <DSOValues chipValue value={currentUserLocation?.country ? currentUserLocation?.country : 'N/A'} title={i18n.t('locationModal.chips.country')} chipColor={app_colors.white_no_opacity} />
        </View>
      </View>
    </Modal>
  )
}
