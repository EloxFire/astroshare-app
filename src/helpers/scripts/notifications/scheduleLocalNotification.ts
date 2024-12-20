import * as Notifications from 'expo-notifications';

interface NotificationContent {
  title: string
  body: string
  date: Date
  data?: any
}

export async function scheduleLocalNotification({title, body, data, date}: NotificationContent) {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
      body: body,
      data: data || {},
    },
    trigger: { date: date },
  });
}

export const unScheduleNotification = async(notificationId: string) => {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}