import React, { useEffect, useMemo, useState } from "react";
import {globalStyles} from "../../styles/global";
import PageTitle from "../../components/commons/PageTitle";
import {Image, ImageBackground, ImageSourcePropType, ScrollView, Text, TextInput, TouchableOpacity, View} from "react-native";
import {i18n} from "../../helpers/scripts/i18n";
import {celestialBodiesOverviewStyles} from "../../styles/screens/celestialBodies/celestialBodies";
import {getObjectIcon} from "../../helpers/scripts/astro/objects/getObjectIcon";
import {getObjectName} from "../../helpers/scripts/astro/objects/getObjectName";
import {getObjectType} from "../../helpers/scripts/astro/objects/getObjectType";
import SimpleBadge from "../../components/badges/SimpleBadge";
import {computeObject} from "../../helpers/scripts/astro/objects/computeObject";
import {useSettings} from "../../contexts/AppSettingsContext";
import {ComputedObjectInfos} from "../../helpers/types/objects/ComputedObjectInfos";
import {astroImages, constellationsImages, planetsImages} from "../../helpers/scripts/loadImages";
import {app_colors, storageKeys} from "../../helpers/constants";
import {getObjectFamily} from "../../helpers/scripts/astro/objects/getObjectFamily";
import DSOValues from "../../components/commons/DSOValues";
import SimpleButton from "../../components/commons/buttons/SimpleButton";
import {prettyRa} from "../../helpers/scripts/astro/prettyCoords";
import {convertDegreesRaToHMS} from "../../helpers/scripts/astro/coords/convertDegreesRaToHMS";
import {convertDegreesDecToDMS} from "../../helpers/scripts/astro/coords/convertDegreesDecToDms";
import VisibilityGraph from "../../components/graphs/VisibilityGraph";
import {useTranslation} from "../../hooks/useTranslation";
import {getConstellation} from "@observerly/astrometry";
import {getObject, storeObject} from "../../helpers/storage";
import {GlobalPlanet} from "../../helpers/types/GlobalPlanet";
import {DSO} from "../../helpers/types/DSO";
import {Star} from "../../helpers/types/Star";
import {routes} from "../../helpers/routes";
import dayjs from "dayjs";
import {makeCalendarMapping} from "../../helpers/scripts/i18n/dayjsCalendarTimeCustom";
import { useAuth } from "../../contexts/AuthContext";
import { sendAnalyticsEvent } from "../../helpers/scripts/analytics";
import { eventTypes } from "../../helpers/constants/analytics";
import { showToast } from "../../helpers/scripts/showToast";
import { scheduleLocalNotification, unScheduleNotification } from "../../helpers/scripts/notifications/scheduleLocalNotification";
import { isLocalNotificationPlanned, deleteLocalNotificationRecord } from "../../helpers/scripts/notifications/checkPlannedLocalNOtifications";
import { getData, storeData } from "../../helpers/storage";
import ConstellationObjectMap from "../../components/maps/ConstellationObjectMap";
import { LinearGradient } from "expo-linear-gradient";

type ObservationFlags = {
  observed: boolean;
  photographed: boolean;
  sketched: boolean;
};

export default function CelestialBodyOverview({ route, navigation }: any) {

  const {currentUser} = useAuth()
  const {currentLocale} = useTranslation()
  const {currentUserLocation} = useSettings()

  const { object } = route.params;

  const [objectInfos, setObjectInfos] = useState<ComputedObjectInfos | null>(null);
  const [isNotificationPlanned, setIsNotificationPlanned] = useState<boolean>(false);
  const [favouritePlanets, setFavouritePlanets] = useState<GlobalPlanet[]>([]);
  const [favouriteDSO, setFavouriteDSO] = useState<DSO[]>([]);
  const [favouriteStars, setFavouriteStars] = useState<Star[]>([]);
  const [personalNotes, setPersonalNotes] = useState<string>('');
  const [observationFlags, setObservationFlags] = useState<ObservationFlags>({
    observed: false,
    photographed: false,
    sketched: false,
  });

  const notesStorageKey = useMemo(() => {
    const identifier = object?.ids || object?.name || getObjectName(object, 'all', true);
    const safeIdentifier = `${identifier}`.replace(/[^a-zA-Z0-9_-]/g, '_');
    return `notes_${getObjectFamily(object).toLowerCase()}_${safeIdentifier}`;
  }, [object]);

  const objectConstellationAbbr = useMemo(() => {
    if (getObjectFamily(object) === 'DSO' && object.const) {
      return object.const;
    }

    if (objectInfos?.base?.degRa && objectInfos?.base?.degDec) {
      return getConstellation({ ra: objectInfos.base.degRa, dec: objectInfos.base.degDec })?.abbreviation;
    }

    return undefined;
  }, [object, objectInfos]);

  useEffect(() => {
    const observer = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }
    const computedObject = computeObject({ object, observer, lang: currentLocale, altitude: 341 });
    console.log(JSON.stringify(computedObject?.visibilityInfos));
    
    setObjectInfos(computedObject);
  }, [])

  useEffect(() => {
    if (!objectInfos) return;
    sendAnalyticsEvent(currentUser, currentUserLocation, 'view_celestial_body_overview', eventTypes.SCREEN_VIEW, { objectName: getObjectName(object, 'all', true), objectType: getObjectType(object) }, currentLocale)
  }, [objectInfos])


  useEffect(() => {
    (async () => {
      const favsPlanets = await getObject(storageKeys.favouritePlanets)
      const favsDSO = await getObject(storageKeys.favouriteObjects)
      const favsStars = await getObject(storageKeys.favouriteStars)

      if(favsPlanets) setFavouritePlanets(favsPlanets)
      if(favsDSO) setFavouriteDSO(favsDSO)
      if(favsStars) setFavouriteStars(favsStars)
    })()
  }, [])

  useEffect(() => {
    (async () => {
      const savedNotes = await getObject(notesStorageKey);
      if(savedNotes){
        setPersonalNotes(savedNotes.notes || '');
        setObservationFlags({
          observed: !!(savedNotes.flags?.observed ?? savedNotes.observed),
          photographed: !!(savedNotes.flags?.photographed ?? savedNotes.photographed),
          sketched: !!(savedNotes.flags?.sketched ?? savedNotes.sketched),
        });
      }else{
        setPersonalNotes('');
        setObservationFlags({
          observed: false,
          photographed: false,
          sketched: false,
        });
      }
    })()
  }, [notesStorageKey])

  const getNotificationStorageKey = () => {
    const identifier = object?.ids || object?.name || getObjectName(object, 'all', true);
    const safeIdentifier = `${identifier}`.replace(/[^a-zA-Z0-9_-]/g, '_');
    return `notification_visibility_${getObjectFamily(object).toLowerCase()}_${safeIdentifier}`;
  }

  const checkNotification = async () => {
    const planned = await isLocalNotificationPlanned(getNotificationStorageKey());
    console.log(planned);
    
    setIsNotificationPlanned(planned);
  }

  useEffect(() => {
    checkNotification();
  }, [object]);

  const checkIsFav = () => {
    switch (getObjectFamily(object)) {
      case 'Planet':
        return favouritePlanets.find(planet => planet.name === object.name)
      case 'DSO':
        return favouriteDSO.find(dso => dso.name === object.name)
      case 'Star':
        return favouriteStars.find(star => star.ids === object.ids)
    }
  }

  const updateFavLists = async (newList: GlobalPlanet[] | DSO[] | Star[], type: string) => {
    switch (type) {
      case 'Planet':
        await storeObject(storageKeys.favouritePlanets, newList)
        break;
      case 'DSO':
        await storeObject(storageKeys.favouriteObjects, newList)
        break;
      case 'Star':
        await storeObject(storageKeys.favouriteStars, newList)
        break;
    }
  }

  const handleFavorite = async () => {
    const wasFav = !!checkIsFav()

    switch (getObjectFamily(object)) {
      case 'Planet':
        if(favouritePlanets.find(planet => planet.name === object.name)){
          const newList = favouritePlanets.filter(planet => planet.name !== object.name)
          setFavouritePlanets(newList)
          await updateFavLists(newList, 'Planet')
        }else{
          setFavouritePlanets([...favouritePlanets, object])
          await updateFavLists([...favouritePlanets, object], 'Planet')
        }
        break;
      case 'DSO':
        if(favouriteDSO.find(dso => dso.name === object.name)){
          const newList = favouriteDSO.filter(dso => dso.name !== object.name)
          setFavouriteDSO(newList)
          await updateFavLists(newList, 'DSO')
        }else{
          setFavouriteDSO([...favouriteDSO, object])
          await updateFavLists([...favouriteDSO, object], 'DSO')
        }
        break;
      case 'Star':
        if(favouriteStars.find(star => star.ids === object.ids)){
          const newList = favouriteStars.filter(star => star.ids !== object.ids)
          setFavouriteStars(newList)
          await updateFavLists(newList, 'Star')
        }else{
          setFavouriteStars([...favouriteStars, object])
          await updateFavLists([...favouriteStars, object], 'Star')
        }
        break;
    }
    sendAnalyticsEvent(currentUser, currentUserLocation, wasFav ? 'remove_favorite' : 'add_favorite', eventTypes.BUTTON_CLICK, { objectName: getObjectName(object, 'all', true), objectType: getObjectType(object) }, currentLocale)
  }

  const handleLocalNotification = async () => {
    if(!objectInfos) {
      showToast({message: i18n.t('common.errors.unknown'), type: 'error'})
      return
    }

    const notificationKey = getNotificationStorageKey();
    const objectName = getObjectName(object, 'all', true);

    if(isNotificationPlanned){
      const notificationId = await getData(notificationKey);
      if(notificationId){
        await unScheduleNotification(notificationId);
      }
      await deleteLocalNotificationRecord(notificationKey);
      setIsNotificationPlanned(false);
      showToast({message: i18n.t('notifications.successRemove'), type: 'success', duration: 4000});
      sendAnalyticsEvent(currentUser, currentUserLocation, 'Visibility notification removed', eventTypes.BUTTON_CLICK, { objectName, objectType: getObjectType(object) }, currentLocale);
      return;
    }

    const nextVisibility = objectInfos.visibilityInfos.objectNextRise;
    if(!nextVisibility || nextVisibility.isBefore(dayjs())){
      showToast({message: i18n.t('notifications.objectVisibility.noNext'), type: 'error'});
      return;
    }

    const notif = await scheduleLocalNotification({
      title: i18n.t('notifications.objectVisibility.title', { object_name: objectName }),
      body: i18n.t('notifications.objectVisibility.body', { object_name: objectName }),
      data: { object, type: getObjectFamily(object) },
      date: nextVisibility.toDate(),
    });

    if(notif){
      setIsNotificationPlanned(true);
      await storeData(notificationKey, notif);
      showToast({message: i18n.t('notifications.successSchedule'), type: 'success', duration: 4000});
      sendAnalyticsEvent(currentUser, currentUserLocation, 'Visibility notification scheduled', eventTypes.BUTTON_CLICK, { objectName, objectType: getObjectType(object), visibilityDate: nextVisibility.toISOString() }, currentLocale);
    }
  }

  const persistNotes = (nextNotes: string, nextFlags: ObservationFlags) => {
    storeObject(notesStorageKey, {
      objectId: object?.ids || object?.name || getObjectName(object, 'all', true),
      objectName: getObjectName(object, 'all', true),
      objectType: getObjectFamily(object),
      notes: nextNotes,
      flags: nextFlags,
      updatedAt: dayjs().toISOString(),
    });
  }

  const handleNotesChange = (text: string) => {
    setPersonalNotes(text);
    persistNotes(text, observationFlags);
  }

  const handleToggleFlag = (flag: keyof ObservationFlags) => {
    const nextFlags = { ...observationFlags, [flag]: !observationFlags[flag] };
    setObservationFlags(nextFlags);
    persistNotes(personalNotes, nextFlags);
  }

  const renderFlagButton = (flag: keyof ObservationFlags, label: string, icon: ImageSourcePropType) => {
    const isActive = observationFlags[flag];

    return (
      <SimpleButton
        active={isActive}
        onPress={() => handleToggleFlag(flag)}
        icon={icon}
        iconColor={isActive ? app_colors.black : app_colors.white_sixty}
        text={label}
        textColor={isActive ? app_colors.black : app_colors.white_sixty}
        backgroundColor={isActive ? app_colors.white : app_colors.white_twenty}
      />
    )
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('detailsPages.dso.title')}
        subtitle={i18n.t('detailsPages.dso.subtitle')}
        // backRoute={routes.home.path}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView style={celestialBodiesOverviewStyles.content} contentContainerStyle={{gap: 10}}>
        <View style={celestialBodiesOverviewStyles.content.header}>
          <View style={{position: 'absolute', top: 10, right: 10, zIndex: 10}}>
            <SimpleButton
              iconColor={checkIsFav() ? app_colors.red : app_colors.white}
              icon={checkIsFav() ? require('../../../assets/icons/FiHeartFill.png') : require('../../../assets/icons/FiHeart.png')}
              onPress={() => handleFavorite()}
            />
          </View>
          <View>
            <Image source={getObjectIcon(object)} style={celestialBodiesOverviewStyles.content.header.icon} />
          </View>
          <View style={celestialBodiesOverviewStyles.content.header.infos}>
            <View>
              <Text style={celestialBodiesOverviewStyles.content.header.infos.title}>{getObjectName(object, 'all', true)}</Text>
              {objectInfos && <Text style={celestialBodiesOverviewStyles.content.header.infos.subtitle}>{objectInfos.base.otherName !== "" ? objectInfos.base.otherName : getObjectType(object)}</Text>}
            </View>
            {
            objectInfos && (
              <View style={celestialBodiesOverviewStyles.content.header.infos.badges}>
                <SimpleBadge
                  text={objectInfos.visibilityInfos.visibilityLabel}
                  icon={objectInfos.visibilityInfos.visibilityIcon}
                  backgroundColor={objectInfos.visibilityInfos.visibilityBackgroundColor}
                  foregroundColor={objectInfos.visibilityInfos.visibilityForegroundColor}
                />
                {
                  getObjectFamily(object) === 'DSO' && object.m !== "" && (
                    <>
                      <SimpleBadge
                        text={object.name}
                      />
                      <SimpleBadge
                        text={object.const}
                        icon={astroImages['CONSTELLATION']}
                        iconColor={app_colors.white}
                      />
                    </>

                  )
                }
                <SimpleBadge
                  text={objectInfos.base.family}
                />
                {
                  getObjectFamily(object) !== 'DSO' && objectInfos && (
                    <>
                      <SimpleBadge
                        text={objectInfos.base.alt}
                        icon={require('../../../assets/icons/FiAngleRight.png')}
                      />
                      <SimpleBadge
                        text={objectInfos.base.az}
                        icon={require('../../../assets/icons/FiCompass.png')}
                      />
                    </>

                  )
                }
              </View>
              )
            }
          </View>
        </View>


        <View style={celestialBodiesOverviewStyles.content.positionContainer}>
          <Text style={celestialBodiesOverviewStyles.content.sectionTitle}>Informations générales</Text>

          <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
            <View style={{width: getObjectFamily(object) === 'Planet' ? '100%' : '100%', paddingTop: 10, display: 'flex', flexDirection: "column", justifyContent: 'space-between'}}>
              <View>
                <DSOValues title={i18n.t('detailsPages.dso.labels.type')} value={getObjectType(object)} />
                <DSOValues title={i18n.t('detailsPages.dso.labels.constellation')} value={objectInfos?.base.constellation} />
                <DSOValues title={i18n.t('detailsPages.dso.labels.rightAscension')} value={typeof(object.ra) === 'number' ? convertDegreesRaToHMS(object.ra) : prettyRa(object.ra)} />
                <DSOValues title={i18n.t('detailsPages.dso.labels.declination')} value={typeof(object.dec) === 'number' ? convertDegreesDecToDMS(object.dec) : prettyRa(object.dec)} />

                {
                  getObjectFamily(object) === 'Planet' && objectInfos?.planetAdditionalInfos && (
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
                  )
                }
              </View>
            </View>
          </View>
        </View>

        <View style={[celestialBodiesOverviewStyles.content.visibilityContainer, {marginBottom: getObjectFamily(object) === 'Planet' ? 50 : 0 }]}>
          <Text style={celestialBodiesOverviewStyles.content.sectionTitle}>Visibilité</Text>
          <View style={{paddingTop: 10}}>
            {
              objectInfos && (
                <>
                  <DSOValues chipValue chipColor={objectInfos.visibilityInfos.nakedEye.backgroundColor} chipForegroundColor={objectInfos.visibilityInfos.nakedEye.foregroundColor} title={i18n.t('common.observation.nakedEye')} value={objectInfos.visibilityInfos.nakedEye.label}/>
                  <DSOValues chipValue chipColor={objectInfos.visibilityInfos.binoculars.backgroundColor} chipForegroundColor={objectInfos.visibilityInfos.binoculars.foregroundColor} title={i18n.t('common.observation.binoculars')} value={objectInfos.visibilityInfos.binoculars.label}/>
                  <DSOValues chipValue chipColor={objectInfos.visibilityInfos.telescope.backgroundColor} chipForegroundColor={objectInfos.visibilityInfos.telescope.foregroundColor} title={i18n.t('common.observation.telescope')} value={objectInfos.visibilityInfos.telescope.label}/>
                </>
              )
            }
            {
              objectInfos && !objectInfos?.visibilityInfos.isCurrentlyVisible && objectInfos.visibilityInfos.isVisibleThisNight && (
                <View style={{marginTop: 10}}>
                  <SimpleButton
                    text={isNotificationPlanned ? i18n.t('notifications.objectVisibility.remove') : i18n.t('notifications.objectVisibility.schedule')}
                    fullWidth
                    backgroundColor={app_colors.white}
                    icon={isNotificationPlanned ? require('../../../assets/icons/FiBellOff.png') : require('../../../assets/icons/FiBell.png')}
                    iconColor={isNotificationPlanned ? app_colors.black : app_colors.black}
                    textColor={app_colors.black}
                    small
                    align="center"
                    onPress={() => handleLocalNotification()}
                  />
                </View>
              )
            }
            <Text style={[celestialBodiesOverviewStyles.content.sectionTitle, {marginTop: 15}]}>Magnitude</Text>
            <View style={{marginTop: 10}}>
              { objectInfos?.base.v_mag && <DSOValues title={i18n.t('detailsPages.dso.labels.vMag')} value={objectInfos?.base.v_mag} chipValue />}
              { objectInfos?.base.b_mag && <DSOValues title={i18n.t('detailsPages.dso.labels.bMag')} value={objectInfos?.base.b_mag} chipValue />}
              { objectInfos?.base.j_mag && <DSOValues title={i18n.t('detailsPages.dso.labels.jMag')} value={objectInfos?.base.j_mag} chipValue />}
              { objectInfos?.base.h_mag && <DSOValues title={i18n.t('detailsPages.dso.labels.hMag')} value={objectInfos?.base.h_mag} chipValue />}
              { objectInfos?.base.k_mag && <DSOValues title={i18n.t('detailsPages.dso.labels.kMag')} value={objectInfos?.base.k_mag} chipValue />}
            </View>
            <View style={{marginTop: 10}}>
              <Text style={celestialBodiesOverviewStyles.content.sectionTitle}>Lever et coucher</Text>
              {
                objectInfos?.visibilityInfos.isCircumpolar ? (
                  <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10}}>
                    <Image source={require('../../../assets/icons/FiSunrise.png')} style={{width: 24, height: 24}}/>
                    <Text style={celestialBodiesOverviewStyles.content.text}>{
                      objectInfos?.visibilityInfos.isCurrentlyVisible ? i18n.t('common.visibility.alwaysVisible') : objectInfos?.visibilityInfos.objectNextRise?.locale(currentLocale).calendar(dayjs(), makeCalendarMapping())
                    }</Text>
                  </View>
                ) : (
                  <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 30}}>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10}}>
                      <Image source={require('../../../assets/icons/FiSunrise.png')} style={{width: 24, height: 24}}/>
                      <Text style={celestialBodiesOverviewStyles.content.text}>{
                        objectInfos?.visibilityInfos.isCurrentlyVisible ? i18n.t('common.visibility.alreadyUp') : objectInfos?.visibilityInfos.objectNextRise?.locale(currentLocale).calendar(dayjs(), makeCalendarMapping())
                      }</Text>
                    </View>
                    <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 10}}>
                      <Image source={require('../../../assets/icons/FiSunset.png')} style={{width: 24, height: 24}}/>
                      <Text style={celestialBodiesOverviewStyles.content.text}>{
                        !objectInfos?.visibilityInfos.isCurrentlyVisible ? i18n.t('common.visibility.alreadyDown') : objectInfos?.visibilityInfos.objectNextSet?.locale(currentLocale).calendar(dayjs() , makeCalendarMapping())
                      }</Text>
                    </View>
                  </View>
                )
              }
            </View>
            <Text style={[celestialBodiesOverviewStyles.content.sectionTitle, {marginTop: 15, marginBottom: -10}]}>Altitude de l'objet</Text>
            <VisibilityGraph
              visibilityGraph={{altitudes: objectInfos?.visibilityInfos.visibilityGraph.altitudes || [], hours: objectInfos?.visibilityInfos.visibilityGraph.hours || []}}
            />
          </View>
        </View>

        <View style={[celestialBodiesOverviewStyles.content.visibilityContainer, {marginBottom: getObjectFamily(object) === 'Planet' ? 50 : 0 }]}>
          <Text style={celestialBodiesOverviewStyles.content.sectionTitle}>Position</Text>
          <View style={{paddingTop: 10}}>
            {
              objectInfos ? (
                <ConstellationObjectMap
                  ra={objectInfos.base.degRa}
                  dec={objectInfos.base.degDec}
                  objectName={getObjectName(object, 'all', true)}
                  constellationAbbreviation={objectConstellationAbbr}
                />
              ) : (
                <Text style={celestialBodiesOverviewStyles.content.text}>Chargement de la carte...</Text>
              )
            }
          </View>
          <View>
            {
              objectInfos && (
                <View style={{marginTop: 10}}>
                  <SimpleButton
                    text={`Voir dans le planétarium 3D`}
                    fullWidth
                    backgroundColor={app_colors.white}
                    small
                    textColor={app_colors.black}
                    onPress={() => navigation.push(routes.skymaps.planetarium.path, {defaultObject: object})}
                    align={"center"}
                  />
                </View>
              )
            }
          </View>
        </View>

        {
          objectInfos && objectInfos.dsoAdditionalInfos && (
            <ImageBackground style={celestialBodiesOverviewStyles.content.moreContainer} source={objectInfos.dsoAdditionalInfos.image} resizeMode="cover" imageStyle={{borderRadius: 10}}>
              <LinearGradient
                colors={['rgba(0,0,0,1)', 'rgba(0,0,0,0.4)']}
                style={{borderRadius: 10, padding: 10}}
              >
                <Text style={celestialBodiesOverviewStyles.content.sectionTitle}>{getObjectName(object, 'all', true)} en détails</Text>

                <View style={celestialBodiesOverviewStyles.content.moreContainer.infos}>
                  {/* <Image resizeMode={"contain"} source={objectInfos.dsoAdditionalInfos.image} style={{width: 80, height: 80, borderRadius: 10, borderWidth: 1, borderColor: app_colors.white_twenty}} /> */}
                  <View style={{flex: 1}}>
                    <DSOValues title={i18n.t('detailsPages.dso.generalInfos.discoveredBy')} value={objectInfos.dsoAdditionalInfos.discovered_by}/>
                    <DSOValues title={i18n.t('detailsPages.dso.generalInfos.discoveryYear')} value={objectInfos.dsoAdditionalInfos.discovery_year}/>
                    <DSOValues title={i18n.t('detailsPages.dso.generalInfos.distance')} value={objectInfos.dsoAdditionalInfos.distance}/>
                    <DSOValues title={i18n.t('detailsPages.dso.generalInfos.dimensions')} value={objectInfos.dsoAdditionalInfos.dimensions}/>
                    <DSOValues title={i18n.t('detailsPages.dso.generalInfos.apparentSize')} value={objectInfos.dsoAdditionalInfos.apparent_size}/>
                    <DSOValues title={i18n.t('detailsPages.dso.generalInfos.age')} value={objectInfos.dsoAdditionalInfos.age}/>
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          )
        }

        <View style={celestialBodiesOverviewStyles.content.personnalNotes}>
          <Text style={celestialBodiesOverviewStyles.content.sectionTitle}>Ajoutez des notes personnelles</Text>

          <View style={{gap: 20, marginTop: 10}}>
            <TextInput
              multiline
              value={personalNotes}
              onChangeText={(text) => handleNotesChange(text)}
              placeholder={"Ajoutez vos notes personnelles..."}
              placeholderTextColor={app_colors.white_sixty}
              style={{
                minHeight: 120,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: app_colors.white_twenty,
                padding: 10,
                color: app_colors.white,
                textAlignVertical: 'top',
                backgroundColor: app_colors.white_no_opacity,
              }}
            />

            <View style={{display: 'flex', flexDirection: 'column', gap: 10}}>
              <View>
                <Text style={celestialBodiesOverviewStyles.content.sectionTitle}>Votre expérience avec {getObjectName(object, 'all', true)}</Text>
                <Text style={celestialBodiesOverviewStyles.content.sectionSubtitle}>Cochez ce que vous avez réalisé avec cet objet</Text>
              </View>
              <View style={{flexDirection: 'row', gap: 10}}>
                {renderFlagButton('observed', 'Observé', require('../../../assets/icons/FiEye.png'))}
                {renderFlagButton('photographed', 'Photographié', require('../../../assets/icons/FiCamera.png'))}
                {renderFlagButton('sketched', 'Croquis', require('../../../assets/icons/FiPenTool.png'))}
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
