import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import Constants from 'expo-constants'
import { Platform } from 'react-native'
import { getData, storeData } from '../../storage'
import { storageKeys } from '../../constants'

/**
 * Requests permissions, configures Android channel and returns the Expo push token.
 * Caches the token in AsyncStorage to avoid prompting multiple times.
 */
export const registerForPushNotificationsAsync = async (): Promise<string | null> => {
  if (!Device.isDevice) {
    console.log('[Notifications] Push notifications require a physical device')
    return null
  }

  const cachedToken = await getData(storageKeys.pushToken)
  if (cachedToken) {
    return cachedToken
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      showBadge: true,
    })
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync()
  let finalStatus = existingStatus

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync()
    finalStatus = status
  }

  if (finalStatus !== 'granted') {
    console.log('[Notifications] Permission not granted')
    return null
  }

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ||
    Constants.easConfig?.projectId ||
    undefined

  const pushToken = projectId
    ? (await Notifications.getExpoPushTokenAsync({ projectId })).data
    : (await Notifications.getExpoPushTokenAsync()).data

  await storeData(storageKeys.pushToken, pushToken)
  return pushToken
}
