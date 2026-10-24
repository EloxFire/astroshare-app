import { Image, InteractionManager, Modal, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { globalStyles } from "../../../helpers/globalStyles"
import { ScreenHeader } from "../../../components/ScreenHeader/ScreenHeader"
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useLocation } from "../../../context/GpsContext";
import { GpsLocation } from "../../../types/gpsLocation";
import Badge from "../../../components/Badges/Badge/Badge";
import { Maximize2, Pause, Play, Radio, X } from "lucide-react-native";
import { app_colors } from "../../../helpers/variables";
import { useVideoPlayer, VideoView } from "expo-video";
import ListCard from "../../../components/cards/ListCard/ListCard";
import { convertEquatorialToHorizontal, getBodyNextRise, getBodyNextSet, getSolarAngularDiameter, getSolarDistance, getSolarEquatorialCoordinate } from "@observerly/astrometry";
import { findNextHorizonCrossing, findPreviousHorizonCrossing, getAltitudeCurve } from "../../../helpers/astrometry/altitude/altitudeCurve";
import { formatDayRelativeTime, formatDistanceInKm, formatDistanceInUA, formatDuration, formatTransit } from "../../../helpers/format";
import { useAppUnits } from "../../../hooks/useAppUnits";
import AltitudeChart from "../../../components/AltitudeChart/AltitudeChart";
import { spaceWeatherScreenStyles } from "./SpaceWeatherScreen.styles";
import { getSunImagery } from "../../../helpers/api/spaceWeather/sunImagery";
import type { SunImage, SunImagery } from "../../../types/spaceWeather/SunImagery";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";

// Composant à part car useVideoPlayer est un hook : il ne doit être monté que lorsque l'animation
// est effectivement affichée (voir isPlayingAnimation), pas à chaque rendu de l'écran — même
// principe que ApodVideoPlayer dans ApodScreen.tsx. Boucle et muet (contrairement à Apod, qui a du
// son) : ces animations sont pensées comme une version "vivante" de l'image statique, pas un média
// à écouter.
const SunAnimationPlayer = ({ uri, style }: { uri: string; style: object }) => {
  const player = useVideoPlayer(uri, (player) => {
    player.loop = true;
    player.muted = true;
    player.play();
  });

  return <VideoView player={player} style={style} nativeControls={false} contentFit="cover" />;
};

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;

// Pinch-to-zoom + pan de l'image plein écran. Monté/démonté à chaque ouverture/fermeture du modal
// (voir son usage plus bas) plutôt que de persister : ça remet le zoom à 1x à chaque ouverture sans
// logique de reset explicite. Double-tap pour revenir instantanément à 1x.
const ZoomableImage = ({ uri }: { uri: string }) => {
  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const savedTranslateX = useSharedValue(0);
  const savedTranslateY = useSharedValue(0);

  const reset = () => {
    "worklet";
    scale.value = withSpring(MIN_ZOOM);
    translateX.value = withSpring(0);
    translateY.value = withSpring(0);
    savedScale.value = MIN_ZOOM;
    savedTranslateX.value = 0;
    savedTranslateY.value = 0;
  };

  const pinchGesture = Gesture.Pinch()
    .onUpdate((event) => {
      scale.value = Math.min(Math.max(savedScale.value * event.scale, MIN_ZOOM), MAX_ZOOM);
    })
    .onEnd(() => {
      savedScale.value = scale.value;
      if (scale.value <= MIN_ZOOM) reset();
    });

  // N'autorise le déplacement que quand on est effectivement zoomé — sinon un simple glissement
  // sur l'image à 1x la ferait traîner pour rien.
  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (savedScale.value <= MIN_ZOOM) return;
      translateX.value = savedTranslateX.value + event.translationX;
      translateY.value = savedTranslateY.value + event.translationY;
    })
    .onEnd(() => {
      savedTranslateX.value = translateX.value;
      savedTranslateY.value = translateY.value;
    });

  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => reset());

  const composedGesture = Gesture.Race(doubleTapGesture, Gesture.Simultaneous(pinchGesture, panGesture));

  const animatedImageStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
  }));

  return (
    <GestureDetector gesture={composedGesture}>
      <View style={spaceWeatherScreenStyles.fullscreenModal.imageWrapper}>
        <Animated.Image
          source={{ uri }}
          style={[spaceWeatherScreenStyles.fullscreenModal.image, animatedImageStyle]}
          resizeMode="contain"
        />
      </View>
    </GestureDetector>
  );
};

const SpaceWeatherScreen = () => {

  const { t, i18n } = useTranslation("tools/spaceWeather");
  const { location }: { location: GpsLocation } = useLocation();
  const { formatDate } = useAppUnits();

  const today = useMemo(() => new Date(), []);
  const user = useMemo(() => ({
    latitude: location?.latitude ?? 0,
    longitude: location?.longitude ?? 0,
    altitude: location?.elevation ?? 0,
  }), [location]);
  const [computedSun, setComputedSun] = useState<any>(null);
  const [sunImagery, setSunImagery] = useState<SunImagery | null>(null);
  const [selectedImage, setSelectedImage] = useState<SunImage | null>(null);
  const [isPlayingAnimation, setIsPlayingAnimation] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Retombe sur l'image statique à chaque changement de vignette plutôt que de garder l'animation
  // précédente en train de jouer sur le nouveau choix.
  useEffect(() => {
    setIsPlayingAnimation(false);
  }, [selectedImage?.wavelength]);

  // Rafraîchi au focus de l'écran plutôt qu'en continu (images/animations CDN NASA/NOAA, pas besoin
  // de polling — voir la doc de l'API). Le choix de la vignette sélectionnée est préservé d'un focus
  // à l'autre tant que la longueur d'onde existe encore dans la nouvelle réponse.
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const imagery = await getSunImagery();
        setSunImagery(imagery);
        setSelectedImage((current) => {
          const stillAvailable = imagery?.images.find((image) => image.wavelength === current?.wavelength);
          return stillAvailable ?? imagery?.images.find((image) => image.wavelength === "HMIIC") ?? imagery?.images[0] ?? null;
        });
      })();
    }, [])
  );

  useFocusEffect(
    useCallback(() => {
      StatusBar.setStyle("dark");
      return () => StatusBar.setStyle("light");
    }, [])
  );

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      console.log(`[SpaceWeatherScreen] Calculating sun data`);

      const now = new Date();
      const eqCoords = getSolarEquatorialCoordinate(now)
      const coords = convertEquatorialToHorizontal(now, user, eqCoords);
      const nextRise = getBodyNextRise(today, user, eqCoords);
      const nextSet = getBodyNextSet(today, user, eqCoords);
      const points = getAltitudeCurve(now, user, getSolarEquatorialCoordinate);

      const currentlyAboveHorizon = coords.alt >= 0;
      const chartRiseDate = currentlyAboveHorizon
        ? findPreviousHorizonCrossing(now, user, getSolarEquatorialCoordinate, "rise")
        : (nextRise ? nextRise.datetime : undefined);
      const chartSetDate = currentlyAboveHorizon
        ? (nextSet ? nextSet.datetime : undefined)
        : findPreviousHorizonCrossing(now, user, getSolarEquatorialCoordinate, "set");

      const daylightDuration = nextRise && nextSet ? (nextSet.datetime.getTime() - nextRise.datetime.getTime()) / 1000 : undefined;

      // getTwilightBandsForDay d'Observerly calcule sur une fenêtre minuit UTC → minuit UTC, pas
      // alignée sur le jour civil de l'observateur — pour un fuseau à l'est de l'UTC (ex: France),
      // ça peut renvoyer la nuit astronomique de la veille (tronquée au début de fenêtre) au lieu de
      // celle de ce soir, ou tronquer sa fin avant l'aube réelle. On cherche donc directement le
      // passage par -18° autour de `now`, comme pour le lever/coucher (seuil 0°) plus haut.
      const ASTRONOMICAL_NIGHT_THRESHOLD = -18;
      const currentlyInAstronomicalNight = coords.alt < ASTRONOMICAL_NIGHT_THRESHOLD;
      // Si on y est déjà, on veut savoir jusqu'à quand (prochain passage au-dessus de -18°) —
      // sinon, à partir de quand elle commencera ce soir (prochain passage en dessous). Absente si
      // le Soleil ne descend jamais sous -18° (ex: été/haute latitude). Voir formatDayRelativeTime.
      const astronomicalNightDate = currentlyInAstronomicalNight
        ? findNextHorizonCrossing(now, user, getSolarEquatorialCoordinate, "rise", ASTRONOMICAL_NIGHT_THRESHOLD)
        : findNextHorizonCrossing(now, user, getSolarEquatorialCoordinate, "set", ASTRONOMICAL_NIGHT_THRESHOLD);

      setComputedSun({
        altitudeCurve: points,
        chartRiseDate,
        chartSetDate,
        distance: getSolarDistance(now).toFixed(0),
        diameter: getSolarAngularDiameter(now),
        eqCoords,
        coords,
        rise: nextRise,
        set: nextSet,
        daylightDuration,
        astronomicalNightDate,
        isCurrentlyAstronomicalNight: currentlyInAstronomicalNight,
      });
    })

    return () => task.cancel();
  }, [])
  


  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("screen.title")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>

          <View style={globalStyles.defaultCard}>
            <View style={globalStyles.defaultCard.header}>
              <Text style={globalStyles.categoryTitle}>{t("imagery.title")}</Text>
              <Badge
                text={t("sumary.badge")}
                icon={Radio}
                borderColor={app_colors.red.main}
                backgroundColor="transparent"
                foregroundColor={app_colors.red.main}
              />
            </View>

            <View style={spaceWeatherScreenStyles.imageryContainer}>
              <View>
                {
                  isPlayingAnimation && selectedImage?.animationUrl ? (
                    <SunAnimationPlayer uri={selectedImage.animationUrl} style={spaceWeatherScreenStyles.imageryContainer.image} />
                  ) : (
                    <Image
                      style={spaceWeatherScreenStyles.imageryContainer.image}
                      src={selectedImage?.imageUrl}
                    />
                  )
                }

                <View style={spaceWeatherScreenStyles.imageryContainer.imageActions}>
                  {
                    selectedImage?.animationUrl && (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={spaceWeatherScreenStyles.imageryContainer.imageActions.button}
                        onPress={() => setIsPlayingAnimation((playing) => !playing)}
                      >
                        {
                          isPlayingAnimation
                            ? <Pause color={app_colors.white} size={16} fill={app_colors.white} />
                            : <Play color={app_colors.white} size={16} fill={app_colors.white} />
                        }
                      </TouchableOpacity>
                    )
                  }
                  {
                    selectedImage?.imageUrl && (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={spaceWeatherScreenStyles.imageryContainer.imageActions.button}
                        onPress={() => setIsFullscreen(true)}
                      >
                        <Maximize2 color={app_colors.white} size={16} />
                      </TouchableOpacity>
                    )
                  }
                </View>
              </View>

              <View>
                <Text style={spaceWeatherScreenStyles.imageryContainer.image.caption}>
                  {selectedImage?.label ?? t("imagery.caption")}
                </Text>
              </View>
            </View>

            <Text style={[globalStyles.categoryTitle, {marginTop: 20}]}>{t("imagery.otherWavelengths")}</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={true}
              contentContainerStyle={spaceWeatherScreenStyles.wavelengthsRow.content}
            >
              {
                [...(sunImagery?.images ?? []), sunImagery?.corona && { ...sunImagery.corona, wavelength: "CORONA" }]
                  .filter((image): image is SunImage => !!image)
                  .map((image) => (
                    <TouchableOpacity key={image.wavelength} style={spaceWeatherScreenStyles.wavelengthsRow.item} onPress={() => setSelectedImage(image)}>
                      <Image
                        style={[
                          spaceWeatherScreenStyles.wavelengthsRow.item.thumbnail,
                          selectedImage?.wavelength === image.wavelength && spaceWeatherScreenStyles.wavelengthsRow.item.thumbnailActive,
                        ]}
                        src={image.imageUrl}
                      />
                      <Text style={spaceWeatherScreenStyles.wavelengthsRow.item.label}>{image.label}</Text>
                    </TouchableOpacity>
                  ))
              }
            </ScrollView>
          </View>

          <View style={globalStyles.defaultCard}>
            <View style={globalStyles.defaultCard.header}>
              <Text style={globalStyles.categoryTitle}>{t("sumary.title")}</Text>
            </View>

            <AltitudeChart
              points={computedSun?.altitudeCurve ?? []}
              riseDate={computedSun?.chartRiseDate}
              setDate={computedSun?.chartSetDate}
            />

            <ListCard
              additionalContainerStyles={{borderWidth: 0, padding: 0, marginTop: 20}}
              items={[
                {
                  title: t("sumary.stats.altitude.title"),
                  value: computedSun?.coords?.alt ? `${computedSun.coords.alt.toFixed(2)} °` : "--",
                },
                {
                  title: t("sumary.stats.azimuth.title"),
                  value: computedSun?.coords?.az ? `${computedSun.coords.az.toFixed(2)} °` : "--",
                },
                {
                  title: t("sumary.stats.distance.title"),
                  value: computedSun?.distance ? `${formatDistanceInKm(computedSun.distance, i18n.language)} (${formatDistanceInUA(computedSun.distance, i18n.language)})` : "--",
                },
                {
                  title: t("sumary.stats.angularDiameter.title"),
                  value: computedSun?.diameter ? `${computedSun.diameter.toFixed(2)} °` : "--",
                },
                {
                  title: t("sumary.stats.daylightDuration.title"),
                  value: computedSun?.daylightDuration ? formatDuration(computedSun.daylightDuration, t) : "--",
                },
                {
                  title: t("sumary.stats.astronomicalNight.title"),
                  value: formatDayRelativeTime(computedSun?.astronomicalNightDate, !!computedSun?.isCurrentlyAstronomicalNight, t, formatDate, today),
                },
              ]}
            />
          </View>
        </View>
      </ScrollView>

      <Modal visible={isFullscreen} animationType="fade" transparent onRequestClose={() => setIsFullscreen(false)}>
        <View style={spaceWeatherScreenStyles.fullscreenModal}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={spaceWeatherScreenStyles.fullscreenModal.close}
            onPress={() => setIsFullscreen(false)}
          >
            <X color={app_colors.white} size={22} />
          </TouchableOpacity>
          {
            // Démonté/remonté à chaque fermeture du modal — voir le commentaire de ZoomableImage :
            // ça repart systématiquement de 1x plutôt que de garder le zoom de la dernière ouverture.
            isFullscreen && selectedImage?.imageUrl && <ZoomableImage uri={selectedImage.imageUrl} />
          }
        </View>
      </Modal>
    </View>
  )
}

export default SpaceWeatherScreen