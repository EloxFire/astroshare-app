import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from "./scripts/showToast";

export const storeData = async (key: string, value: string) => {
  console.log(`[Storage] Storing data for key: ${key} with value: ${value}`);
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    showToast({ message: 'Une erreur est survenue, veuillez réessayer...', type: 'error' });
  }
};

export const getData = async (key: string) => {
  console.log(`[Storage] Retrieving data for key: ${key}`);
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return value;
    }
  } catch (e) {
    showToast({ message: 'Une erreur est survenue, veuillez réessayer...', type: 'error' });
    return null;
  }
};

export const storeObject = async (key: string, newObject: any) => {
  console.log(`[Storage] Storing object for key: ${key}`, newObject);
  try {
    const jsonValue = JSON.stringify(newObject);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    showToast({ message: 'Une erreur est survenue, veuillez réessayer...', type: 'error' });
  }
};

export const getObject = async (key: string) => {
  console.log(`[Storage] Retrieving object for key: ${key}`);
  
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    showToast({ message: 'Une erreur est survenue, veuillez réessayer...', type: 'error' });
    return null;
  }
};

export const removeData = async (key: string) => {
  console.log(`[Storage] Removing data for key: ${key}`);
  
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    showToast({ message: 'Une erreur est survenue, veuillez réessayer...', type: 'error' });
  }
}