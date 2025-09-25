import { storageKeys } from "../constants";
import { getData } from "../storage";

export const isFirstLaunch = async (): Promise<boolean> => {
  const launchStatus = await getData(storageKeys.firstLaunch);
  if (!launchStatus || launchStatus === 'true') {
    return true;
  }
  return false;
  }