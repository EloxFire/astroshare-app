import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Modal, PanResponder, Text, TouchableOpacity, View, type GestureResponderEvent, type PanResponderGestureState } from "react-native";
import MapView, { PROVIDER_GOOGLE, UrlTile } from "react-native-maps";
import { useTranslation } from "react-i18next";
import { Cloud, CloudRain, Info, Maximize2, Pause, Play, X } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { globalStyles } from "../../../helpers/globalStyles";
import { weatherRadarMapStyles } from "./WeatherRadarMap.styles";
import { useWeatherData } from "../../../context/WeatherDataContext";
import { useLocation } from "../../../context/LocationContext";
import { useAppUnits } from "../../../hooks/useAppUnits";
import { app_colors, withOpacity } from "../../../helpers/variables";

const FRAME_INTERVAL_MS = 500; // même cadence que l'exemple d'intégration fourni par l'API

// Repli si la position n'est pas encore connue — même valeur par défaut (Paris) que StepOne.tsx.
const DEFAULT_REGION = { latitude: 48.856724859667835, longitude: 2.349875271320343 };
const REGION_DELTA = { latitudeDelta: 0.5, longitudeDelta: 0.5 };
// Les serveurs de tuiles météo (RainViewer/OpenWeather) n'ont pas de données utiles à très haut
// niveau de zoom. Plafonné aussi sur la MapView elle-même (maxZoomLevel, pas juste sur les tuiles
// météo) : au-delà, l'imagerie Google elle-même peut ne pas être disponible pour une zone rurale
// (watermark "Zoom level not supported" de Google, rendu plus visible par la couche précipitations
// semi-transparente par-dessus) — empêcher physiquement d'y arriver au pincer-zoomer plutôt que de
// laisser l'utilisateur atteindre cette situation.
const MAX_MAP_ZOOM_LEVEL = 12;

// Carte radar autonome : lit `radar` directement depuis WeatherDataContext (déjà récupéré pour
// tout l'écran météo), anime les frames de précipitation de RainViewer par-dessus la couche
// nuages instantanée d'OpenWeather.
const WeatherRadarMap = () => {
  const { t } = useTranslation("tools/weather");
  const { radar } = useWeatherData();
  const { location } = useLocation();
  const { formatDate } = useAppUnits();
  // Le Modal plein écran couvre toute la zone de l'écran, encoche/barre de statut/indicateur
  // d'accueil compris — les contrôles flottants doivent en tenir compte (pas nécessaire sur la
  // carte normale, intégrée dans le flux habituel de l'écran).
  const insets = useSafeAreaInsets();

  const frames = radar?.precipitation.frames ?? [];
  const [frameIndex, setFrameIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showClouds, setShowClouds] = useState(true);
  const [showPrecipitation, setShowPrecipitation] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showLegend, setShowLegend] = useState(false);

  // Repart en pause sur la frame la plus récente à chaque nouveau radar (ex: après un refetch) —
  // pas de lecture automatique.
  useEffect(() => {
    setFrameIndex(Math.max(frames.length - 1, 0));
    setIsPlaying(false);
  }, [radar]);

  // Boucle sur les frames pour animer le radar, uniquement pendant la lecture.
  useEffect(() => {
    if (!isPlaying || frames.length === 0) return;
    const interval = setInterval(() => {
      setFrameIndex((current) => (current + 1) % frames.length);
    }, FRAME_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [isPlaying, frames.length]);

  const currentFrame = frames[frameIndex];
  // 0 → 1, position dans la séquence — base commune au remplissage de la piste ET à la poignée,
  // pour qu'ils restent alignés.
  const progressRatio = frameIndex / Math.max(frames.length - 1, 1);

  // Glisser sur la barre : pas de librairie de slider dédiée (pas déjà présente dans le projet),
  // juste un PanResponder (natif à React Native) sur la piste — on convertit la position du doigt
  // en index de frame à partir de la largeur mesurée au onLayout. La barre existe en DEUX
  // exemplaires (carte normale + carte plein écran, affichées l'une sans l'autre mais toutes deux
  // montées en même temps à cause du Modal) : chacune a sa propre largeur mesurée et son propre
  // PanResponder, pour ne pas se marcher dessus si elles n'ont pas la même largeur à l'écran.
  const [trackWidthNormal, setTrackWidthNormal] = useState(0);
  const [trackWidthFullscreen, setTrackWidthFullscreen] = useState(0);

  const scrubToPosition = (x: number, width: number) => {
    if (frames.length === 0 || width === 0) return;
    const ratio = Math.min(Math.max(x / width, 0), 1);
    setFrameIndex(Math.round(ratio * (frames.length - 1)));
  };

  const makePanResponder = (width: number) => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: (event: GestureResponderEvent) => {
      setIsPlaying(false); // on coupe la lecture auto dès que l'utilisateur prend la main
      scrubToPosition(event.nativeEvent.locationX, width);
    },
    onPanResponderMove: (event: GestureResponderEvent, _gesture: PanResponderGestureState) => {
      scrubToPosition(event.nativeEvent.locationX, width);
    },
  });

  const panResponderNormal = useMemo(() => makePanResponder(trackWidthNormal), [frames.length, trackWidthNormal]);
  const panResponderFullscreen = useMemo(() => makePanResponder(trackWidthFullscreen), [frames.length, trackWidthFullscreen]);

  // Couches météo, appelée séparément pour la carte normale et la carte plein écran (deux
  // instances de MapView distinctes, pas la même vue déplacée). `key` forcé sur l'URL elle-même
  // (pas une chaîne fixe) : react-native-maps ne redessine pas toujours une UrlTile déjà montée
  // quand seul son `urlTemplate` change (tuiles mises en cache côté natif) — sans ce `key`, changer
  // de frame de précipitation (lecture/glissé) ou rafraîchir les nuages (toutes les 15 min, voir
  // WeatherDataContext) ne faisait rien visuellement.
  const renderTileLayers = () => (
    <>
      {
        showClouds && radar && (
          <UrlTile key={radar.clouds.tileUrlTemplate} urlTemplate={radar.clouds.tileUrlTemplate} zIndex={1} maximumNativeZ={MAX_MAP_ZOOM_LEVEL} />
        )
      }
      {
        showPrecipitation && currentFrame && (
          <UrlTile key={currentFrame.tileUrlTemplate} urlTemplate={currentFrame.tileUrlTemplate} zIndex={2} maximumNativeZ={MAX_MAP_ZOOM_LEVEL} />
        )
      }
    </>
  );

  // Boutons flottants nuages/précipitations/légende, posés sur la carte plutôt qu'en ligne de
  // badges en dessous — même fonction réutilisée sur la carte normale et en plein écran (état
  // partagé, donc activer/désactiver une couche ou la légende dans l'un se reflète dans l'autre).
  // `topOffset` ajoute l'inset de sécurité en plein écran uniquement.
  const renderMapToggles = (topOffset: number = 0) => (
    <View style={[weatherRadarMapStyles.floatingControls.layerToggles, { top: 10 + topOffset }]}>
      <TouchableOpacity
        style={[
          weatherRadarMapStyles.floatingControls.buttonBase,
          showClouds && weatherRadarMapStyles.floatingControls.buttonBase.active,
        ]}
        onPress={() => setShowClouds((current) => !current)}
      >
        <Cloud size={16} color={app_colors.white} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          weatherRadarMapStyles.floatingControls.buttonBase,
          showPrecipitation && weatherRadarMapStyles.floatingControls.buttonBase.active,
        ]}
        onPress={() => setShowPrecipitation((current) => !current)}
      >
        <CloudRain size={16} color={app_colors.white} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          weatherRadarMapStyles.floatingControls.buttonBase,
          showLegend && weatherRadarMapStyles.floatingControls.buttonBase.active,
        ]}
        onPress={() => setShowLegend((current) => !current)}
      >
        <Info size={16} color={app_colors.white} />
      </TouchableOpacity>
    </View>
  );

  // Légende approximative des couleurs RainViewer (pas de donnée fournie par l'API pour ça) + une
  // note pour les nuages (simple opacité, pas d'échelle de couleur).
  const renderLegend = (topOffset: number = 0) => (
    showLegend && (
      <View style={[weatherRadarMapStyles.legend, { top: 56 + topOffset }]}>
        <Text style={weatherRadarMapStyles.legend.title}>{t("radar.legend.title")}</Text>

        <Text style={weatherRadarMapStyles.legend.label}>{t("radar.legend.precipitation")}</Text>
        <LinearGradient
          colors={["#6EC6FF", "#4CAF50", "#FFEB3B", "#FF5722", "#B71C1C"]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={weatherRadarMapStyles.legend.gradient}
        />
        <View style={weatherRadarMapStyles.legend.scale}>
          <Text style={weatherRadarMapStyles.legend.scale.text}>{t("radar.legend.light")}</Text>
          <Text style={weatherRadarMapStyles.legend.scale.text}>{t("radar.legend.heavy")}</Text>
        </View>

        <Text style={weatherRadarMapStyles.legend.note}>{t("radar.legend.clouds")}</Text>
      </View>
    )
  );

  // Lecture/pause + heure de la frame affichée + position dans la séquence. Réutilisée pour la
  // carte normale (couleurs par défaut, sur fond clair) et la carte plein écran (texte/piste
  // éclaircis, sur fond noir — voir `options`).
  const renderControls = (
    onTrackLayoutWidth: (width: number) => void,
    panResponder: ReturnType<typeof makePanResponder>,
    options?: { containerStyle?: object; timeColor?: string; trackColor?: string }
  ) => (
    currentFrame && (
      <View style={[weatherRadarMapStyles.controls, options?.containerStyle]}>
        <TouchableOpacity style={weatherRadarMapStyles.controls.button} onPress={() => setIsPlaying((playing) => !playing)}>
          {
            isPlaying
              ? <Pause size={14} color={app_colors.white} fill={app_colors.white} />
              : <Play size={14} color={app_colors.white} fill={app_colors.white} />
          }
        </TouchableOpacity>

        <Text style={[weatherRadarMapStyles.controls.time, options?.timeColor ? { color: options.timeColor } : null]}>
          {formatDate(currentFrame.time_tag).format("HH:mm")}
        </Text>

        {/* Zone de toucher plus grande que la piste visible (plus facile à attraper du doigt) */}
        <View
          style={weatherRadarMapStyles.controls.trackTouchArea}
          onLayout={(event) => onTrackLayoutWidth(event.nativeEvent.layout.width)}
          {...panResponder.panHandlers}
        >
          <View style={[weatherRadarMapStyles.controls.track, options?.trackColor ? { backgroundColor: options.trackColor } : null]}>
            <View style={[weatherRadarMapStyles.controls.track.fill, { width: `${progressRatio * 100}%` }]} />
          </View>
          <View style={[weatherRadarMapStyles.controls.track.thumb, { left: `${progressRatio * 100}%` }]} />
        </View>
      </View>
    )
  );

  const mapRegion = {
    latitude: location?.latitude ?? DEFAULT_REGION.latitude,
    longitude: location?.longitude ?? DEFAULT_REGION.longitude,
    ...REGION_DELTA,
  };

  return (
    <View style={weatherRadarMapStyles.section}>
      <View>
        <Text style={globalStyles.categoryTitle}>{t("radar.title")}</Text>
        <Text style={globalStyles.categorySubtitle}>{t("radar.subtitle")}</Text>
      </View>

      <View style={weatherRadarMapStyles.mapContainer}>
        {
          radar ? (
            <>
              <MapView
                style={weatherRadarMapStyles.mapContainer.map}
                provider={PROVIDER_GOOGLE}
                mapType="standard"
                initialRegion={mapRegion}
                maxZoomLevel={MAX_MAP_ZOOM_LEVEL}
                rotateEnabled={false}
                pitchEnabled={false}
              >
                {renderTileLayers()}
              </MapView>

              {renderMapToggles()}
              {renderLegend()}

              <TouchableOpacity
                style={[weatherRadarMapStyles.floatingControls.buttonBase, weatherRadarMapStyles.floatingControls.fullscreenToggle]}
                onPress={() => setIsFullscreen(true)}
              >
                <Maximize2 size={16} color={app_colors.white} />
              </TouchableOpacity>
            </>
          ) : (
            <View style={weatherRadarMapStyles.mapContainer.placeholder}>
              <ActivityIndicator color={app_colors.primary.main} />
              <Text style={weatherRadarMapStyles.mapContainer.placeholder.text}>{t("radar.loading")}</Text>
            </View>
          )
        }
      </View>

      {/* BARRE DE CONTRÔLES */}
      {renderControls(setTrackWidthNormal, panResponderNormal)}

      {/* PLEIN ÉCRAN */}
      <Modal visible={isFullscreen} animationType="fade" onRequestClose={() => setIsFullscreen(false)}>
        <View style={weatherRadarMapStyles.fullscreen}>
          {
            radar && (
              <MapView
                style={weatherRadarMapStyles.fullscreen.map}
                provider={PROVIDER_GOOGLE}
                mapType="standard"
                initialRegion={mapRegion}
                maxZoomLevel={MAX_MAP_ZOOM_LEVEL}
                rotateEnabled={false}
                pitchEnabled={false}
              >
                {renderTileLayers()}
              </MapView>
            )
          }

          {renderMapToggles(insets.top)}
          {renderLegend(insets.top)}

          <TouchableOpacity
            style={[weatherRadarMapStyles.floatingControls.closeButton, { top: 10 + insets.top }]}
            onPress={() => setIsFullscreen(false)}
          >
            <X size={20} color={app_colors.white} />
          </TouchableOpacity>

          {/* Mêmes contrôles qu'en bas de la carte normale, repositionnés en overlay sur fond
              sombre (voir `options`) et décalés de l'inset bas (indicateur d'accueil, etc.). */}
          {
            renderControls(setTrackWidthFullscreen, panResponderFullscreen, {
              containerStyle: [weatherRadarMapStyles.fullscreen.controls, { bottom: 20 + insets.bottom }],
              timeColor: app_colors.white,
              trackColor: withOpacity(app_colors.white, 0.2),
            })
          }
        </View>
      </Modal>
    </View>
  );
};

export default WeatherRadarMap;
