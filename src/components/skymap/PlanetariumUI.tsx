import React, {useEffect, useState} from "react";
import {Image, ImageSourcePropType, Text, TextInput, TouchableOpacity, View} from "react-native";
import {planetariumUIStyles} from "../../styles/components/skymap/planetariumUI";
import {routes} from "../../helpers/routes";
import {useSettings} from "../../contexts/AppSettingsContext";
import dayjs from "dayjs";
import {GeographicCoordinate, isNight} from "@observerly/astrometry";
import {ComputedObjectInfos} from "../../helpers/types/objects/ComputedObjectInfos";
import {computeObject} from "../../helpers/scripts/astro/objects/computeObject";
import {useTranslation} from "../../hooks/useTranslation";
import {DSO} from "../../helpers/types/DSO";
import {Star} from "../../helpers/types/Star";
import {GlobalPlanet} from "../../helpers/types/GlobalPlanet";
import VisibilityGraph from "../graphs/VisibilityGraph";
import {useStarCatalog} from "../../contexts/StarsContext";
import SimpleButton from "../commons/buttons/SimpleButton";
import SimpleBadge from "../badges/SimpleBadge";
import {app_colors} from "../../helpers/constants";
import DSOValues from "../commons/DSOValues";
import {i18n} from "../../helpers/scripts/i18n";
import {convertDegreesRaToHMS} from "../../helpers/scripts/astro/coords/convertDegreesRaToHMS";
import {prettyDec, prettyRa} from "../../helpers/scripts/astro/prettyCoords";
import {convertDegreesDecToDMS} from "../../helpers/scripts/astro/coords/convertDegreesDecToDms";
import {getObjectFamily} from "../../helpers/scripts/astro/objects/getObjectFamily";
import InputWithIcon from "../forms/InputWithIcon";

interface PlanetariumUIProps {
  navigation: any;
  infos: DSO | Star | GlobalPlanet | null;
  onShowEqGrid: () => void;
  onShowConstellations: () => void;
  onShowAzGrid: () => void;
  onShowGround: () => void;
  onShowPlanets: () => void;
  onShowDSO: () => void;
  onCenterObject: () => void;
}

export default function PlanetariumUI({ navigation, infos, onShowGround, onShowConstellations, onShowAzGrid, onShowEqGrid, onShowDSO, onShowPlanets, onCenterObject }: PlanetariumUIProps) {

  const {currentUserLocation} = useSettings();
  const {currentLocale} = useTranslation();
  const [currentTime, setCurrentTime] = useState<string>(dayjs().format('HH:mm'));
  const [isNightTime, setIsNightTime] = useState<boolean>(false);

  const [showLayerModal, setShowLayerModal] = useState<boolean>(false);
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);

  const [objectInfos, setObjectInfos] = useState<ComputedObjectInfos | null>(null);
  const [currentInfoTab, setCurrentInfoTab] = useState<number>(0);

  const updateClock = () => {
    setCurrentTime(dayjs().format('HH:mm'));
    setIsNightTime(isNight(new Date, {latitude: currentUserLocation.lat, longitude: currentUserLocation.lon}));
  }

  useEffect(() => {
    const interval = setInterval(() => {
      updateClock();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCurrentInfoTab(0);
    if(infos){
      const observer: GeographicCoordinate = {latitude: currentUserLocation.lat, longitude: currentUserLocation.lon};
      setObjectInfos(computeObject({object: infos, observer, lang: currentLocale, altitude: 341 }));
    }else{
      setObjectInfos(null);
    }
  }, [infos]);

  const handleShowSearch = () => {
    setShowSearchBar(!showSearchBar);
    setShowLayerModal(false);
  }

  const handleShowLayers = () => {
    setShowLayerModal(!showLayerModal);
    setShowSearchBar(false);
  }


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

      {
        showSearchBar && (
          <View style={[planetariumUIStyles.container.searchContainer]}>
            <TextInput
              style={planetariumUIStyles.container.searchContainer.input}
              placeholder={"Recherchez un objet"}
              placeholderTextColor={app_colors.white_sixty}
              keyboardType="default"
            />

            <View style={[planetariumUIStyles.container.searchContainer.categories]}>
              <TouchableOpacity style={planetariumUIStyles.container.searchContainer.categories.category}>
                <Text style={planetariumUIStyles.container.searchContainer.categories.category.text}>Vos favoris</Text>
                <Image style={planetariumUIStyles.container.searchContainer.categories.category.icon} source={require('../../../assets/icons/FiChevronRight.png')} />
              </TouchableOpacity>
              <View  style={planetariumUIStyles.container.searchContainer.categories.separator}/>
              <TouchableOpacity style={planetariumUIStyles.container.searchContainer.categories.category}>
                <Text style={planetariumUIStyles.container.searchContainer.categories.category.text}>Objets du ciel profond</Text>
                <Image style={planetariumUIStyles.container.searchContainer.categories.category.icon} source={require('../../../assets/icons/FiChevronRight.png')} />
              </TouchableOpacity>
              <View  style={planetariumUIStyles.container.searchContainer.categories.separator}/>
              <TouchableOpacity style={planetariumUIStyles.container.searchContainer.categories.category}>
                <Text style={planetariumUIStyles.container.searchContainer.categories.category.text}>Étoiles</Text>
                <Image style={planetariumUIStyles.container.searchContainer.categories.category.icon} source={require('../../../assets/icons/FiChevronRight.png')} />
              </TouchableOpacity>
              <View  style={planetariumUIStyles.container.searchContainer.categories.separator}/>
              <TouchableOpacity style={planetariumUIStyles.container.searchContainer.categories.category}>
                <Text style={planetariumUIStyles.container.searchContainer.categories.category.text}>Planètes</Text>
                <Image style={planetariumUIStyles.container.searchContainer.categories.category.icon} source={require('../../../assets/icons/FiChevronRight.png')} />
              </TouchableOpacity>
            </View>
          </View>
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
          </View>
        )
      }

      <View style={planetariumUIStyles.container.generalInfosBar}>
        <View style={planetariumUIStyles.container.generalInfosBar.header}>
          <Text  style={planetariumUIStyles.container.generalInfosBar.header.location}>{currentUserLocation.common_name}</Text>
          <Text style={planetariumUIStyles.container.generalInfosBar.header.clock}>{currentTime.replace(':', 'h')}</Text>
          <Text  style={planetariumUIStyles.container.generalInfosBar.header.location}>{isNightTime ? "(Nuit)" : "(Journée)"}</Text>
        </View>
        {objectInfos && (
          <View>
            <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
              <SimpleButton active={currentInfoTab === 0} small text="Infos" icon={require('../../../assets/icons/FiInfo.png')} backgroundColor={app_colors.black_skymap} onPress={() => setCurrentInfoTab(0)} />
              <SimpleButton active={currentInfoTab === 1} small text="Visibilité" icon={require('../../../assets/icons/FiEye.png')} backgroundColor={app_colors.black_skymap} onPress={() => setCurrentInfoTab(1)} />
              <SimpleButton active={currentInfoTab === 2} small text="Détails" icon={require('../../../assets/icons/FiFileText.png')} backgroundColor={app_colors.black_skymap} onPress={() => setCurrentInfoTab(2)} />
              <SimpleButton active={currentInfoTab === 3} small text="Centrer" icon={require('../../../assets/icons/FiCrosshair.png')} backgroundColor={app_colors.black_skymap} onPress={() => onCenterObject()} />
            </View>
            {
              objectInfos && currentInfoTab === 0 && (
                <View style={planetariumUIStyles.container.generalInfosBar.body}>
                  <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100%', gap: 10}}>
                    <View style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                      <Image style={planetariumUIStyles.container.generalInfosBar.body.image} source={objectInfos.base.icon} />
                    </View>
                    <View style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                      <Text style={planetariumUIStyles.container.generalInfosBar.body.title}>{objectInfos.base.common_name}</Text>
                      <Text style={planetariumUIStyles.container.generalInfosBar.body.subtitle}>{objectInfos.base.family}</Text>
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
              )
            }

            {
              objectInfos && currentInfoTab === 1 && (
                <View style={planetariumUIStyles.container.generalInfosBar.body}>
                  <VisibilityGraph visibilityGraph={objectInfos.visibilityInfos.visibilityGraph}/>
                </View>
              )
            }

            {
              objectInfos && currentInfoTab === 2 && (
                <View style={planetariumUIStyles.container.generalInfosBar.body}>
                  <View style={{display: 'flex', flexDirection: 'row', justifyContent: 'flex-start', width: '100%', gap: 10}}>
                    <View style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                      <Image style={planetariumUIStyles.container.generalInfosBar.body.image} source={objectInfos.base.icon} />
                    </View>
                    <View style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                      <Text style={planetariumUIStyles.container.generalInfosBar.body.title}>{objectInfos.base.common_name}</Text>
                      <Text style={planetariumUIStyles.container.generalInfosBar.body.subtitle}>{objectInfos.base.family}</Text>
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
                    <DSOValues title={i18n.t('detailsPages.dso.labels.magnitude')} value={objectInfos.base.mag}/>

                    {
                      objectInfos.dsoAdditionalInfos && (
                        <>
                          <DSOValues title={"Discovered by"} value={objectInfos.dsoAdditionalInfos.discovered_by}/>
                          <DSOValues title={"Discovery year"} value={objectInfos.dsoAdditionalInfos.discovery_year}/>
                          <DSOValues title={"Distance"} value={objectInfos.dsoAdditionalInfos.distance}/>
                          <DSOValues title={"Dimensions"} value={objectInfos.dsoAdditionalInfos.dimensions}/>
                          <DSOValues title={"Apparent size"} value={objectInfos.dsoAdditionalInfos.apparent_size}/>
                          <DSOValues title={"Age"} value={objectInfos.dsoAdditionalInfos.age}/>
                        </>
                      )
                    }
                    {
                      objectInfos.planetAdditionalInfos && (
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

                    <View style={{marginTop: 10, paddingTop: 10, borderTopColor: app_colors.white_twenty, borderTopWidth: 1}}>
                      <DSOValues chipValue chipColor={objectInfos.visibilityInfos.nakedEye.backgroundColor} chipForegroundColor={objectInfos.visibilityInfos.nakedEye.foregroundColor} title={i18n.t('common.observation.nakedEye')} value={objectInfos.visibilityInfos.nakedEye.label}/>
                      <DSOValues chipValue chipColor={objectInfos.visibilityInfos.binoculars.backgroundColor} chipForegroundColor={objectInfos.visibilityInfos.binoculars.foregroundColor} title={i18n.t('common.observation.binoculars')} value={objectInfos.visibilityInfos.binoculars.label}/>
                      <DSOValues chipValue chipColor={objectInfos.visibilityInfos.telescope.backgroundColor} chipForegroundColor={objectInfos.visibilityInfos.telescope.foregroundColor} title={i18n.t('common.observation.telescope')} value={objectInfos.visibilityInfos.telescope.label}/>
                    </View>
                  </View>
                </View>
              )
            }
          </View>
        )}
      </View>
    </View>
  );
}
