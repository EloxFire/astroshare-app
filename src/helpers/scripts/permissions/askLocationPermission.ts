import * as Location from 'expo-location';

export const askLocationPermission = async () => {
  // Ask for location permission
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    return false;
  }
  return false;
}