import React, { useEffect, useState } from "react";
import {globalStyles} from "../../styles/global";
import PageTitle from "../../components/commons/PageTitle";
import {Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {i18n} from "../../helpers/scripts/i18n";
import {celestialBodiesOverviewStyles} from "../../styles/screens/celestialBodies/celestialBodies";
import {getDSOIcon} from "../../helpers/scripts/astro/objects/getObjectIcon";
import {getObjectName} from "../../helpers/scripts/astro/objects/getObjectName";
import {getObjectType} from "../../helpers/scripts/astro/objects/getObjectType";
import SimpleBadge from "../../components/badges/SimpleBadge";
import {computeObject} from "../../helpers/scripts/astro/objects/computeObject";
import {useSettings} from "../../contexts/AppSettingsContext";
import {ComputedObjectInfos} from "../../helpers/types/objects/ComputedObjectInfos";
import {astroImages, constellationsImages} from "../../helpers/scripts/loadImages";
import {app_colors} from "../../helpers/constants";
import {getObjectFamily} from "../../helpers/scripts/astro/objects/getObjectFamily";
import {getConstellationName} from "../../helpers/scripts/getConstellationName";
import DSOValues from "../../components/commons/DSOValues";
import SimpleButton from "../../components/commons/buttons/SimpleButton";
import {prettyRa} from "../../helpers/scripts/astro/prettyCoords";
import {convertDegreesRaToHMS} from "../../helpers/scripts/astro/coords/convertDegreesRaToHMS";
import {convertDegreesDecToDMS} from "../../helpers/scripts/astro/coords/convertDegreesDecToDms";
import VisibilityGraph from "../../components/graphs/VisibilityGraph";

export default function CelestialBodyOverview({ route, navigation }: any) {

  const {currentUserLocation} = useSettings()
  const { object } = route.params;
  const [objectInfos, setObjectInfos] = useState<ComputedObjectInfos | null>(null);

  useEffect(() => {
    const observer = { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon }
    setObjectInfos(computeObject({ object, observer, altitude: 341 }));
  }, [])

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
          <View>
            <Image source={getDSOIcon(object)} style={celestialBodiesOverviewStyles.content.header.icon} />
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
                    <SimpleBadge
                      text={object.name}
                    />
                  )
                }
                <SimpleBadge
                  text={object.const}
                  icon={astroImages['CONSTELLATION']}
                  iconColor={app_colors.white}
                />
                {
                  objectInfos.base.common_name !== "" && (
                    <SimpleBadge
                      text={object.type}
                    />
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
            <View style={{width: '70%', paddingTop: 10, display: 'flex', flexDirection: "column", justifyContent: 'space-between'}}>
              <View>
                <DSOValues small title={i18n.t('detailsPages.dso.labels.type')} value={getObjectType(object)} />
                <DSOValues small title={i18n.t('detailsPages.dso.labels.rightAscension')} value={typeof(object.ra) === 'number' ? convertDegreesRaToHMS(object.ra) : prettyRa(object.ra)} />
                <DSOValues small title={i18n.t('detailsPages.dso.labels.declination')} value={typeof(object.dec) === 'number' ? convertDegreesDecToDMS(object.dec) : prettyRa(object.dec)} />
                <DSOValues small title={i18n.t('detailsPages.dso.labels.magnitude')} value={objectInfos?.base.mag} />
              </View>

              <View>
                <SimpleButton text={"Voir dans le planétarium"} fullWidth backgroundColor={app_colors.white} small textColor={app_colors.black} />
              </View>
            </View>

            <View style={celestialBodiesOverviewStyles.content.positionContainer.content.constel}>
              <View>
                <View style={{padding: 5, borderWidth: 1, borderColor: app_colors.white_twenty, borderRadius: 10}}>
                  <Image resizeMode={"contain"} source={constellationsImages[object.const]} style={celestialBodiesOverviewStyles.content.positionContainer.content.constel.image} />
                </View>
                <Text style={[celestialBodiesOverviewStyles.content.sectionTitle, {textAlign: 'center', marginTop: 10}]}>{getConstellationName(object.const)}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={celestialBodiesOverviewStyles.content.visibilityContainer}>
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
      </ScrollView>
    </View>
  );
}
