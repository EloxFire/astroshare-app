import React, {useEffect, useState} from 'react'
import {View, ScrollView, Text} from 'react-native'
import { i18n } from '../../helpers/scripts/i18n'
import { globalStyles } from '../../styles/global'
import PageTitle from '../../components/commons/PageTitle'
import {Conjunction, findPlanetaryConjunctions, GeographicCoordinate, Interval, Planet} from "@observerly/astrometry";
import dayjs from "dayjs";
import {useSettings} from "../../contexts/AppSettingsContext";

export default function PlanetaryConjunctionScreen({ navigation }: any) {

  const {currentUserLocation} = useSettings();
  const [conjunctions, setConjunctions] = useState<Map<string, Conjunction> | null>(null);

  useEffect(() => {
    if (currentUserLocation) {
      const interval: Interval = {
        from: dayjs().toDate(),
        to: dayjs().add(1, 'year').toDate()
      };

      const observer: GeographicCoordinate = {
        latitude: currentUserLocation.lat,
        longitude: currentUserLocation.lon,
      }
      const c: Map<string, Conjunction> = findPlanetaryConjunctions(interval, observer);
      console.log(c)
      setConjunctions(c);
    }
  }, [currentUserLocation]);

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('transits.planetaryConjunction.title')}
        subtitle={i18n.t('transits.planetaryConjunction.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View>
          {
            conjunctions && Array.from(conjunctions.entries()).map(([key, conjunction], index) => {
              console.log(conjunction);
              return (
                <View key={key || index}>
                  <Text style={{ color: 'white' }}>
                    {conjunction.targets[0].name} {conjunction.targets[1].name} {dayjs(conjunction.datetime).format('DD/MM/YYYY HH:mm')}
                  </Text>
                </View>
              )
            })
          }
        </View>
      </ScrollView>
    </View>
  )
}
