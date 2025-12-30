import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Image, LayoutChangeEvent, PanResponder, Text, TouchableOpacity, View} from "react-native";
import {LinearGradient} from "expo-linear-gradient";
import {planetariumUIStyles} from "../../styles/components/skymap/planetariumUI";
import {useSettings} from "../../contexts/AppSettingsContext";
import dayjs, {Dayjs} from "dayjs";
import {isNight} from "@observerly/astrometry";
import {ComputedObjectInfos} from "../../helpers/types/objects/ComputedObjectInfos";
import {DSO} from "../../helpers/types/DSO";
import {Star} from "../../helpers/types/Star";
import {GlobalPlanet} from "../../helpers/types/GlobalPlanet";
import VisibilityGraph from "../graphs/VisibilityGraph";
import SimpleButton from "../commons/buttons/SimpleButton";
import SimpleBadge from "../badges/SimpleBadge";
import {app_colors} from "../../helpers/constants";
import DSOValues from "../commons/DSOValues";
import {i18n} from "../../helpers/scripts/i18n";
import {convertDegreesRaToHMS} from "../../helpers/scripts/astro/coords/convertDegreesRaToHMS";
import {prettyDec, prettyRa} from "../../helpers/scripts/astro/prettyCoords";
import {convertDegreesDecToDMS} from "../../helpers/scripts/astro/coords/convertDegreesDecToDms";
import PlanetariumSearchModal from "./PlanetariumSearchModal";
import { useTranslation } from "../../hooks/useTranslation";
import { makeCalendarMapping } from "../../helpers/scripts/i18n/dayjsCalendarTimeCustom";
import {getSunData} from "../../helpers/scripts/astro/solar/sunData";

interface PlanetariumUIProps {
  navigation: any;
  infos: ComputedObjectInfos | null;
  onShowEqGrid: () => void;
  onShowConstellations: () => void;
  onShowAzGrid: () => void;
  onShowGround: () => void;
  onShowPlanets: () => void;
  onShowDSO: () => void;
  onShowCompassLabels: () => void;
  onCenterObject: () => void;
  onSelectObject: (obj: DSO | GlobalPlanet | Star) => void;
  onShowAtmosphere?: () => void;
  isFollowing: boolean;
  onToggleFollow: () => void;
  timelineDate: Dayjs;
  onChangeTimelineDate: (next: Dayjs) => void;
  onResetTimelineDate: () => void;
  onToggleTimelinePlay: () => void;
  isTimelinePlaying: boolean;
}

export default function PlanetariumUI({ navigation, infos, onShowGround, onShowConstellations, onShowAzGrid, onShowEqGrid, onShowDSO, onShowPlanets, onShowCompassLabels, onCenterObject, onSelectObject, onShowAtmosphere, isFollowing, onToggleFollow, timelineDate, onChangeTimelineDate, onResetTimelineDate, onToggleTimelinePlay, isTimelinePlaying }: PlanetariumUIProps) {

  const {currentUserLocation} = useSettings();
  const {currentLocale} = useTranslation();
  const [currentTime, setCurrentTime] = useState<string>(timelineDate.format('HH:mm:ss'));
  const [isNightTime, setIsNightTime] = useState<boolean>(false);
  const SLIDER_RANGE_HOURS = 12;
  const sliderAnchorRef = useRef<Dayjs>(dayjs());
  const [sliderOffsetHours, setSliderOffsetHours] = useState<number>(0);
  const [sliderWidth, setSliderWidth] = useState<number>(0);
  const sliderFrameRef = useRef<number | null>(null);
  const pendingSliderRatioRef = useRef<number | null>(null);

  const [showLayerModal, setShowLayerModal] = useState<boolean>(false);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [showTimelineModal, setShowTimelineModal] = useState<boolean>(false);

  const [objectInfos, setObjectInfos] = useState<ComputedObjectInfos | null>(null);
  const [currentInfoTab, setCurrentInfoTab] = useState<number>(0);
  const lastObjectKeyRef = useRef<string | null>(null);

  useEffect(() => {
    setCurrentTime(timelineDate.format('HH:mm:ss'));
    setIsNightTime(isNight(timelineDate.toDate(), {latitude: currentUserLocation.lat, longitude: currentUserLocation.lon}));
  }, [timelineDate, currentUserLocation]);

  useEffect(() => {
    const anchor = sliderAnchorRef.current;
    const deltaMinutes = timelineDate.diff(anchor, 'minute');
    const clampedMinutes = Math.min(Math.max(deltaMinutes, -SLIDER_RANGE_HOURS * 60), SLIDER_RANGE_HOURS * 60);
    setSliderOffsetHours(clampedMinutes / 60);
  }, [SLIDER_RANGE_HOURS, timelineDate]);

  const observer = useMemo(() => {
    if (!currentUserLocation) return null;
    return { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon };
  }, [currentUserLocation]);

  const sunTimes = useMemo(() => {
    if (!observer) return { sunrise: null as Dayjs | null, sunset: null as Dayjs | null };
    const sunData = getSunData(timelineDate, observer);
    return { sunrise: sunData.visibility.sunrise, sunset: sunData.visibility.sunset };
  }, [observer, timelineDate]);

  useEffect(() => {
    // console.log("[PlanetariumUI] Infos updated:", infos);
    const nextKey = infos ? `${infos.base.name}-${infos.base.type}` : null;
    if (nextKey !== lastObjectKeyRef.current) {
      setCurrentInfoTab(0);
    }
    lastObjectKeyRef.current = nextKey;

    if (infos) {
      setObjectInfos(infos);
    } else {
      setObjectInfos(null);
    }
  }, [infos]);

  const handleShowSearch = () => {
    setShowSearchBar(!showSearchBar);
    setShowLayerModal(false);
    setShowTimelineModal(false);
  }

  const handleShowLayers = () => {
    setShowLayerModal(!showLayerModal);
    setShowSearchBar(false);
    setShowTimelineModal(false);
  }

  const handleShowTimeline = () => {
    if (!showTimelineModal) {
      sliderAnchorRef.current = timelineDate;
    }
    setShowTimelineModal(!showTimelineModal);
    setShowSearchBar(false);
    setShowLayerModal(false);
  }

  const adjustTimeline = (unit: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year', delta: number) => {
    onChangeTimelineDate(timelineDate.add(delta, unit));
  };

  const handleResetTimeline = () => {
    onResetTimelineDate();
    setShowTimelineModal(false);
  };

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const sliderPercent = useMemo(() => {
    return clamp((sliderOffsetHours + SLIDER_RANGE_HOURS) / (SLIDER_RANGE_HOURS * 2), 0, 1);
  }, [SLIDER_RANGE_HOURS, sliderOffsetHours]);

  const handleSliderLayout = (event: LayoutChangeEvent) => {
    setSliderWidth(event.nativeEvent.layout.width);
  };

  const setTimelineFromRatio = useCallback((ratio: number) => {
    const clamped = clamp(ratio, 0, 1);
    pendingSliderRatioRef.current = clamped;

    if (sliderFrameRef.current !== null) return;

    sliderFrameRef.current = requestAnimationFrame(() => {
      const nextRatio = pendingSliderRatioRef.current;
      pendingSliderRatioRef.current = null;
      sliderFrameRef.current = null;
      if (nextRatio === null) return;

      const minutesFromAnchor = (nextRatio * SLIDER_RANGE_HOURS * 2 - SLIDER_RANGE_HOURS) * 60;
      const nextDate = sliderAnchorRef.current.add(minutesFromAnchor, 'minute');
      onChangeTimelineDate(nextDate);
    });
  }, [SLIDER_RANGE_HOURS, onChangeTimelineDate]);

  const sliderPanResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      if (!sliderWidth) return;
      const ratio = clamp(evt.nativeEvent.locationX / sliderWidth, 0, 1);
      setTimelineFromRatio(ratio);
    },
    onPanResponderMove: (evt) => {
      if (!sliderWidth) return;
      const ratio = clamp(evt.nativeEvent.locationX / sliderWidth, 0, 1);
      setTimelineFromRatio(ratio);
    },
  }), [setTimelineFromRatio, sliderWidth]);

  const timelinePhaseLabel = useMemo(() => {
    const { sunrise, sunset } = sunTimes;
    if (sunrise && timelineDate.isBefore(sunrise.add(40, 'minute'))) return 'Dawn';
    if (sunrise && sunset && timelineDate.isAfter(sunrise) && timelineDate.isBefore(sunset)) {
      if (timelineDate.isAfter(sunset.subtract(40, 'minute'))) return 'Dusk';
      return 'Daylight';
    }
    return 'Night';
  }, [sunTimes, timelineDate]);

  const timelineGradient = useMemo(() => {
    const nightColor = '#09192c';
    const dayColor = '#09192c'; // remove bright daylight color from timeline
    const twilightColor = '#1bb5ff';

    const rangeStart = sliderAnchorRef.current.subtract(SLIDER_RANGE_HOURS, 'hour');
    const rangeEnd = sliderAnchorRef.current.add(SLIDER_RANGE_HOURS, 'hour');
    const totalMinutes = Math.max(rangeEnd.diff(rangeStart, 'minute'), 1);
    const { sunrise, sunset } = sunTimes;

    if (!sunrise || !sunset) {
      const isNightPhase = observer ? isNight(timelineDate.toDate(), observer) : true;
      return {
        colors: isNightPhase ? [nightColor, nightColor] : [dayColor, dayColor],
        locations: [0, 1]
      };
    }

    const sunrisePos = clamp(sunrise.diff(rangeStart, 'minute') / totalMinutes, 0, 1);
    const sunsetPos = clamp(sunset.diff(rangeStart, 'minute') / totalMinutes, 0, 1);
    const dawnStart = clamp(sunrisePos - 0.05, 0, 1);
    const dawnEnd = clamp(sunrisePos + 0.05, 0, 1);
    const duskStart = clamp(sunsetPos - 0.05, 0, 1);
    const duskEnd = clamp(sunsetPos + 0.05, 0, 1);

    return {
      colors: [
        nightColor,
        twilightColor,
        dayColor,
        dayColor,
        twilightColor,
        nightColor,
      ],
      locations: [
        0,
        dawnStart,
        dawnEnd,
        duskStart,
        duskEnd,
        1,
      ]
    };
  }, [SLIDER_RANGE_HOURS, observer, sunTimes, timelineDate]);

  const sliderThumbLeft = sliderWidth ? sliderPercent * sliderWidth : sliderPercent * 240;
  useEffect(() => {
    return () => {
      if (sliderFrameRef.current !== null) {
        cancelAnimationFrame(sliderFrameRef.current);
      }
    };
  }, []);

  const objectInfoContent = useMemo(() => {
    if (!objectInfos) return null;

    return (
      <View>
        <View style={{display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', gap: 8, marginTop: 10}}>
          <SimpleButton active={currentInfoTab === 0} small text="Infos" icon={require('../../../assets/icons/FiInfo.png')} backgroundColor={app_colors.black_skymap} textColor={app_colors.white} onPress={() => setCurrentInfoTab(0)} />
          <SimpleButton active={currentInfoTab === 1} small text="Visibilité" icon={require('../../../assets/icons/FiEye.png')} backgroundColor={app_colors.black_skymap} textColor={app_colors.white} onPress={() => setCurrentInfoTab(1)} />
          <SimpleButton active={currentInfoTab === 2} small text="Détails" icon={require('../../../assets/icons/FiFileText.png')} backgroundColor={app_colors.black_skymap} textColor={app_colors.white} onPress={() => setCurrentInfoTab(2)} />
          <SimpleButton active={isFollowing} small text="Suivre" icon={require('../../../assets/icons/FiCompass.png')} backgroundColor={app_colors.black_skymap} textColor={app_colors.white} onPress={() => onToggleFollow()} />
        </View>

        {currentInfoTab === 0 && (
          <View style={planetariumUIStyles.container.generalInfosBar.body}>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100%', gap: 10}}>
              <View style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                <Image style={planetariumUIStyles.container.generalInfosBar.body.image} source={objectInfos.base.icon} />
              </View>
              <View style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                <Text style={planetariumUIStyles.container.generalInfosBar.body.title}>{objectInfos.base.otherName || objectInfos.base.name}</Text>
                <Text style={planetariumUIStyles.container.generalInfosBar.body.subtitle}>{objectInfos.base.type}</Text>
              </View>
              <View style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flex: 1, gap: 5}}>
                <SimpleBadge
                  text={objectInfos.visibilityInfos.visibilityLabel}
                  backgroundColor={objectInfos.visibilityInfos.visibilityBackgroundColor}
                  foregroundColor={objectInfos.visibilityInfos.visibilityForegroundColor}
                  icon={objectInfos.visibilityInfos.visibilityIcon}
                />

                <SimpleBadge
                  text={objectInfos.base.alt}
                  backgroundColor={app_colors.white_twenty}
                  foregroundColor={app_colors.white}
                  icon={require('../../../assets/icons/FiAngleRight.png')}
                />
              </View>
            </View>
          </View>
        )}

        {currentInfoTab === 1 && (
          <View style={planetariumUIStyles.container.generalInfosBar.body}>
            <View style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: 10, width: '100%'}}>
              <Text style={planetariumUIStyles.container.generalInfosBar.body.text}>Heures de lever et coucher</Text>

              {
                objectInfos?.visibilityInfos.isCircumpolar ? (
                  <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10}}>
                    <Image source={require('../../../assets/icons/FiSunrise.png')} style={{width: 24, height: 24}}/>
                    <Text style={planetariumUIStyles.container.generalInfosBar.body.text}>{
                      objectInfos?.visibilityInfos.isCurrentlyVisible ? i18n.t('common.visibility.alwaysVisible') : objectInfos?.visibilityInfos.objectNextRise?.locale(currentLocale).calendar(dayjs(), makeCalendarMapping())
                    }</Text>
                  </View>
                ) : (
                  <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 30}}>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10}}>
                      <Image source={require('../../../assets/icons/FiSunrise.png')} style={{width: 24, height: 24}}/>
                      <Text style={planetariumUIStyles.container.generalInfosBar.body.text}>{
                        objectInfos?.visibilityInfos.isCurrentlyVisible ? i18n.t('common.visibility.alreadyUp') : objectInfos?.visibilityInfos.objectNextRise?.locale(currentLocale).calendar(dayjs(), makeCalendarMapping())
                      }</Text>
                    </View>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10}}>
                      <Image source={require('../../../assets/icons/FiSunset.png')} style={{width: 24, height: 24}}/>
                      <Text style={planetariumUIStyles.container.generalInfosBar.body.text}>{
                        !objectInfos?.visibilityInfos.isCurrentlyVisible ? i18n.t('common.visibility.alreadyDown') : objectInfos?.visibilityInfos.objectNextSet?.locale(currentLocale).calendar(dayjs() , makeCalendarMapping())
                      }</Text>
                    </View>
                  </View>
                )
              }
            </View>
            <VisibilityGraph visibilityGraph={objectInfos.visibilityInfos.visibilityGraph}/>
          </View>
        )}

        {currentInfoTab === 2 && (
          <View style={planetariumUIStyles.container.generalInfosBar.body}>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100%', gap: 10}}>
              <View style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                <Image style={planetariumUIStyles.container.generalInfosBar.body.image} source={objectInfos.base.icon} />
              </View>
              <View style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                <Text style={planetariumUIStyles.container.generalInfosBar.body.title}>{objectInfos.base.otherName || objectInfos.base.name}</Text>
                <Text style={planetariumUIStyles.container.generalInfosBar.body.subtitle}>{objectInfos.base.type}</Text>
              </View>
              <View style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', flex: 1, gap: 5}}>
                <SimpleBadge
                  text={objectInfos.visibilityInfos.visibilityLabel}
                  backgroundColor={objectInfos.visibilityInfos.visibilityBackgroundColor}
                  foregroundColor={objectInfos.visibilityInfos.visibilityForegroundColor}
                  icon={objectInfos.visibilityInfos.visibilityIcon}
                />

                <SimpleBadge
                  text={objectInfos.base.alt}
                  backgroundColor={app_colors.white_twenty}
                  foregroundColor={app_colors.white}
                  icon={require('../../../assets/icons/FiAngleRight.png')}
                />
              </View>
            </View>
            <View style={{width: '100%', marginTop: 20}}>
              <DSOValues title={i18n.t('detailsPages.dso.labels.rightAscension')} value={typeof(objectInfos.base.ra) === 'number' ? convertDegreesRaToHMS(objectInfos.base.ra) : prettyRa(objectInfos.base.ra)}/>
              <DSOValues title={i18n.t('detailsPages.dso.labels.declination')} value={typeof(objectInfos.base.dec) === 'number' ? convertDegreesDecToDMS(objectInfos.base.dec) : prettyDec(objectInfos.base.dec)}/>
              <DSOValues title={i18n.t('detailsPages.dso.labels.magnitude')} value={objectInfos.base.v_mag}/>

              {objectInfos.dsoAdditionalInfos && (
                <>
                  <DSOValues title={"Discovered by"} value={objectInfos.dsoAdditionalInfos.discovered_by}/>
                  <DSOValues title={"Discovery year"} value={objectInfos.dsoAdditionalInfos.discovery_year}/>
                  <DSOValues title={"Distance"} value={objectInfos.dsoAdditionalInfos.distance}/>
                  <DSOValues title={"Dimensions"} value={objectInfos.dsoAdditionalInfos.dimensions}/>
                  <DSOValues title={"Apparent size"} value={objectInfos.dsoAdditionalInfos.apparent_size}/>
                  <DSOValues title={"Age"} value={objectInfos.dsoAdditionalInfos.age}/>
                </>
              )}

              {objectInfos.planetAdditionalInfos && (
                <>
                  <DSOValues title={i18n.t('detailsPages.planets.labels.symbol')} value={objectInfos.planetAdditionalInfos.symbol} />
                  <DSOValues title={i18n.t('detailsPages.planets.labels.position')} value={objectInfos.planetAdditionalInfos.solarSystemPosition} />
                  <DSOValues title={i18n.t('detailsPages.planets.labels.inclination')} value={objectInfos.planetAdditionalInfos.inclination} />
                  <DSOValues title={i18n.t('detailsPages.planets.labels.mass')} value={objectInfos.planetAdditionalInfos.mass} />
                  <DSOValues title={i18n.t('detailsPages.planets.labels.orbitalPeriod')} value={objectInfos.planetAdditionalInfos.orbitalPeriod} />
                  <DSOValues title={i18n.t('detailsPages.planets.labels.distanceSun')} value={objectInfos.planetAdditionalInfos.distanceToSun} />
                  <DSOValues title={i18n.t('detailsPages.planets.labels.diameter')} value={objectInfos.planetAdditionalInfos.diameter} />
                  <DSOValues title={i18n.t('detailsPages.planets.labels.short.surfaceTemperature')} value={objectInfos.planetAdditionalInfos.surfaceTemperature} />
                  <DSOValues title={i18n.t('detailsPages.planets.labels.short.naturalSatellites')} value={objectInfos.planetAdditionalInfos.naturalSatellites} />
                </>
              )}

              <View style={{marginTop: 10, paddingTop: 10, borderTopColor: app_colors.white_twenty, borderTopWidth: 1}}>
                <DSOValues chipValue chipColor={objectInfos.visibilityInfos.nakedEye.backgroundColor} chipForegroundColor={objectInfos.visibilityInfos.nakedEye.foregroundColor} title={i18n.t('common.observation.nakedEye')} value={objectInfos.visibilityInfos.nakedEye.label}/>
                <DSOValues chipValue chipColor={objectInfos.visibilityInfos.binoculars.backgroundColor} chipForegroundColor={objectInfos.visibilityInfos.binoculars.foregroundColor} title={i18n.t('common.observation.binoculars')} value={objectInfos.visibilityInfos.binoculars.label}/>
                <DSOValues chipValue chipColor={objectInfos.visibilityInfos.telescope.backgroundColor} chipForegroundColor={objectInfos.visibilityInfos.telescope.foregroundColor} title={i18n.t('common.observation.telescope')} value={objectInfos.visibilityInfos.telescope.label}/>
              </View>
            </View>
          </View>
        )}
      </View>
    );
  }, [objectInfos, currentInfoTab, onCenterObject, isFollowing, onToggleFollow]);

  return (
    <View style={planetariumUIStyles.container}>
      <TouchableOpacity style={[planetariumUIStyles.container.uiButton, planetariumUIStyles.container.buttons.back]} onPress={() => navigation.goBack()}>
        <Image style={[planetariumUIStyles.container.uiButton.icon, {transform: [{ rotate: '90deg' }]}]} source={require('../../../assets/icons/FiChevronDown.png')} />
      </TouchableOpacity>
      <TouchableOpacity style={planetariumUIStyles.container.uiButton} onPress={() => handleShowLayers()}>
        <Image style={planetariumUIStyles.container.uiButton.icon} source={require('../../../assets/icons/FiLayers.png')} />
      </TouchableOpacity>
      <TouchableOpacity style={[planetariumUIStyles.container.uiButton, planetariumUIStyles.container.buttons.search]} onPress={() => handleShowSearch()}>
        <Image style={planetariumUIStyles.container.uiButton.icon} source={require('../../../assets/icons/FiSearch.png')} />
      </TouchableOpacity>
      <TouchableOpacity style={[planetariumUIStyles.container.uiButton, planetariumUIStyles.container.buttons.timeline]} onPress={() => handleShowTimeline()}>
        <Image style={planetariumUIStyles.container.uiButton.icon} source={require('../../../assets/icons/FiClock.png')} />
      </TouchableOpacity>
      {/* {
        objectInfos && (
          <TouchableOpacity style={[planetariumUIStyles.container.uiButton, planetariumUIStyles.container.buttons.followObject]} onPress={() => onToggleFollow()}>
            <Image style={planetariumUIStyles.container.uiButton.icon} source={require('../../../assets/icons/FiCrosshair.png')} />
          </TouchableOpacity>
        )
      } */}

      {
        showSearchBar && (
          <PlanetariumSearchModal
            onClose={() => setShowSearchBar(false)}
            onSelect={(obj) => onSelectObject(obj)}
            navigation={navigation}
          />
        )
      }

      {
        showLayerModal && (
          <View style={planetariumUIStyles.container.layersModal}>
            <TouchableOpacity style={planetariumUIStyles.container.layersModal.button} onPress={() => onShowConstellations()}>
              <Image style={planetariumUIStyles.container.layersModal.button.icon} source={require('../../../assets/icons/FiConstellation.png')} />
              <Text style={planetariumUIStyles.container.layersModal.button.text}>Constel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={planetariumUIStyles.container.layersModal.button} onPress={() => onShowEqGrid()}>
              <Image style={planetariumUIStyles.container.layersModal.button.icon} source={require('../../../assets/icons/FiEqGrid.png')} />
              <Text style={planetariumUIStyles.container.layersModal.button.text}>Grille EQ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={planetariumUIStyles.container.layersModal.button} onPress={() => onShowAzGrid()}>
              <Image style={planetariumUIStyles.container.layersModal.button.icon} source={require('../../../assets/icons/FiAzGrid.png')} />
              <Text style={planetariumUIStyles.container.layersModal.button.text}>Grille AZ</Text>
            </TouchableOpacity>
            <TouchableOpacity style={planetariumUIStyles.container.layersModal.button} onPress={() => onShowPlanets()}>
              <Image style={planetariumUIStyles.container.layersModal.button.icon} source={require('../../../assets/icons/FiPlanet.png')} />
              <Text style={planetariumUIStyles.container.layersModal.button.text}>Planètes</Text>
            </TouchableOpacity>
            <TouchableOpacity style={planetariumUIStyles.container.layersModal.button} onPress={() => onShowDSO()}>
              <Image style={planetariumUIStyles.container.layersModal.button.icon} source={require('../../../assets/icons/astro/DRKN.png')} />
              <Text style={planetariumUIStyles.container.layersModal.button.text}>DSO</Text>
            </TouchableOpacity>
            <TouchableOpacity style={planetariumUIStyles.container.layersModal.button} onPress={() => onShowGround()}>
              <Image style={planetariumUIStyles.container.layersModal.button.icon} source={require('../../../assets/icons/FiMountain.png')} />
              <Text style={planetariumUIStyles.container.layersModal.button.text}>Terrain</Text>
            </TouchableOpacity>
            <TouchableOpacity style={planetariumUIStyles.container.layersModal.button} onPress={() => onShowCompassLabels()}>
              <Image style={planetariumUIStyles.container.layersModal.button.icon} source={require('../../../assets/icons/FiCompass.png')} />
              <Text style={planetariumUIStyles.container.layersModal.button.text}>Boussole</Text>
            </TouchableOpacity>
            {onShowAtmosphere && (
              <TouchableOpacity style={planetariumUIStyles.container.layersModal.button} onPress={() => onShowAtmosphere()}>
                <Image style={planetariumUIStyles.container.layersModal.button.icon} source={require('../../../assets/icons/FiCloud.png')} />
                <Text style={planetariumUIStyles.container.layersModal.button.text}>Atmosphère</Text>
              </TouchableOpacity>
            )}
          </View>
        )
      }

      {
        showTimelineModal && (
          <View pointerEvents="box-none" style={planetariumUIStyles.container.timelineModal}>
            <View pointerEvents="box-only" style={planetariumUIStyles.container.timelineModal.compactCard}>
              <View style={planetariumUIStyles.container.timelineModal.row}>
                <View style={planetariumUIStyles.container.timelineModal.column}>
                  <View style={planetariumUIStyles.container.timelineModal.arrowRow}>
                    {['year', 'month', 'day'].map((unit) => (
                      <TouchableOpacity key={unit} style={planetariumUIStyles.container.timelineModal.chevronButton} onPress={() => adjustTimeline(unit as any, 1)}>
                        <Image style={planetariumUIStyles.container.timelineModal.chevron} source={require('../../../assets/icons/FiChevronUp.png')} />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={planetariumUIStyles.container.timelineModal.value}>{timelineDate.format('YYYY-MM-DD')}</Text>
                  <View style={planetariumUIStyles.container.timelineModal.arrowRow}>
                    {['year', 'month', 'day'].map((unit) => (
                      <TouchableOpacity key={unit} style={planetariumUIStyles.container.timelineModal.chevronButton} onPress={() => adjustTimeline(unit as any, -1)}>
                        <Image style={planetariumUIStyles.container.timelineModal.chevron} source={require('../../../assets/icons/FiChevronDown.png')} />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={planetariumUIStyles.container.timelineModal.centerColumn}>
                  <TouchableOpacity style={planetariumUIStyles.container.timelineModal.iconButton} onPress={() => handleResetTimeline()}>
                    <Image style={planetariumUIStyles.container.timelineModal.centerIcon} source={require('../../../assets/icons/FiRepeat.png')} />
                  </TouchableOpacity>
                  <TouchableOpacity style={planetariumUIStyles.container.timelineModal.iconButton} onPress={() => onToggleTimelinePlay()}>
                    <Image style={planetariumUIStyles.container.timelineModal.centerIcon} source={isTimelinePlaying ? require('../../../assets/icons/FiPause.png') : require('../../../assets/icons/FiPlay.png')} />
                  </TouchableOpacity>
                </View>

                <View style={planetariumUIStyles.container.timelineModal.column}>
                  <View style={planetariumUIStyles.container.timelineModal.arrowRow}>
                    {['hour', 'minute', 'second'].map((unit) => (
                      <TouchableOpacity key={unit} style={planetariumUIStyles.container.timelineModal.chevronButton} onPress={() => adjustTimeline(unit as any, 1)}>
                        <Image style={planetariumUIStyles.container.timelineModal.chevron} source={require('../../../assets/icons/FiChevronUp.png')} />
                      </TouchableOpacity>
                    ))}
                  </View>
                  <Text style={planetariumUIStyles.container.timelineModal.value}>{timelineDate.format('HH:mm:ss')}</Text>
                  <View style={planetariumUIStyles.container.timelineModal.arrowRow}>
                    {['hour', 'minute', 'second'].map((unit) => (
                      <TouchableOpacity key={unit} style={planetariumUIStyles.container.timelineModal.chevronButton} onPress={() => adjustTimeline(unit as any, -1)}>
                        <Image style={planetariumUIStyles.container.timelineModal.chevron} source={require('../../../assets/icons/FiChevronDown.png')} />
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={planetariumUIStyles.container.timelineModal.sliderBlock}>
                <View style={planetariumUIStyles.container.timelineModal.sliderLabels}>
                  <Text style={planetariumUIStyles.container.timelineModal.sliderLabel}>-12h</Text>
                  <Text style={planetariumUIStyles.container.timelineModal.sliderLabel}>+12h</Text>
                </View>
                <View
                  style={planetariumUIStyles.container.timelineModal.sliderTrack}
                  onLayout={handleSliderLayout}
                  {...sliderPanResponder.panHandlers}
                >
                  <View style={[planetariumUIStyles.container.timelineModal.sliderThumb, { left: sliderThumbLeft - 10 }]} />
                </View>
                <Text style={planetariumUIStyles.container.timelineModal.sliderStatus}>{timelinePhaseLabel}</Text>
              </View>
            </View>
          </View>
        )
      }

      {
        !showTimelineModal && (
          <View style={planetariumUIStyles.container.generalInfosBar}>
            <View style={planetariumUIStyles.container.generalInfosBar.header}>
              <Text  style={planetariumUIStyles.container.generalInfosBar.header.location}>{currentUserLocation.common_name}</Text>
              <Text style={planetariumUIStyles.container.generalInfosBar.header.clock}>{currentTime}</Text>
              <Text  style={planetariumUIStyles.container.generalInfosBar.header.location}>{isNightTime ? "(Nuit)" : "(Journée)"}</Text>
            </View>
            {objectInfos && objectInfoContent}
          </View>
        )
      }
    </View>
  );
}
