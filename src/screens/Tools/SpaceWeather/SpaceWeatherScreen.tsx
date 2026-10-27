import { Image, InteractionManager, ScrollView, Text, TouchableOpacity, View } from "react-native"
import { globalStyles } from "../../../helpers/globalStyles"
import { ScreenHeader } from "../../../components/ScreenHeader/ScreenHeader"
import { useTranslation } from "react-i18next";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { useLocation } from "../../../context/LocationContext";
import Badge from "../../../components/Badges/Badge/Badge";
import { Info, Magnet, Maximize2, Minus, Pause, Play, Radio, TrendingDown, TrendingUp, Wind } from "lucide-react-native";
import { app_colors, getNoaaScaleColor } from "../../../helpers/variables";
import ListCard from "../../../components/cards/ListCard/ListCard";
import SunAnimationPlayer from "../../../components/SunAnimationPlayer/SunAnimationPlayer";
import FullscreenImageModal from "../../../components/FullscreenImageModal/FullscreenImageModal";
import { convertEquatorialToHorizontal, getBodyNextRise, getBodyNextSet, getSolarAngularDiameter, getSolarDistance, getSolarEquatorialCoordinate } from "@observerly/astrometry";
import { findPreviousHorizonCrossing, getAltitudeCurve } from "../../../helpers/astrometry/altitude/altitudeCurve";
import { getAstronomicalNightWindow } from "../../../helpers/astrometry/night/nightWindow";
import { formatDayRelativeTime, formatDistanceInKm, formatDistanceInUA, formatDuration, formatTransit, formatWithSpaces } from "../../../helpers/format";
import { useAppUnits } from "../../../hooks/useAppUnits";
import AltitudeChart from "../../../components/AltitudeChart/AltitudeChart";
import KpIndexChart from "../../../components/KpIndexChart/KpIndexChart";
import { spaceWeatherScreenStyles } from "./SpaceWeatherScreen.styles";
import { getSunImagery } from "../../../helpers/api/spaceWeather/sunImagery";
import type { SunImage, SunImagery } from "../../../types/spaceWeather/SunImagery";
import { getImf } from "../../../helpers/api/spaceWeather/imf";
import type { ImfData } from "../../../types/spaceWeather/InterplanetaryMagneticField";
import { getSolarWind } from "../../../helpers/api/spaceWeather/wind";
import type { SolarWindData, SolarWindLevel } from "../../../types/spaceWeather/SolarWind";
import { getKpIndex } from "../../../helpers/api/spaceWeather/kpIndex";
import type { KpData } from "../../../types/spaceWeather/KpIndex";
import { getSolarFlares } from "../../../helpers/api/spaceWeather/solarFlares";
import type { SolarFlaresData } from "../../../types/spaceWeather/SolarFlares";
import { getSpaceWeatherAlerts } from "../../../helpers/api/spaceWeather/alerts";
import type { SpaceWeatherAlertsData } from "../../../types/spaceWeather/SpaceWeatherAlerts";
import { getNoaaScales } from "../../../helpers/api/spaceWeather/scales";
import type { NoaaScalesData } from "../../../types/spaceWeather/NoaaScales";
import SpaceWeatherEvents from "../../../components/SpaceWeatherEvents/SpaceWeatherEvents";
import NoaaScaleCard from "../../../components/cards/NoaaScaleCard/NoaaScaleCard";

// Amplitude affichée de la jauge Bz : demandé jusqu'à ±30 nT (au-delà, valeur bornée visuellement
// — un Bz hors de cette plage reste un évènement extrême, le marqueur sature au bord plutôt que de
// sortir de la piste).
const BZ_MIN = -30;
const BZ_MAX = 30;

// Ordre d'affichage des paliers du vent solaire (la piste a un segment par palier, dans cet ordre).
const SOLAR_WIND_LEVELS: SolarWindLevel[] = ["slow", "moderate", "fast", "very_fast"];

const SpaceWeatherScreen = () => {

  const { t, i18n } = useTranslation("tools/spaceWeather");
  const { location } = useLocation();
  const { formatDate } = useAppUnits();

  const today = useMemo(() => new Date(), []);
  const user = useMemo(() => ({
    latitude: location?.latitude ?? 0,
    longitude: location?.longitude ?? 0,
    altitude: location?.elevation ?? 0,
  }), [location]);
  const [computedSun, setComputedSun] = useState<any>(null);
  const [imf, setImf] = useState<ImfData | null>(null);
  const [solarWind, setSolarWind] = useState<SolarWindData | null>(null);
  const [kpIndex, setKpIndex] = useState<KpData | null>(null);
  const [solarFlares, setSolarFlares] = useState<SolarFlaresData | null>(null);
  const [spaceWeatherAlerts, setSpaceWeatherAlerts] = useState<SpaceWeatherAlertsData | null>(null);
  const [noaaScales, setNoaaScales] = useState<NoaaScalesData | null>(null);
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

  // Kp/scales évoluent sur ~3h à 1 jour, et flares/alerts sont dans le même cas que sun/alerts
  // (pas de polling continu nécessaire) — donc un simple refresh au focus de l'écran, comme pour les
  // images solaires ci-dessus, pas de minuteur périodique comme pour wind/imf.
  useFocusEffect(
    useCallback(() => {
      (async () => {
        const [kp, flares, alerts, scales] = await Promise.all([
          getKpIndex(),
          getSolarFlares(),
          getSpaceWeatherAlerts(),
          getNoaaScales(),
        ]);
        setKpIndex(kp);
        setSolarFlares(flares);
        setSpaceWeatherAlerts(alerts);
        setNoaaScales(scales);
      })();
    }, [])
  );

  // Le vent solaire et l'IMF évoluent minute par minute (contrairement aux images), mais la doc de
  // l'API indique qu'un refresh toutes les 5-10 min suffit largement côté UI — pas la peine
  // d'interroger en continu. Rafraîchis immédiatement à chaque focus de l'écran (en parallèle), puis
  // toutes les 5 min tant que l'écran reste affiché. Même cadence pour les deux (regroupés dans la
  // doc de l'API), donc un seul minuteur plutôt qu'un par endpoint.
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const refresh = async () => {
        const [imfData, windData] = await Promise.all([getImf(), getSolarWind()]);
        if (cancelled) return;
        setImf(imfData);
        setSolarWind(windData);
      };

      refresh();
      const interval = setInterval(refresh, 5 * 60 * 1000);

      return () => {
        cancelled = true;
        clearInterval(interval);
      };
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

      // getAstronomicalNightWindow gère déjà le souci de fuseau (voir son propre commentaire) via
      // les mêmes primitives findPreviousHorizonCrossing/findNextHorizonCrossing qu'avant ici.
      const nightWindow = getAstronomicalNightWindow(now, user);
      const currentlyInAstronomicalNight = nightWindow?.isCurrentlyNight ?? false;
      // Si on y est déjà, on veut savoir jusqu'à quand (fin de la nuit) — sinon, à partir de quand
      // elle commencera ce soir (début). Absente si le Soleil ne descend jamais sous -18° (ex: été/
      // haute latitude). Voir formatDayRelativeTime.
      const astronomicalNightDate = currentlyInAstronomicalNight ? nightWindow?.end : nightWindow?.start;

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

          {/* TODO : Creer les cartes locker et l'écran locker Astroshare PRO */}
          <View style={[globalStyles.defaultCard, spaceWeatherScreenStyles.kpCard]}>
            <View style={globalStyles.defaultCard.header}>
              <Text style={[globalStyles.categoryTitle, {color: app_colors.white}]}>{t("kpIndex.title")}</Text>
              <Badge
                text={`${noaaScales?.current.geomagnetic.scale} - ${noaaScales?.current.geomagnetic.label}` || '--'}
                backgroundColor={app_colors.yellow.main}
                foregroundColor={app_colors.primary.main}
              />
            </View>

            <View style={spaceWeatherScreenStyles.kpCard.valueRow}>
              <Text style={spaceWeatherScreenStyles.kpCard.valueRow.value}>{kpIndex?.current.kp}</Text>
              <Text style={spaceWeatherScreenStyles.kpCard.valueRow.unit}>/ 9</Text>
              {
                kpIndex?.current && (
                  <View style={spaceWeatherScreenStyles.kpCard.valueRow.trend}>
                    {
                      kpIndex.current.trend === "rising" ? (
                        <TrendingUp color={app_colors.yellow.main} size={14} />
                      ) : kpIndex.current.trend === "falling" ? (
                        <TrendingDown color={app_colors.yellow.main} size={14} />
                      ) : (
                        <Minus color={app_colors.yellow.main} size={14} />
                      )
                    }
                    <Text style={spaceWeatherScreenStyles.kpCard.valueRow.trend.label}>
                      {t(`kpIndex.trend.${kpIndex.current.trend}`)} · {t(`kpIndex.scale.${kpIndex.current.level}`)}
                    </Text>
                  </View>
                )
              }
            </View>

            <KpIndexChart data={kpIndex} />
          </View>

          <View style={spaceWeatherScreenStyles.scalesContainer}>
            <View style={globalStyles.defaultCard.header}>
              <Text style={globalStyles.categoryTitle}>{t("scales.title")}</Text>
              {/* TODO : Implémenter l'écran "voir tout" */}
              <TouchableOpacity onPress={() => {}}>
                <Text style={spaceWeatherScreenStyles.scalesContainer.link}>{t("scales.all")}</Text>
              </TouchableOpacity>
            </View>

            <View style={spaceWeatherScreenStyles.scalesContainer.scales}>
              <NoaaScaleCard
                value={noaaScales?.current.geomagnetic.scale ?? "--"}
                title={noaaScales?.current.geomagnetic.label ?? "--"}
                subtitle={t(`scales.geomagnetic.title`)}
                containerStyle={{backgroundColor: getNoaaScaleColor(noaaScales?.current.geomagnetic.scale)}}
              />

              <NoaaScaleCard
                value={noaaScales?.current.radioBlackout.scale ?? "--"}
                title={noaaScales?.current.radioBlackout.label ?? "--"}
                subtitle={t(`scales.radioBlackout.title`)}
                containerStyle={{backgroundColor: getNoaaScaleColor(noaaScales?.current.radioBlackout.scale)}}
              />

              <NoaaScaleCard
                value={noaaScales?.current.solarRadiation.scale ?? "--"}
                title={noaaScales?.current.solarRadiation.label ?? "--"}
                subtitle={t(`scales.solarRadiation.title`)}
                containerStyle={{backgroundColor: getNoaaScaleColor(noaaScales?.current.solarRadiation.scale)}}
              />
            </View>
          </View>

          <View style={globalStyles.defaultCard}>
            <View style={globalStyles.defaultCard.header}>
              <View style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 6}}>
                <Magnet color={app_colors.primary.medium} size={20} />
                <Text style={globalStyles.categoryTitle}>{t("magneticField.title")}</Text>
              </View>
              <TouchableOpacity onPress={() => {}}>
                <Info color={app_colors.primary.medium} size={20} />
              </TouchableOpacity>
            </View>

            <View style={spaceWeatherScreenStyles.magneticFieldContainer}>
              <View style={spaceWeatherScreenStyles.magneticFieldContainer.values}>
                <View style={{display: "flex", flexDirection: "row", gap: 5, alignItems: "baseline"}}>
                  <Text style={spaceWeatherScreenStyles.magneticFieldContainer.values.main}>
                    {imf?.current ? imf.current.bz.toFixed(1) : "--"}
                  </Text>
                  <Text style={spaceWeatherScreenStyles.magneticFieldContainer.values.unit}>nT</Text>
                </View>

                <View style={{display: "flex", flexDirection: "row", gap: 5, alignItems: "baseline"}}>
                  <Text style={spaceWeatherScreenStyles.magneticFieldContainer.values.text}>Bt</Text>
                  <Text style={spaceWeatherScreenStyles.magneticFieldContainer.values.secondary}>
                    {imf?.current ? imf.current.bt.toFixed(1) : "--"}
                  </Text>
                  <Text style={spaceWeatherScreenStyles.magneticFieldContainer.values.text}>nT</Text>
                </View>
              </View>

              <View style={spaceWeatherScreenStyles.bzScale}>
                <View style={spaceWeatherScreenStyles.bzScale.track}>
                  {
                    imf?.current && (() => {
                      const clamped = Math.min(Math.max(imf.current.bz, BZ_MIN), BZ_MAX);
                      const valuePercent = ((clamped - BZ_MIN) / (BZ_MAX - BZ_MIN)) * 100; // 0..100, 50 = centre (0 nT)
                      const fillLeft = Math.min(50, valuePercent);
                      const fillWidth = Math.abs(valuePercent - 50);

                      return (
                        <View
                          style={[
                            spaceWeatherScreenStyles.bzScale.track.fill,
                            { left: `${fillLeft}%`, width: `${fillWidth}%` },
                          ]}
                        />
                      );
                    })()
                  }
                  {/* Repère fixe du 0 — ne bouge jamais, seul le remplissage jaune indique la valeur. */}
                  <View style={[spaceWeatherScreenStyles.bzScale.track.marker, { left: "50%" }]} />
                </View>
                <View style={[spaceWeatherScreenStyles.bzScale.extremes, { position: "relative" }]}>
                  <Text style={spaceWeatherScreenStyles.bzScale.extremes.text}>
                    {t("magneticField.scale.south")}
                  </Text>
                  {/* Position absolue sur toute la largeur de la rangée + textAlign:"center", plutôt
                      que de compter sur flex pour équilibrer les deux côtés : ça centre le "0" sur le
                      centre réel de la rangée (= centre de la piste au-dessus) indépendamment de la
                      largeur des textes latéraux — flex:1 des deux côtés n'a pas suffi à l'obtenir. */}
                  <Text style={[spaceWeatherScreenStyles.bzScale.extremes.text, { position: "absolute", left: 0, right: 0, textAlign: "center" }]}>
                    0
                  </Text>
                  <Text style={spaceWeatherScreenStyles.bzScale.extremes.text}>
                    {t("magneticField.scale.north")}
                  </Text>
                </View>
              </View>
            </View>
          </View>


          <View style={globalStyles.defaultCard}>
            <View style={globalStyles.defaultCard.header}>
              <View style={{display: "flex", flexDirection: "row", alignItems: "center", gap: 6}}>
                <Wind color={app_colors.primary.medium} size={20} />
                <Text style={globalStyles.categoryTitle}>{t("solarWind.title")}</Text>
              </View>

              <TouchableOpacity onPress={() => {}}>
                <Info color={app_colors.primary.medium} size={20} />
              </TouchableOpacity>
            </View>

            <View style={spaceWeatherScreenStyles.solarWindContainer}>
              <View style={spaceWeatherScreenStyles.solarWindContainer.valueRow}>
                <View style={spaceWeatherScreenStyles.solarWindContainer.valueRow.value}>
                  <Text style={spaceWeatherScreenStyles.solarWindContainer.valueRow.value.main}>
                    {solarWind?.current ? solarWind.current.speed.toFixed(0) : "--"}
                  </Text>
                  <Text style={spaceWeatherScreenStyles.solarWindContainer.valueRow.value.unit}>km/s</Text>
                </View>
                {
                  solarWind?.current && (
                    // Badge a alignSelf: "flex-start" en dur dans ses styles, qui écrase l'alignItems
                    // du parent — contourné en l'enveloppant dans une View étirée sur toute la hauteur
                    // de la rangée (voir le même contournement tenté plus haut pour le Bz).
                    <View style={{alignSelf: "stretch", justifyContent: "center"}}>
                      <Badge
                        text={solarWind.current.label}
                        backgroundColor={app_colors.yellow.main}
                        foregroundColor={app_colors.primary.main}
                      />
                    </View>
                  )
                }
              </View>

              <View style={spaceWeatherScreenStyles.solarWindContainer.scale}>
                <View style={{position: "relative"}}>
                  <View style={spaceWeatherScreenStyles.solarWindContainer.scale.track}>
                    {
                      SOLAR_WIND_LEVELS.map((level) => (
                        <View
                          key={level}
                          style={[
                            spaceWeatherScreenStyles.solarWindContainer.scale.track.segment,
                            solarWind?.current?.level === level && spaceWeatherScreenStyles.solarWindContainer.scale.track.segment.active,
                          ]}
                        />
                      ))
                    }
                  </View>
                </View>
                <View style={spaceWeatherScreenStyles.solarWindContainer.scale.labels}>
                  {
                    SOLAR_WIND_LEVELS.map((level) => (
                      <Text key={level} style={spaceWeatherScreenStyles.solarWindContainer.scale.labels.label}>
                        {t(`solarWind.scale.${level}`)}
                      </Text>
                    ))
                  }
                </View>
              </View>

              <View style={spaceWeatherScreenStyles.solarWindContainer.divider} />

              <View style={spaceWeatherScreenStyles.solarWindContainer.details}>
                <View style={spaceWeatherScreenStyles.solarWindContainer.details.column}>
                  <Text style={spaceWeatherScreenStyles.solarWindContainer.details.column.label}>{t("solarWind.density")}</Text>
                  <Text style={spaceWeatherScreenStyles.solarWindContainer.details.column.value}>
                    {solarWind?.current?.density != null ? `${solarWind.current.density.toFixed(1)} p/cm³` : "--"}
                  </Text>
                </View>
                <View style={spaceWeatherScreenStyles.solarWindContainer.details.column}>
                  <Text style={spaceWeatherScreenStyles.solarWindContainer.details.column.label}>{t("solarWind.temperature")}</Text>
                  <Text style={spaceWeatherScreenStyles.solarWindContainer.details.column.value}>
                    {solarWind?.current?.temperature != null ? `${formatWithSpaces(Math.round(solarWind.current.temperature))} K` : "--"}
                  </Text>
                </View>
              </View>

              {
                solarWind?.current && (
                  <Text style={spaceWeatherScreenStyles.solarWindContainer.description}>
                    {t(`solarWind.descriptions.${solarWind.current.level}`)}
                  </Text>
                )
              }
            </View>
          </View>

          <View style={spaceWeatherScreenStyles.eventsContainer}>
            <View style={globalStyles.defaultCard.header}>
              <Text style={globalStyles.categoryTitle}>{t("events.title")}</Text>
              {/* TODO : Implémenter l'écran "voir tout" */}
              <TouchableOpacity onPress={() => {}}>
                <Text style={spaceWeatherScreenStyles.eventsContainer.link}>{t("events.all")}</Text>
              </TouchableOpacity>
            </View>

            <View style={spaceWeatherScreenStyles.eventsContainer.scales}>
              <SpaceWeatherEvents alerts={spaceWeatherAlerts} flares={solarFlares} />
            </View>
          </View>

        </View>
      </ScrollView>

      <FullscreenImageModal
        visible={isFullscreen}
        imageUrl={selectedImage?.imageUrl}
        onClose={() => setIsFullscreen(false)}
      />
    </View>
  )
}

export default SpaceWeatherScreen