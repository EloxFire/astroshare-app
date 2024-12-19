import React, {useEffect, useState} from 'react'
import {View, ScrollView, Text, TouchableOpacity, Image} from 'react-native'
import { i18n } from '../../helpers/scripts/i18n'
import { globalStyles } from '../../styles/global'
import PageTitle from '../../components/commons/PageTitle'
import {Conjunction, findPlanetaryConjunctions, GeographicCoordinate, Interval, Planet} from "@observerly/astrometry";
import dayjs from "dayjs";
import {useSettings} from "../../contexts/AppSettingsContext";
import ConjunctionCard from "../../components/cards/ConjunctionCard";
import {planetaryConjunctionStyles} from "../../styles/screens/transits/planetaryConjunction";
import ScreenInfo from "../../components/ScreenInfo";
import ConjunctionFiltersModal from "../../components/modals/ConjunctionFilterModal";

export default function PlanetaryConjunctionScreen({ navigation }: any) {

  const {currentUserLocation} = useSettings();
  const [conjunctions, setConjunctions] = useState<Map<string, Conjunction> | null>(null);
  const [loadingConjunctions, setLoadingConjunctions] = useState<boolean>(true);
  const [showFiltersModal, setShowFiltersModal] = useState<boolean>(true);

  // useEffect(() => {
  //   if (currentUserLocation) {
  //     const interval: Interval = {
  //       from: dayjs().toDate(),
  //       to: dayjs().add(1, 'year').toDate()
  //     };
  //
  //     const observer: GeographicCoordinate = {
  //       latitude: currentUserLocation.lat,
  //       longitude: currentUserLocation.lon,
  //     }
  //     const c: Map<string, Conjunction> = findPlanetaryConjunctions(interval, observer);
  //     console.log(c);
  //     setConjunctions(c);
  //     setLoadingConjunctions(false);
  //   }
  // }, [currentUserLocation]);

  return (
    <View style={globalStyles.body}>
      {showFiltersModal && <ConjunctionFiltersModal onClose={() => {}}/>}
      <PageTitle
        navigation={navigation}
        title={i18n.t('transits.planetaryConjunction.title')}
        subtitle={i18n.t('transits.planetaryConjunction.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <View style={planetaryConjunctionStyles.content.filters}>
        <TouchableOpacity style={planetaryConjunctionStyles.content.filters.button}>
          <Text style={planetaryConjunctionStyles.content.filters.button.text}>Filtres de recherche</Text>
          <Image source={require('../../../assets/icons/FiFilter.png')} style={planetaryConjunctionStyles.content.filters.button.image}/>
        </TouchableOpacity>
        <Text style={planetaryConjunctionStyles.content.filters.button.text}>2 filtres actifs</Text>
      </View>
      <ScrollView>
        <View style={planetaryConjunctionStyles.content}>
          {
            loadingConjunctions ?
              <ScreenInfo image={require('../../../assets/icons/FiTransit.png')} text={"Calcul des conjonctions en cours..."}/> :
              conjunctions && Array.from(conjunctions.entries()).length > 0 ? Array.from(conjunctions.entries()).map(([key, conjunction], index) => {
                console.log(conjunction);
                return (
                  <ConjunctionCard key={key} conjunction={conjunction}/>
                )
              }) :
                <ScreenInfo image={require('../../../assets/icons/FiTransit.png')} text={"Aucune conjonction à venir"}/>
          }
          {
            !loadingConjunctions && conjunctions && Array.from(conjunctions.entries()).length > 0 &&
            <ScreenInfo image={require('../../../assets/icons/FiTransit.png')} text={"Fin de la liste des conjonctions pour les filtres sélectionnés"}/>
          }
        </View>
      </ScrollView>
    </View>
  )
}
