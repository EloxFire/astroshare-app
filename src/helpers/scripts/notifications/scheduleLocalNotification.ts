import * as Notifications from 'expo-notifications';
import {SchedulableTriggerInputTypes} from 'expo-notifications';
import {Platform} from 'react-native';
import {showToast} from '../showToast';

interface NotificationContent {
  title: string
  body: string
  date: Date
  data?: any
}

let handlerConfigured = false;

/**
 * Make sure local notifications are allowed and configured.
 */
const ensureNotificationSetup = async (): Promise<boolean> => {
  if (!handlerConfigured) {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
    handlerConfigured = true;
  }

  const {status: existingStatus} = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const {status} = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    showToast({message: 'Enable notifications to schedule reminders', type: 'error'});
    return false;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
    });
  }

  return true;
};

export async function scheduleLocalNotification({title, body, data, date}: NotificationContent) {
  const canSchedule = await ensureNotificationSetup();
  if (!canSchedule) return null;

  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: data || {},
      },
      trigger: {
        type: SchedulableTriggerInputTypes.DATE,
        date: date
      },
    });
  } catch (error) {
    console.warn('[Notifications] Unable to schedule notification', error);
    showToast({message: 'Unable to schedule notification', type: 'error'});
    return null;
  }
}

export const unScheduleNotification = async(notificationId: string) => {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
