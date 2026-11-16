import { useEffect, useRef } from "react";
import { Linking, Platform, View } from "react-native";
import MapView from "react-native-maps";
import * as Clipboard from "expo-clipboard";
import { useTranslation } from "react-i18next";
import { Copy, MapPinned, Navigation } from "lucide-react-native";
import ListCard from "../ListCard/ListCard";
import MapTargetMarker from "../../MapTargetMarker/MapTargetMarker";
import { convertDecimalLatitudeToDMS, convertDecimalLongitudeToDMS } from "../../../helpers/location/convert";
import { locationMapCardStyles } from "./LocationMapCard.styles";

// Écart en degrés couvert par la mini-carte (environ 1 km) : assez serré pour situer le point dans
// son environnement immédiat.
const MAP_REGION_DELTA = 0.01;

interface LocationMapCardProps {
  latitude: number;
  longitude: number;
  // Altitude en mètres. null ou absente : affichée comme inconnue.
  elevation?: number | null;
  terrain?: 'satellite' | 'terrain' | 'standard';
  type?: 'directions' | 'view'
}

/**
 * <LocationMapCard latitude={observatory.latitude} longitude={observatory.longitude} elevation={observatory.elevation} />
 *
 * Carte d'un lieu : mini-carte centrée sur le point, puis latitude / longitude (en DMS) et altitude,
 * avec deux actions : copier les coordonnées, ouvrir l'itinéraire dans l'app de cartes du téléphone.
 * Utilisée par la fiche d'un observatoire et par celle d'une session du Journal.
 */
const LocationMapCard = ({ latitude, longitude, elevation, terrain = 'standard', type = 'directions' }: LocationMapCardProps) => {
  const { t } = useTranslation("common");
  const mapRef = useRef<MapView>(null);
  const shownCoordinatesRef = useRef({ latitude, longitude });

  // initialRegion n'agit qu'au premier rendu de MapView : si le lieu change alors que la carte est
  // déjà affichée (ex: retour sur la fiche d'un observatoire qu'on vient de modifier), le repère
  // bougerait mais la vue resterait sur l'ancien point. On recentre donc la carte, seulement quand
  // les coordonnées changent vraiment (pas au montage, déjà centré par initialRegion).
  useEffect(() => {
    const shown = shownCoordinatesRef.current;
    if (shown.latitude === latitude && shown.longitude === longitude) return;

    shownCoordinatesRef.current = { latitude, longitude };
    mapRef.current?.animateToRegion({ latitude, longitude, latitudeDelta: MAP_REGION_DELTA, longitudeDelta: MAP_REGION_DELTA });
  }, [latitude, longitude]);

  const handleCopyCoordinates = () => {
    Clipboard.setStringAsync(`${latitude}, ${longitude}`);
  };

  const handleOpenMap = () => {
    // Ouvre l'app de cartes par défaut sur le lieu : sur iOS, un lien maps.apple.com ouvre
    // directement Plans (aucune déclaration Info.plist nécessaire) ; Google Maps ailleurs.
    const coordinates = `${latitude},${longitude}`;

    // type="view" (ex: un pas de tir) : on ne demande pas d'itinéraire depuis la position de
    // l'utilisateur, juste centrer la carte sur le point — "daddr"/"dir" lanceraient un calcul
    // de trajet qui n'a pas de sens ici.
    if (type === "view") {
      const url = Platform.OS === "ios"
        ? `https://maps.apple.com/?ll=${coordinates}&q=${coordinates}`
        : `https://www.google.com/maps/search/?api=1&query=${coordinates}`;
      Linking.openURL(url);
      return;
    }

    const url = Platform.OS === "ios"
      ? `https://maps.apple.com/?daddr=${coordinates}`
      : `https://www.google.com/maps/dir/?api=1&destination=${coordinates}`;
    Linking.openURL(url);
  };

  return (
    <View>
      <View style={locationMapCardStyles.mapContainer}>
        <MapView
          ref={mapRef}
          style={locationMapCardStyles.mapContainer.map}
          initialRegion={{
            latitude,
            longitude,
            latitudeDelta: MAP_REGION_DELTA,
            longitudeDelta: MAP_REGION_DELTA,
          }}
          mapType={terrain}
        >
          <MapTargetMarker coordinate={{ latitude, longitude }} />
        </MapView>
      </View>

      <ListCard
        items={[
          { title: t("locationMapCard.latitude"), value: convertDecimalLatitudeToDMS(latitude) },
          { title: t("locationMapCard.longitude"), value: convertDecimalLongitudeToDMS(longitude) },
          {
            title: t("locationMapCard.elevation"),
            // `!= null` plutôt qu'un test de vérité : une altitude de 0 m (bord de mer) est une vraie valeur.
            value: elevation != null ? `${Math.round(elevation)} m` : t("locationMapCard.unknown"),
          },
        ]}
        additionalContainerStyles={locationMapCardStyles.list}
        buttons={[
          { title: t("locationMapCard.buttons.copy"), onPress: handleCopyCoordinates, icon: Copy },
          type === "view"
            ? { title: t("locationMapCard.buttons.view"), onPress: handleOpenMap, icon: MapPinned }
            : { title: t("locationMapCard.buttons.navigate"), onPress: handleOpenMap, icon: Navigation },
        ]}
      />
    </View>
  );
};

export default LocationMapCard;
