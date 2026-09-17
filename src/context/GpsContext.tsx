import { GpsLocation } from "../types/gpsLocation";
import { createContext, useState, useEffect, useContext } from "react";
import * as Location from "expo-location";
import { getLocationName } from "../helpers/api/geocoding";
import { useUserDataStore } from "../store/userData.store";

const GpsLocationContext = createContext<any| null>(null);

export const useLocation = () => {
  return useContext(GpsLocationContext);
}

export function GpsLocationProvider({ children }: { children: React.ReactNode }) {

  const [locationPermission, setLocationPermission] = useState<boolean | null>(null);
  const [location, setLocation] = useState<GpsLocation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
        setLoading(true);
        return;
      }

      if (locationPermission === true) {
        const fullLocation = await fetchLocation();

        setLocation(fullLocation);
        setLoading(false);
      }else{
        console.log("[useLocation] Impossible de récupérer la position GPS (permission refusée)");
        setError("Permission d'accès à la localisation refusée");
        setLoading(false);
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

  const fetchLocation = async () => {
    console.log("[useLocation] Récupération de la position GPS");
    
    try{
      const userLocation = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
      const geocoding = await getLocationName(userLocation.coords.latitude, userLocation.coords.longitude);

      const fullLocation: GpsLocation = {
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
        elevation: userLocation.coords.altitude ?? 0,
        name: geocoding?.name,
        local_names: geocoding?.local_names,
        country: geocoding?.country,
        state: geocoding?.state,
      }

      console.log("[useLocation] Position GPS récupérée :", fullLocation);
      

      setLastKnownLocation(fullLocation);  
      return fullLocation;
    } catch (error) {
      console.error("[useLocation] Erreur lors de la récupération de la position GPS", error);
      setError("Impossible de récupérer la position GPS");
      setLoading(false);
      return null;
    }
  }

  return (
    <GpsLocationContext.Provider value={{ locationPermission, location, error, loading }}>
      {children}
    </GpsLocationContext.Provider>
  );
}