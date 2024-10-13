import {getData} from "../../storage";
import {showToast} from "../showToast";
import {i18n} from "../i18n";
import * as Notifications from 'expo-notifications';

interface NotificationProps {
  title: string,
  body: string,
  data: any,
  date: Date,
}

export const scheduleNotification = async(notification: NotificationProps) => {

  const expoPushToken = await getData('expoPushToken');

  if(!expoPushToken){
    showToast({message: i18n.t('common.errors.unknown'), type: 'error', duration: 3000});
    return;
  }

  return await Notifications.scheduleNotificationAsync({
    content: {
      title: notification.title,
      body: notification.body,
      data: notification.data,
    },
    trigger: {
      date: notification.date,
    }
  });
}

export const unScheduleNotification = async(notificationId: string) => {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
