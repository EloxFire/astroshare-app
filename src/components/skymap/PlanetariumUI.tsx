import React, {useEffect, useMemo, useRef, useState} from "react";
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
  onShowConstellationLabels: () => void;
  onShowAzGrid: () => void;
  onShowGround: () => void;
  onShowPlanets: () => void;
  onShowDSO: () => void;
  onShowCompassLabels: () => void;
  onCenterObject: () => void;
  onSelectObject: (obj: DSO | GlobalPlanet | Star) => void;
  onSelectFromSearch: (obj: DSO | GlobalPlanet | Star) => void;
  onShowAtmosphere?: () => void;
  onShowStarLabels?: () => void;
  onShowSolarSystemLabels?: () => void;
  onToggleFocusedConstellation?: () => void;
  isFocusedConstellationOn?: boolean;
  isFollowing: boolean;
  onToggleFollow: () => void;
  timelineDate: Dayjs;
  onSeekTimeline: (date: Dayjs) => void;
  onAdjustTimeline: (unit: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year', delta: number) => void;
  onChangeTimelineDate: (next: Dayjs) => void;
  onResetTimelineDate: () => void;
  onToggleTimelinePlay: () => void;
  isTimelinePlaying: boolean;
}

export default function PlanetariumUI({ navigation, infos, onShowGround, onShowConstellations, onShowConstellationLabels, onShowAzGrid, onShowEqGrid, onShowDSO, onShowPlanets, onShowCompassLabels, onCenterObject, onSelectObject, onSelectFromSearch, onShowAtmosphere, onShowStarLabels, onShowSolarSystemLabels, onToggleFocusedConstellation, isFocusedConstellationOn = true, isFollowing, onToggleFollow, timelineDate, onSeekTimeline, onAdjustTimeline, onChangeTimelineDate, onResetTimelineDate, onToggleTimelinePlay, isTimelinePlaying }: PlanetariumUIProps) {

  const {currentUserLocation} = useSettings();
  const {currentLocale} = useTranslation();
  const [currentTime, setCurrentTime] = useState<string>(timelineDate.format('HH:mm'));
  const [isNightTime, setIsNightTime] = useState<boolean>(false);
  const displayAnchorRef = useRef<Dayjs>(timelineDate);
  const wallClockAnchorRef = useRef<number>(Date.now());
  const clockRafRef = useRef<number | null>(null);
  const lastClockStringRef = useRef<string>(currentTime);
  const lastIsNightRef = useRef<boolean>(false);
  const [sliderWidth, setSliderWidth] = useState<number>(0);
  const sliderWidthRef = useRef<number>(0);
  const sliderDayRef = useRef<Dayjs>(timelineDate.startOf('day'));
  const [sliderRatio, setSliderRatio] = useState<number>(0);
  const sliderRatioRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const dragStartRatioRef = useRef<number>(0);

  const [showLayerModal, setShowLayerModal] = useState<boolean>(false);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [showTimelineModal, setShowTimelineModal] = useState<boolean>(false);

  const [objectInfos, setObjectInfos] = useState<ComputedObjectInfos | null>(null);
  const [currentInfoTab, setCurrentInfoTab] = useState<number>(0);
  const lastObjectKeyRef = useRef<string | null>(null);

  useEffect(() => {
    displayAnchorRef.current = timelineDate;
    wallClockAnchorRef.current = Date.now();
    const initialClock = timelineDate.format('HH:mm');
    lastClockStringRef.current = initialClock;
    setCurrentTime(initialClock);
    const nightFlag = isNight(timelineDate.toDate(), {latitude: currentUserLocation.lat, longitude: currentUserLocation.lon});
    lastIsNightRef.current = nightFlag;
    setIsNightTime(nightFlag);
  }, [timelineDate, currentUserLocation]);

  useEffect(() => {
    if (clockRafRef.current !== null) {
      cancelAnimationFrame(clockRafRef.current);
      clockRafRef.current = null;
    }

    if (!isTimelinePlaying) {
      return;
    }

    const tick = () => {
      const elapsedMs = Date.now() - wallClockAnchorRef.current;
      const displayDate = displayAnchorRef.current.add(elapsedMs, 'millisecond');
      const nextClock = displayDate.format('HH:mm');
      if (nextClock !== lastClockStringRef.current) {
        lastClockStringRef.current = nextClock;
        setCurrentTime(nextClock);

        const nightFlag = isNight(displayDate.toDate(), { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon });
        if (nightFlag !== lastIsNightRef.current) {
          lastIsNightRef.current = nightFlag;
          setIsNightTime(nightFlag);
        }
      }

      clockRafRef.current = requestAnimationFrame(tick);
    };

    clockRafRef.current = requestAnimationFrame(tick);

    return () => {
      if (clockRafRef.current !== null) {
        cancelAnimationFrame(clockRafRef.current);
        clockRafRef.current = null;
      }
    };
  }, [currentUserLocation, isTimelinePlaying]);

  // Keep sliderDayRef in sync with the calendar date (not the time).
  useEffect(() => {
    sliderDayRef.current = timelineDate.startOf('day');
  }, [timelineDate]);

  // Sync thumb position from parent when not dragging.
  useEffect(() => {
    if (isDraggingRef.current) return;
    const mins = timelineDate.diff(timelineDate.startOf('day'), 'minute');
    const r = Math.min(Math.max(mins / (24 * 60), 0), 1);
    sliderRatioRef.current = r;
    setSliderRatio(r);
  }, [timelineDate]);

  const observer = useMemo(() => {
    if (!currentUserLocation) return null;
    return { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon };
  }, [currentUserLocation]);

  // Recompute sun times once per day, not every second.
  const dateDayStr = timelineDate.format('YYYY-MM-DD');
  const sunTimes = useMemo(() => {
    if (!observer) return { sunrise: null as Dayjs | null, sunset: null as Dayjs | null };
    const sunData = getSunData(timelineDate, observer);
    return { sunrise: sunData.visibility.sunrise, sunset: sunData.visibility.sunset };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observer, dateDayStr]);

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
    setShowTimelineModal(!showTimelineModal);
    setShowSearchBar(false);
    setShowLayerModal(false);
  }

  const adjustTimeline = (unit: 'second' | 'minute' | 'hour' | 'day' | 'month' | 'year', delta: number) => {
    onAdjustTimeline(unit, delta);
  };

  const handleResetTimeline = () => {
    onResetTimelineDate();
  };

  const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

  const handleSliderLayout = (event: LayoutChangeEvent) => {
    const w = event.nativeEvent.layout.width;
    setSliderWidth(w);
    sliderWidthRef.current = w;
  };

  // PanResponder: updates local thumb state + calls onSeekTimeline (ref write only,
  // no parent state update). onChangeTimelineDate fires once on release.
  const sliderPanResponder = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: (evt) => {
      const w = sliderWidthRef.current;
      if (!w) return;
      isDraggingRef.current = true;
      const ratio = Math.min(Math.max(evt.nativeEvent.locationX / w, 0), 1);
      dragStartRatioRef.current = ratio;
      sliderRatioRef.current = ratio;
      setSliderRatio(ratio);
      const date = sliderDayRef.current.add(ratio * 24 * 60, 'minute');
      displayAnchorRef.current = date;
      wallClockAnchorRef.current = Date.now();
      onSeekTimeline(date);
    },
    onPanResponderMove: (_evt, gestureState) => {
      const w = sliderWidthRef.current;
      if (!w) return;
      // gestureState.dx = cumulative displacement since grant — reliable regardless
      // of which child element the finger is currently over.
      const ratio = Math.min(Math.max(dragStartRatioRef.current + gestureState.dx / w, 0), 1);
      sliderRatioRef.current = ratio;
      setSliderRatio(ratio);
      const date = sliderDayRef.current.add(ratio * 24 * 60, 'minute');
      displayAnchorRef.current = date;
      wallClockAnchorRef.current = Date.now();
      onSeekTimeline(date);
    },
    onPanResponderRelease: () => {
      isDraggingRef.current = false;
      const date = sliderDayRef.current.add(sliderRatioRef.current * 24 * 60, 'minute');
      onChangeTimelineDate(date);
    },
  }), [onSeekTimeline, onChangeTimelineDate]);

  const timelinePhaseLabel = useMemo(() => {
    const { sunrise, sunset } = sunTimes;
    if (sunrise && timelineDate.isBefore(sunrise.add(40, 'minute'))) return 'Dawn';
    if (sunrise && sunset && timelineDate.isAfter(sunrise) && timelineDate.isBefore(sunset)) {
      if (timelineDate.isAfter(sunset.subtract(40, 'minute'))) return 'Dusk';
      return 'Daylight';
    }
    return 'Night';
  }, [sunTimes, timelineDate]);

  // Gradient only recomputes when the day changes (sunTimes changes once per day).
  const timelineGradient = useMemo(() => {
    const nightColor = '#070d1a';
    const twilightColor = '#1e4080';
    const dayColor = '#ffffff';
    const { sunrise, sunset } = sunTimes;

    if (!sunrise || !sunset) {
      return { colors: [nightColor, nightColor] as string[], locations: [0, 1] as number[] };
    }

    const dayStart = sunrise.startOf('day');
    const totalMinutes = 24 * 60;
    const tw = 0.03;
    const srPos = Math.min(Math.max(sunrise.diff(dayStart, 'minute') / totalMinutes, 0), 1);
    const ssPos = Math.min(Math.max(sunset.diff(dayStart, 'minute') / totalMinutes, 0), 1);

    return {
      colors: [nightColor, twilightColor, dayColor, dayColor, twilightColor, nightColor] as string[],
      locations: [
        0,
        Math.min(Math.max(srPos - tw, 0), 1),
        Math.min(Math.max(srPos + tw, 0), 1),
        Math.min(Math.max(ssPos - tw, 0), 1),
        Math.min(Math.max(ssPos + tw, 0), 1),
        1,
      ] as number[],
    };
  }, [sunTimes]);

  const sliderThumbLeft = sliderWidth ? sliderRatio * sliderWidth : 0;

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
              <View style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start', maxWidth: '60%'}}>
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
      {
        objectInfos && (
          <TouchableOpacity style={[planetariumUIStyles.container.uiButton, planetariumUIStyles.container.buttons.followObject]} onPress={() => onToggleFollow()}>
            <Image style={planetariumUIStyles.container.uiButton.icon} source={require('../../../assets/icons/FiCrosshair.png')} />
          </TouchableOpacity>
        )
      }

      {
        showSearchBar && (
          <PlanetariumSearchModal
            onClose={() => setShowSearchBar(false)}
            onSelect={(obj) => onSelectFromSearch(obj)}
            navigation={navigation}
            timelineDate={timelineDate}
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
            <TouchableOpacity style={planetariumUIStyles.container.layersModal.button} onPress={() => onShowConstellationLabels()}>
              <Image style={planetariumUIStyles.container.layersModal.button.icon} source={require('../../../assets/icons/FiFileText.png')} />
              <Text style={planetariumUIStyles.container.layersModal.button.text}>Labels</Text>
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
            {onShowStarLabels && (
              <TouchableOpacity style={planetariumUIStyles.container.layersModal.button} onPress={() => onShowStarLabels()}>
                <Image style={planetariumUIStyles.container.layersModal.button.icon} source={require('../../../assets/icons/FiStar.png')} />
                <Text style={planetariumUIStyles.container.layersModal.button.text}>Noms étoiles</Text>
              </TouchableOpacity>
            )}
            {onShowSolarSystemLabels && (
              <TouchableOpacity style={planetariumUIStyles.container.layersModal.button} onPress={() => onShowSolarSystemLabels()}>
                <Image style={planetariumUIStyles.container.layersModal.button.icon} source={require('../../../assets/icons/FiPlanet.png')} />
                <Text style={planetariumUIStyles.container.layersModal.button.text}>Noms planètes</Text>
              </TouchableOpacity>
            )}
            {onToggleFocusedConstellation && (
              <TouchableOpacity style={planetariumUIStyles.container.layersModal.button} onPress={() => onToggleFocusedConstellation()}>
                <Image
                  style={[
                    planetariumUIStyles.container.layersModal.button.icon,
                    { tintColor: isFocusedConstellationOn ? app_colors.white : app_colors.white_twenty },
                  ]}
                  source={require('../../../assets/icons/FiViewPoint.png')}
                />
                <Text style={[
                  planetariumUIStyles.container.layersModal.button.text,
                  { color: isFocusedConstellationOn ? app_colors.white_sixty : app_colors.white_twenty },
                ]}>
                  Visée auto
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )
      }

      {
        showTimelineModal && (
          <View pointerEvents="box-none" style={planetariumUIStyles.container.timelineModal}>
            <View style={planetariumUIStyles.container.timelineModal.compactCard}>
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
                  <Text style={planetariumUIStyles.container.timelineModal.sliderLabel}>00:00</Text>
                  <Text style={planetariumUIStyles.container.timelineModal.sliderLabel}>12:00</Text>
                  <Text style={planetariumUIStyles.container.timelineModal.sliderLabel}>23:59</Text>
                </View>
                {/*
                  Hit area: 36px tall for easy touch, NO overflow:hidden so the
                  thumb is never clipped. Only the inner gradient strip clips.
                */}
                <View
                  style={{ width: '100%', height: 36, justifyContent: 'center' }}
                  onLayout={handleSliderLayout}
                  {...sliderPanResponder.panHandlers}
                >
                  {/* Gradient track — overflow:hidden only here for rounded corners */}
                  <View style={{ height: 8, borderRadius: 10, overflow: 'hidden' }}>
                    <LinearGradient
                      style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                      colors={timelineGradient.colors as any}
                      locations={timelineGradient.locations as any}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                    />
                    {sunTimes.sunrise && sliderWidth > 0 && (
                      <View style={{
                        position: 'absolute',
                        left: clamp(sunTimes.sunrise.diff(timelineDate.startOf('day'), 'minute') / (24 * 60), 0, 1) * sliderWidth - 1,
                        top: 0, bottom: 0, width: 2,
                        backgroundColor: 'rgba(255, 190, 60, 0.9)',
                      }} />
                    )}
                    {sunTimes.sunset && sliderWidth > 0 && (
                      <View style={{
                        position: 'absolute',
                        left: clamp(sunTimes.sunset.diff(timelineDate.startOf('day'), 'minute') / (24 * 60), 0, 1) * sliderWidth - 1,
                        top: 0, bottom: 0, width: 2,
                        backgroundColor: 'rgba(255, 110, 30, 0.9)',
                      }} />
                    )}
                  </View>
                  {/* Thumb lives outside the clipped track so it's never cut off */}
                  <View style={[
                    planetariumUIStyles.container.timelineModal.sliderThumb,
                    { left: sliderThumbLeft - 10, top: 8, borderWidth: 2, borderColor: app_colors.white },
                  ]} />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 2 }}>
                  <Text style={planetariumUIStyles.container.timelineModal.sliderLabel}>
                    {sunTimes.sunrise ? `↑ ${sunTimes.sunrise.format('HH:mm')}` : ''}
                  </Text>
                  <Text style={planetariumUIStyles.container.timelineModal.sliderStatus}>{timelinePhaseLabel}</Text>
                  <Text style={planetariumUIStyles.container.timelineModal.sliderLabel}>
                    {sunTimes.sunset ? `↓ ${sunTimes.sunset.format('HH:mm')}` : ''}
                  </Text>
                </View>
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
