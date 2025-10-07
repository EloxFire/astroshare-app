import React, { useEffect, useState } from 'react'
import { Linking, Modal, Text, TouchableOpacity, View } from 'react-native'
import { appUpdateModalStyles } from '../../styles/components/modals/appUpdateModal'
import { getData, storeData } from '../../helpers/storage';
import { storageKeys } from '../../helpers/constants';
import { NewsLog } from '../../helpers/types/NewsLog';

interface AppUpdateModalProps {
  isVisible: boolean
}

export default function AppUpdateModal({ isVisible }: AppUpdateModalProps) {

  const [modalVisible, setModalVisible] = useState(isVisible);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const lastVersionString = await getData(storageKeys.updates.lastAvailableVersion);
      if(lastVersionString) {
        const lastVersion = JSON.parse(lastVersionString);
        setLastUpdate(lastVersion);
      }
    })()
 }, [isVisible])

  const handleClose = () => {
    storeData(storageKeys.updates.userSkippedVersion, JSON.stringify(true));
    setModalVisible(false);
  } 

  return (
    <Modal animationType='slide' visible={modalVisible}>
      <View style={appUpdateModalStyles.modal}>
        <Text style={appUpdateModalStyles.modal.title}>Une nouvelle version est disponible.</Text>
        <Text style={appUpdateModalStyles.modal.subtitle}>Mettez à jour l'application pour profiter des dernières fonctionnalités et améliorations.</Text>
        
        {lastUpdate &&
          <View>
            <Text style={[appUpdateModalStyles.modal.subtitle, {fontFamily: 'GilroyBold', marginBottom: 5}]}>Dernière mise à jour : {lastUpdate}.</Text>
            <Text style={[appUpdateModalStyles.modal.subtitle, {fontFamily: 'GilroyRegular', fontSize: 13, marginBottom: 10}]}>Vous utilisez la version {process.env.EXPO_PUBLIC_APP_VERSION}.</Text>
          </View>
        }

        <TouchableOpacity style={appUpdateModalStyles.modal.button} onPress={() => {
          Linking.openURL('https://play.google.com/store/apps/details?id=fr.astroshare.app');
        }}>
          <Text style={appUpdateModalStyles.modal.button.text}>Mettre à jour</Text>
        </TouchableOpacity>
        <TouchableOpacity style={appUpdateModalStyles.modal.closeButton} onPress={handleClose}>
          <Text style={appUpdateModalStyles.modal.closeButton.text}>Plus tard</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}
