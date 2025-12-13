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
import dayjs from "dayjs";
import { app_colors } from "../../helpers/constants";
import VisibilityGraph from "../graphs/VisibilityGraph";
import DSOValues from "../commons/DSOValues";
import { getObjectIcon } from "../../helpers/scripts/astro/objects/getObjectIcon";

interface ObservationPlannerObjectCardProps {
  object: Star | GlobalPlanet | DSO;
  navigation: any;
}

export const ObservationPlannerObjectCard = ({ object, navigation }: ObservationPlannerObjectCardProps) => {

  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()


  const [expanded, setExpanded] = useState<boolean>(false);
  const [computedObject, setComputedObject] = useState<ComputedObjectInfos | null>(null);


  useEffect(() => {
    if(object && currentUserLocation && currentUser){
      setComputedObject(computeObject({
        object: object,
        observer: { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon },
        lang: currentLocale,
        altitude: 341
      }));
    }
  }, [object, currentUserLocation, currentUser, currentLocale])

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
              <View>
                <Text style={observationPlannerObjectCardStyles.card.primaryInfos.title}>{computedObject.base.name}</Text>
                <Text style={observationPlannerObjectCardStyles.card.primaryInfos.subtitle}>{computedObject.base.type}</Text>
              </View>
              <View style={[observationPlannerObjectCardStyles.card.row, {width: '30%', marginLeft: 'auto', justifyContent: 'flex-end'}]}>
                <View>
                    <Text style={observationPlannerObjectCardStyles.card.secondaryInfos.title}>Lever</Text>
                  <Text style={observationPlannerObjectCardStyles.card.secondaryInfos.subtitle}>{computedObject.visibilityInfos.objectNextRise?.format('HH:mm')}</Text>
                </View>

                <View>
                    <Text style={observationPlannerObjectCardStyles.card.secondaryInfos.title}>Coucher</Text>
                  <Text style={observationPlannerObjectCardStyles.card.secondaryInfos.subtitle}>{computedObject.visibilityInfos.objectNextSet?.format('HH:mm')}</Text>
                </View>
              </View>
            </View>
            {
              expanded && (
                <View>
                  <VisibilityGraph
                    visibilityGraph={computedObject.visibilityInfos.visibilityGraph}
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
