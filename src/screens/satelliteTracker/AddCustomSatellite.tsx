import React, { useEffect } from "react";
import {ScrollView, Text, View} from "react-native";
import { globalStyles } from "../../styles/global";
import PageTitle from "../../components/commons/PageTitle";
import { i18n } from "../../helpers/scripts/i18n";
import { getData, getObject } from "../../helpers/storage";
import { storageKeys } from "../../helpers/constants";
import { Satellite } from "../../helpers/types/satellites/Satellite";


export default function AddCustomSatellite({ navigation }: any) {

  const [userSatList, setUserSatList] = React.useState<Array<Satellite>>([]);

  useEffect(() => {
    (async () => {
      const storedList = await getObject(storageKeys.satellites.customNoradList);
      if (storedList) {
        const parsedList = JSON.parse(storedList) as Array<Satellite>;
        setUserSatList(parsedList);
      }
    })()
  }, [])

  const handleAddSatellite = (noradId: number) => {

  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('satelliteTrackers.addSatellite.title')}
        subtitle={i18n.t('satelliteTrackers.addSatellite.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        {
          userSatList.length === 0 ? (
            <Text style={globalStyles.text}>
              {i18n.t('satelliteTrackers.addSatellite.noCustomSatellites')}
            </Text>
          ) : (
            userSatList.map((satellite) => (
              <View key={satellite.noradId} style={globalStyles.screens.listItem}>
                <Text style={globalStyles.text}>
                  {satellite.name} (NORAD ID: {satellite.noradId})
                </Text>
                {/* Add button or functionality to add the satellite */}
              </View>
            ))
          )
        }
      </ScrollView>
    </View>
  );
}
