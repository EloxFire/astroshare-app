import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "./scripts/showToast";

export const storeData = async (value: string) => {
  try {
    await AsyncStorage.setItem('my-key', value);
  } catch (e) {
    showToast({ message: 'Une erreur est survenue, veuillez réessayer...', type: 'error' });
  }
};

export const getData = async (key: string) => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      // value previously stored
    }
  } catch (e) {
    return;
  }
};