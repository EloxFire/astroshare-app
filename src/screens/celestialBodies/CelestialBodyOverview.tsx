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

export default function CelestialBodyOverview({ route, navigation }: any) {

  const {currentUserLocation} = useSettings()
  const { object, isVisible } = route.params;
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
      <ScrollView style={celestialBodiesOverviewStyles.content}>
        <View style={celestialBodiesOverviewStyles.content.header}>
          <View>
            <Image source={getDSOIcon(object)} style={celestialBodiesOverviewStyles.content.header.icon} />
          </View>
          <View style={celestialBodiesOverviewStyles.content.header.infos}>
            <View>
              <Text style={celestialBodiesOverviewStyles.content.header.infos.title}>{getObjectName(object, 'all', true)}</Text>
              <Text style={celestialBodiesOverviewStyles.content.header.infos.subtitle}>{getObjectType(object)}</Text>
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
                    <SimpleBadge
                      noBorder
                      text={objectInfos.visibilityInfos.visibilityLabel}
                      icon={objectInfos.visibilityInfos.visibilityIcon}
                      backgroundColor={objectInfos.visibilityInfos.visibilityBackgroundColor}
                      foregroundColor={objectInfos.visibilityInfos.visibilityForegroundColor}
                    />
                  </View>
                )
              }
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
