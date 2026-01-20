import { ActivityIndicator, Image, Text, TouchableOpacity, View } from "react-native"
import { Star } from "../../helpers/types/Star";
import { GlobalPlanet } from "../../helpers/types/GlobalPlanet";
import { DSO } from "../../helpers/types/DSO";
import { observationPlannerObjectCardStyles } from "../../styles/components/cards/observationPlannerObjectCard";
import { useEffect, useState } from "react";
import { ComputedObjectInfos } from "../../helpers/types/objects/ComputedObjectInfos";
import { useTranslation } from "../../hooks/useTranslation";
import { useSettings } from "../../contexts/AppSettingsContext";
import { useAuth } from "../../contexts/AuthContext";
import { computeObject } from "../../helpers/scripts/astro/objects/computeObject";
import dayjs, { Dayjs } from "dayjs";
import { app_colors } from "../../helpers/constants";
import VisibilityGraph from "../graphs/VisibilityGraph";
import DSOValues from "../commons/DSOValues";
import { getObjectIcon } from "../../helpers/scripts/astro/objects/getObjectIcon";
import { prettyDec, prettyRa } from "../../helpers/scripts/astro/prettyCoords";
import { getWindDir } from "../../helpers/scripts/getWindDir";
import SimpleButton from "../commons/buttons/SimpleButton";
import { routes } from "../../helpers/routes";

interface ObservationPlannerObjectCardProps {
  object: Star | GlobalPlanet | DSO;
  navigation: any;
  date: Dayjs;
}

export const ObservationPlannerObjectCard = ({ object, navigation, date }: ObservationPlannerObjectCardProps) => {

  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()


  const [expanded, setExpanded] = useState<boolean>(false);
  const [computedObject, setComputedObject] = useState<ComputedObjectInfos | null>(null);


  useEffect(() => {
    if(object && currentUserLocation){
      setComputedObject(computeObject({
        object: object,
        observer: { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon },
        lang: currentLocale,
        altitude: 341,
        date: date,
      }));
    }
  }, [object, currentUserLocation, currentLocale, date])


  const handleMoreDetails = () => {
    navigation.navigate(routes.celestialBodies.details.path, {object: object})
  }

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={observationPlannerObjectCardStyles.card}
      onPress={() => setExpanded(prev => !prev)}
    >
      {computedObject ? (
        <>
          <View>
            <View style={observationPlannerObjectCardStyles.card.row}>
              <Image source={getObjectIcon(object)} style={observationPlannerObjectCardStyles.card.icon} />
              <View style={{width: '40%'}}>
                <Text style={observationPlannerObjectCardStyles.card.primaryInfos.title}>{computedObject.base.name}</Text>
                <Text style={observationPlannerObjectCardStyles.card.primaryInfos.subtitle}>{computedObject.base.type}</Text>
              </View>
              <View style={[observationPlannerObjectCardStyles.card.row, {width: '30%', marginLeft: 'auto', justifyContent: 'flex-end'}]}>
                {
                  computedObject.visibilityInfos.isCircumpolar ? (
                    <View>
                      <Text style={observationPlannerObjectCardStyles.card.secondaryInfos.title}>Lever Coucher</Text>
                      <Text style={observationPlannerObjectCardStyles.card.secondaryInfos.subtitle}>Circumpolaire</Text>
                    </View>
                  ) : (
                    <>
                      <View>
                        <Text style={observationPlannerObjectCardStyles.card.secondaryInfos.title}>Lever</Text>
                        <Text style={observationPlannerObjectCardStyles.card.secondaryInfos.subtitle}>{computedObject.visibilityInfos.objectNextRise?.format('HH:mm')}</Text>
                      </View>

                      <View>
                          <Text style={observationPlannerObjectCardStyles.card.secondaryInfos.title}>Coucher</Text>
                        <Text style={observationPlannerObjectCardStyles.card.secondaryInfos.subtitle}>{computedObject.visibilityInfos.objectNextSet?.format('HH:mm')}</Text>
                      </View>
                    </>
                  )
                }
              </View>
              <Image source={expanded ? require('../../../assets/icons/FiChevronDown.png') : require('../../../assets/icons/FiChevronRight.png')} style={observationPlannerObjectCardStyles.card.expandArrow} />
            </View>
            {
              expanded && (
                <View style={{gap: 10}}>
                  <VisibilityGraph
                    visibilityGraph={computedObject.visibilityInfos.visibilityGraph}
                  />

                  <View>
                    <DSOValues title="Magnitude apparente" value={`${computedObject.base.v_mag} ${computedObject.base.family === "Planet" ? "(Max)" : ""}`} chipValue wideChip />
                    <DSOValues title="RA" value={prettyRa(computedObject.base.ra)} chipValue wideChip />
                    <DSOValues title="Dec" value={prettyDec(computedObject.base.dec)} chipValue wideChip />
                    <DSOValues title="Alt / Az" value={`${computedObject.base.alt} / ${computedObject.base.az} (${getWindDir(parseInt(computedObject.base.az))})`} chipValue wideChip />
                    <DSOValues title="Constellation" value={computedObject.base.constellation} chipValue wideChip />
                    {
                      computedObject.dsoAdditionalInfos && (
                        <>
                          <DSOValues title="Taille apparente" value={computedObject.dsoAdditionalInfos.apparent_size} chipValue wideChip />
                          <DSOValues title="Distance" value={computedObject.dsoAdditionalInfos.distance} chipValue wideChip />
                        </>
                      )
                    }
                    {
                      computedObject.planetAdditionalInfos && (
                        <>
                          <DSOValues title="Diamètre" value={computedObject.planetAdditionalInfos.diameter} chipValue wideChip />
                          <DSOValues title="Distance du Soleil" value={computedObject.planetAdditionalInfos.distanceToSun} chipValue wideChip />
                        </>
                      )
                    }
                  </View>

                  <SimpleButton
                    text="Voir plus de détails"
                    align="center"
                    onPress={() => handleMoreDetails()}
                    fullWidth
                    backgroundColor={app_colors.white}
                    textColor={app_colors.black}
                    textAdditionalStyles={{fontFamily: 'GilroyBlack'}}
                  />
                </View>
              )
            }
          </View>
        </>
      ) : (
        <ActivityIndicator size="small" color={app_colors.white} />
      )}
    </TouchableOpacity>
  )
}
