import { getData, removeData } from "../../storage"

export const isLocalNotificationPlanned = async (notificationId: string): Promise<boolean> => {
  const id = await getData(`${notificationId}`)
  return !!id
}

export const deleteLocalNotificationRecord = async (notificationId: string): Promise<void> => {
  await removeData(`${notificationId}`)
}
