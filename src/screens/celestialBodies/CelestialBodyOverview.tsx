import React, { useEffect, useState } from "react";
import {globalStyles} from "../../styles/global";
import PageTitle from "../../components/commons/PageTitle";
import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
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
import {getConstellationName} from "../../helpers/scripts/getConstellationName";
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

export default function CelestialBodyOverview({ route, navigation }: any) {

  const {currentLocale} = useTranslation()
  const {currentUserLocation} = useSettings()
  const { object } = route.params;
  const [objectInfos, setObjectInfos] = useState<ComputedObjectInfos | null>(null);
  const [favouritePlanets, setFavouritePlanets] = useState<GlobalPlanet[]>([]);
  const [favouriteDSO, setFavouriteDSO] = useState<DSO[]>([]);
  const [favouriteStars, setFavouriteStars] = useState<Star[]>([]);

  useEffect(() => {
    const observer = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }
    setObjectInfos(computeObject({ object, observer, lang: currentLocale, altitude: 341 }));
  }, [])


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
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('detailsPages.dso.title')}
        subtitle={i18n.t('detailsPages.dso.subtitle')}
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
              {objectInfos && <Text style={celestialBodiesOverviewStyles.content.header.infos.subtitle}>{objectInfos.base.common_name !== "" ? objectInfos.base.common_name : getObjectType(object)}</Text>}
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
            <View style={{width: getObjectFamily(object) === 'Planet' ? '100%' : '70%', paddingTop: 10, display: 'flex', flexDirection: "column", justifyContent: 'space-between'}}>
              <View>
                <DSOValues small={getObjectFamily(object) !== 'Planet'} title={i18n.t('detailsPages.dso.labels.type')} value={getObjectType(object)} />
                <DSOValues small={getObjectFamily(object) !== 'Planet'} title={i18n.t('detailsPages.dso.labels.rightAscension')} value={typeof(object.ra) === 'number' ? convertDegreesRaToHMS(object.ra) : prettyRa(object.ra)} />
                <DSOValues small={getObjectFamily(object) !== 'Planet'} title={i18n.t('detailsPages.dso.labels.declination')} value={typeof(object.dec) === 'number' ? convertDegreesDecToDMS(object.dec) : prettyRa(object.dec)} />
                <DSOValues small={getObjectFamily(object) !== 'Planet'} title={i18n.t('detailsPages.dso.labels.magnitude')} value={objectInfos?.base.mag} />
                {
                  getObjectFamily(object) === 'Planet' && objectInfos?.planetAdditionalInfos && (
                    <>
                      <DSOValues small={getObjectFamily(object) !== 'Planet'} title={i18n.t('detailsPages.planets.labels.symbol')} value={objectInfos.planetAdditionalInfos.symbol} />
                      <DSOValues small={getObjectFamily(object) !== 'Planet'} title={i18n.t('detailsPages.planets.labels.position')} value={objectInfos.planetAdditionalInfos.solarSystemPosition} />
                      <DSOValues small={getObjectFamily(object) !== 'Planet'} title={i18n.t('detailsPages.planets.labels.inclination')} value={objectInfos.planetAdditionalInfos.inclination} />
                      <DSOValues small={getObjectFamily(object) !== 'Planet'} title={i18n.t('detailsPages.planets.labels.mass')} value={objectInfos.planetAdditionalInfos.mass} />
                      <DSOValues small={getObjectFamily(object) !== 'Planet'} title={i18n.t('detailsPages.planets.labels.orbitalPeriod')} value={objectInfos.planetAdditionalInfos.orbitalPeriod} />
                      <DSOValues small={getObjectFamily(object) !== 'Planet'} title={i18n.t('detailsPages.planets.labels.distanceSun')} value={objectInfos.planetAdditionalInfos.distanceToSun} />
                      <DSOValues small={getObjectFamily(object) !== 'Planet'} title={i18n.t('detailsPages.planets.labels.diameter')} value={objectInfos.planetAdditionalInfos.diameter} />
                      <DSOValues small={getObjectFamily(object) !== 'Planet'} title={i18n.t('detailsPages.planets.labels.short.surfaceTemperature')} value={objectInfos.planetAdditionalInfos.surfaceTemperature} />
                      <DSOValues small={getObjectFamily(object) !== 'Planet'} title={i18n.t('detailsPages.planets.labels.short.naturalSatellites')} value={objectInfos.planetAdditionalInfos.naturalSatellites} />
                    </>
                  )
                }
              </View>

              <View style={{marginTop: 10}}>
                <SimpleButton
                  text={`Voir dans le planétarium`}
                  fullWidth backgroundColor={app_colors.white}
                  small
                  textColor={app_colors.black}
                  onPress={() => navigation.push(routes.planetarium.path, {defaultObject: object})}
                  align={"center"}
                />
              </View>
            </View>

            {
              getObjectFamily(object) !== 'Planet' &&
              <View style={[celestialBodiesOverviewStyles.content.positionContainer.content.constel, {justifyContent: getObjectFamily(object) === 'Planet' ? 'flex-start' : 'center'}]}>
                <View>
                  <View style={{padding: 5, borderWidth: 1, borderColor: app_colors.white_twenty, borderRadius: 10, display: 'flex', justifyContent: 'center'}}>
                    {
                      getObjectFamily(object) === 'DSO' && (
                        <Image resizeMode={"contain"} source={constellationsImages[object.const]} style={celestialBodiesOverviewStyles.content.positionContainer.content.constel.image} />
                      )
                    }
                    {
                      getObjectFamily(object) === 'Star' && (
                        <Image resizeMode={"contain"} source={constellationsImages[getConstellation({ ra: object.ra, dec: object.dec })?.abbreviation || "OTHER"]} style={celestialBodiesOverviewStyles.content.positionContainer.content.constel.image} />
                      )
                    }
                  </View>
                  {
                    getObjectFamily(object) === 'DSO' && (
                      <Text style={[celestialBodiesOverviewStyles.content.sectionTitle, {textAlign: 'center', marginTop: 10}]}>{getConstellationName(object.const)}</Text>
                    )
                  }
                  {
                    getObjectFamily(object) === 'Star' && (
                      <Text style={[celestialBodiesOverviewStyles.content.sectionTitle, {textAlign: 'center', marginTop: 10}]}>{getConstellationName(getConstellation({ ra: object.ra, dec: object.dec })?.abbreviation || "OTHER")}</Text>
                    )
                  }
                </View>
              </View>
            }
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
            <VisibilityGraph
              visibilityGraph={{altitudes: objectInfos?.visibilityInfos.visibilityGraph.altitudes || [], hours: objectInfos?.visibilityInfos.visibilityGraph.hours || []}}
            />
          </View>
        </View>

        {
          objectInfos && objectInfos.dsoAdditionalInfos && (
            <View style={celestialBodiesOverviewStyles.content.moreContainer}>
              <Text style={celestialBodiesOverviewStyles.content.sectionTitle}>{getObjectName(object, 'all', true)} en détails</Text>

              <View style={celestialBodiesOverviewStyles.content.moreContainer.infos}>
                <Image resizeMode={"contain"} source={objectInfos.dsoAdditionalInfos.image} style={{width: 80, height: 80, borderRadius: 10, borderWidth: 1, borderColor: app_colors.white_twenty}} />
                <View style={{flex: 1}}>
                  <DSOValues title={i18n.t('detailsPages.dso.generalInfos.discoveredBy')} value={objectInfos.dsoAdditionalInfos.discovered_by}/>
                  <DSOValues title={i18n.t('detailsPages.dso.generalInfos.discoveryYear')} value={objectInfos.dsoAdditionalInfos.discovery_year}/>
                  <DSOValues title={i18n.t('detailsPages.dso.generalInfos.distance')} value={objectInfos.dsoAdditionalInfos.distance}/>
                  <DSOValues title={i18n.t('detailsPages.dso.generalInfos.dimensions')} value={objectInfos.dsoAdditionalInfos.dimensions}/>
                  <DSOValues title={i18n.t('detailsPages.dso.generalInfos.apparentSize')} value={objectInfos.dsoAdditionalInfos.apparent_size}/>
                  <DSOValues title={i18n.t('detailsPages.dso.generalInfos.age')} value={objectInfos.dsoAdditionalInfos.age}/>
                </View>
              </View>
            </View>
          )
        }
      </ScrollView>
    </View>
  );
}
