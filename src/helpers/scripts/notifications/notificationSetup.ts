import {v4 as uuidv4} from "uuid";
import {storeData} from "../../storage";
import {storageKeys} from "../../constants";
import axios from "axios";

export const setupNotificationServer = async () => {
  console.log('Setting up notification')
  const notificationId = uuidv4();
  await storeData(storageKeys.notificationsId, notificationId);

  // Add user to notifications server database
  const response = await axios.post(`https://localhost:3001/notifications/addUser}`, {
    notificationId: notificationId
  })
}