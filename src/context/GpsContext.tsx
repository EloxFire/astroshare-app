import { GpsLocation } from "../types/gpsLocation";
import { createContext, useState, useEffect, useContext } from "react";
import * as Location from "expo-location";
import { getLightPollutionDataFromCoords, getLocationCoordsFromName, getLocationNameFromCoords } from "../helpers/api/geocoding/geocoding";
import { useUserDataStore } from "../store/userData.store";

const GpsLocationContext = createContext<any| null>(null);

export const useLocation = () => {
  return useContext(GpsLocationContext);
}

export function GpsLocationProvider({ children }: { children: React.ReactNode }) {

  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [location, setLocation] = useState<GpsLocation | null>(null);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState<boolean>(true);
  const [searchLoading, setSearchLoading] = useState<boolean>(false);

  // Fontionnalités de recherche de position
  const [searchedLocation, setSearchedLocation] = useState<GpsLocation | null>(null);

  const setLastKnownLocation = useUserDataStore(state => state.setLastKnownLocation);

  useEffect(() => {
    (async () => {
      await getLocationPermission();
    })();
  }, []);

  useEffect(() => {
    (async () => {

      if(locationPermission === null){
        console.log("[useLocation] Permission d'accès à la localisation non encore demandée");
        setGpsLoading(true);
        return;
      }

      if (locationPermission === true) {
        const fullLocation = await fetchGpsLocation();

        setLocation(fullLocation);
        setGpsLoading(false);
      }else{
        console.log("[useLocation] Impossible de récupérer la position GPS (permission refusée)");
        setGpsError("Permission d'accès à la localisation refusée");
        setGpsLoading(false);
      }
    })();
  }, [locationPermission]);

  const getLocationPermission = async () => {
    console.log("[useLocation] Demande de permission d'accès à la localisation");
    
    // Vérifie si l'application a la permission d'accéder à la localisation de l'utilisateur
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.warn("[useLocation] Permission d'accès à la localisation refusée");
      setLocationPermission(false);
      return false;
    }
    setLocationPermission(true);
    console.log("[useLocation] Permission d'accès à la localisation accordée");
    return true;
  }

  const fetchGpsLocation = async () => {
    console.log("[useLocation] Récupération de la position GPS");
    setGpsLoading(true);
    
    try{
      const userLocation = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
      const geocoding = await getLocationNameFromCoords(userLocation.coords.latitude, userLocation.coords.longitude);
      const lightPollutionInfo = await getLightPollutionDataFromCoords(userLocation.coords.latitude, userLocation.coords.longitude);

      const fullLocation: GpsLocation = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        elevation: userLocation.coords.altitude ?? 0,
        name: geocoding?.name,
        local_names: geocoding?.local_names,
        country: geocoding?.country,
        state: geocoding?.state,
        light_pollution: lightPollutionInfo ?? undefined,
      }

      console.log("[useLocation] Position GPS récupérée :", fullLocation);
      

      setLastKnownLocation(fullLocation);
      setGpsLoading(false);
      return fullLocation;
    } catch (error) {
      console.error("[useLocation] Erreur lors de la récupération de la position GPS", error);
      setGpsError("Impossible de récupérer la position GPS");
      setGpsLoading(false);
      return null;
    }
  }

  // TODO : searchLocation a besoin de pouvoir prendre soit un nom de lieu,
  // soit des coordonnées car il faut gérer le cas ou aucun nom n'est trouvé
  // un seul parametre query, si xxx::yyy alors ce sont des coords latitide::longitude, sinon c'est un nom de lieu
  const fetchLocation = async (query: string): Promise<GpsLocation | null> => {
    setSearchLoading(true);
    const isCoordinateQuery = query.includes("::");
    let locationResponse;
    let lightPollutionResponse;
    let fullLocation: GpsLocation | null = null;

    if(isCoordinateQuery) {
      console.log("[useLocation] Recherche de position par coordonnées :", query);
      const [latitudeStr, longitudeStr] = query.split("::");
      const latitude = parseFloat(latitudeStr);
      const longitude = parseFloat(longitudeStr);

      if(isNaN(latitude) || isNaN(longitude)) {
        console.warn("[useLocation] Coordonnées invalides :", query);
        return null;
      }
      
      locationResponse = await getLocationNameFromCoords(latitude, longitude);
      lightPollutionResponse = await getLightPollutionDataFromCoords(latitude, longitude);

      if(!locationResponse) {
        fullLocation = {
          latitude,
          longitude,
          elevation: null, // Elevation is not provided in this case
          name: "Unknown",
          local_names: undefined,
          country: undefined,
          state: undefined,
          light_pollution: lightPollutionResponse ?? undefined,
        }
        console.log("[useLocation] Impossible de récupérer le nom de la localisation pour les coordonnées :", query);
        setSearchLoading(false);
      }else{
        setSearchLoading(false);
        fullLocation = {
          latitude,
          longitude,
          elevation: null,
          name: locationResponse.name,
          local_names: locationResponse.local_names,
          country: locationResponse.country,
          state: locationResponse.state,
          light_pollution: lightPollutionResponse ?? undefined,
        }
      }
    }else{
      console.log("[useLocation] Recherche de position par nom :", query);
      locationResponse = await getLocationCoordsFromName(query);

      if(locationResponse) {

        lightPollutionResponse = await getLightPollutionDataFromCoords(locationResponse.latitude, locationResponse.longitude);

        fullLocation = {
          latitude: locationResponse.latitude,
          longitude: locationResponse.longitude,
          elevation: locationResponse.elevation ?? 0,
          name: locationResponse.name,
          local_names: locationResponse.local_names,
          country: locationResponse.country,
          state: locationResponse.state,
          light_pollution: lightPollutionResponse ?? undefined,
        }
        setSearchLoading(false);
      }else{
        setSearchLoading(false);
        console.error("[useLocation] Impossible de récupérer les coordonnées pour le nom de localisation :", query);
      }
    }

    return fullLocation;
  }

  return (
    <GpsLocationContext.Provider value={{ locationPermission, location, gpsError, gpsLoading, searchedLocation, fetchLocation, fetchGpsLocation, searchLoading }}>
      {children}
    </GpsLocationContext.Provider>
  );
}