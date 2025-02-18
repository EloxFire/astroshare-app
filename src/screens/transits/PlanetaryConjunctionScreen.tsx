import React, { useEffect, useRef, useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { i18n } from '../../helpers/scripts/i18n';
import { globalStyles } from '../../styles/global';
import PageTitle from '../../components/commons/PageTitle';
import {
  Conjunction,
  findPlanetaryConjunctions,
  GeographicCoordinate,
  Interval, jupiter, mars,
  mercury, neptune,
  Planet, saturn, uranus, venus
} from '@observerly/astrometry';
import dayjs from 'dayjs';
import { useSettings } from '../../contexts/AppSettingsContext';
import ConjunctionCard from '../../components/cards/ConjunctionCard';
import { planetaryConjunctionStyles } from '../../styles/screens/transits/planetaryConjunction';
import ScreenInfo from '../../components/ScreenInfo';
import SelectDropdown from 'react-native-select-dropdown'
import {getObjectName} from "../../helpers/scripts/astro/objects/getObjectName";
import {GlobalPlanet} from "../../helpers/types/GlobalPlanet";
import {app_colors} from "../../helpers/constants";
import {getObjectIcon} from "../../helpers/scripts/astro/objects/getObjectIcon";
import SimpleButton from "../../components/commons/buttons/SimpleButton";
import DateTimePicker from '@react-native-community/datetimepicker';
import {getSpecificPlanetsConjunctions} from "../../helpers/scripts/astro/objects/getSpecificPlanetsConjunctions";
import {showToast} from "../../helpers/scripts/showToast";


export default function PlanetaryConjunctionScreen({ navigation }: any) {

  const { currentUserLocation } = useSettings();

  const [conjunctions, setConjunctions] = useState<Conjunction | null | undefined>(null);
  const [selectedPlanet1, setSelectedPlanet1] = useState<Planet | null>(null);
  const [selectedPlanet2, setSelectedPlanet2] = useState<Planet | null>(null);
  const [startDate, setStartDate] = useState<Date>(dayjs().toDate());
  const [endDate, setEndDate] = useState<Date>(dayjs().add(3, "months").toDate());
  const [isStartDateModalVisible, setIsStartDateModalVisible] = useState<boolean>(false);
  const [isEndDateModalVisible, setIsEndDateModalVisible] = useState<boolean>(false);
  const [loadingConjunctions, setLoadingConjunctions] = useState<boolean>(false);


  useEffect(() => {
    // searchConjunctions();
  }, [currentUserLocation]);

  const searchConjunctions = () => {

    if(!selectedPlanet1 || !selectedPlanet2) {
      showToast({type: 'error', message: 'Veuillez sélectionner deux planètes'});
      return;
    }

    if(selectedPlanet1 === selectedPlanet2) {
      showToast({type: 'error', message: 'Veuillez sélectionner deux planètes différentes'});
      return;
    }

    if(dayjs(startDate).isAfter(dayjs(endDate))) {
      showToast({type: 'error', message: 'La date de fin doit être après à la date de début'});
      return;
    }

    if (currentUserLocation) {
      setConjunctions(null);
      const separation = 3;

      const interval: Interval = {
        from: dayjs().toDate(),
        to: dayjs().add(6, 'months').toDate(),
      };

      const observer: GeographicCoordinate = {
        latitude: currentUserLocation.lat,
        longitude: currentUserLocation.lon,
      };

      const targets: [Planet, Planet] = [selectedPlanet1 as Planet, selectedPlanet2 as Planet];

      const c: Conjunction = getSpecificPlanetsConjunctions(targets, observer, interval, separation);
      console.log(c)
      setConjunctions(c);
      setLoadingConjunctions(false);
    } else {
      console.log('No location found');
      setLoadingConjunctions(false);
    }
  };

  const planetsList = [
    {title: "Planète", object: null, icon: undefined},
    {title: getObjectName(mercury as GlobalPlanet, 'all', true), object: mercury, icon: getObjectIcon(mercury as GlobalPlanet)},
    {title: getObjectName(venus as GlobalPlanet, 'all', true), object: venus, icon: getObjectIcon(venus as GlobalPlanet)},
    {title: getObjectName(mars as GlobalPlanet, 'all', true), object: mars, icon: getObjectIcon(mars as GlobalPlanet)},
    {title: getObjectName(jupiter as GlobalPlanet, 'all', true), object: jupiter, icon: getObjectIcon(jupiter as GlobalPlanet)},
    {title: getObjectName(saturn as GlobalPlanet, 'all', true), object: saturn, icon: getObjectIcon(saturn as GlobalPlanet)},
    {title: getObjectName(uranus as GlobalPlanet, 'all', true), object: uranus, icon: getObjectIcon(uranus as GlobalPlanet)},
    {title: getObjectName(neptune as GlobalPlanet, 'all', true), object: neptune, icon: getObjectIcon(neptune as GlobalPlanet)},

  ]


  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('transits.planetaryConjunction.title')}
        subtitle={i18n.t('transits.planetaryConjunction.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <View style={planetaryConjunctionStyles.content}>

        <Text style={planetaryConjunctionStyles.content.parameters.text}>Sélectionnez deux planètes</Text>
        <View style={planetaryConjunctionStyles.content.parameters}>
          <View style={planetaryConjunctionStyles.content.row}>
            <SelectDropdown
              data={planetsList}
              onSelect={(selectedFirstPlanet, index) => {
                setSelectedPlanet1(selectedFirstPlanet.object ? selectedFirstPlanet.object : null);
              }}
              renderButton={(selectedFirstPlanet, isOpened) => {
                if(selectedFirstPlanet) {
                  return (
                    <View style={[planetaryConjunctionStyles.content.parameters.dropdown, planetaryConjunctionStyles.content.parameters.dropdown.withIcon, {borderBottomLeftRadius: isOpened ? 0 : 10, borderBottomRightRadius: isOpened ? 0 : 10}]}>
                      <Text style={planetaryConjunctionStyles.content.parameters.dropdown.text}>{selectedFirstPlanet.title}</Text>
                      <Image source={selectedFirstPlanet.icon} style={{width: 20, height: 20}}/>
                    </View>
                  )
                }else {
                  return (
                    <View style={[planetaryConjunctionStyles.content.parameters.dropdown, {borderBottomLeftRadius: isOpened ? 0 : 10, borderBottomRightRadius: isOpened ? 0 : 10}]}>
                      <Text style={planetaryConjunctionStyles.content.parameters.dropdown.text}>Planète</Text>
                    </View>
                  )
                }
              }}
              renderItem={(item, index: number, isSelected: boolean) => {
                return (
                  <TouchableOpacity style={[planetaryConjunctionStyles.content.parameters.dropdown.list.item, {backgroundColor: isSelected ? app_colors.white_twenty : app_colors.white_no_opacity, borderBottomWidth: index === planetsList.length - 1 ? 0 : 1}]}>
                    <Text style={planetaryConjunctionStyles.content.parameters.dropdown.list.item.value}>{item.title}</Text>
                    <Image source={item.icon} style={{width: 20, height: 20}}/>
                  </TouchableOpacity>
                )
              }}
              dropdownStyle={planetaryConjunctionStyles.content.parameters.dropdown.list}
            />
            <Text style={planetaryConjunctionStyles.content.parameters.text}>et</Text>
            <SelectDropdown
              data={planetsList}
              onSelect={(selectedSecondPlanet) => {
                setSelectedPlanet2(selectedSecondPlanet.object ? selectedSecondPlanet.object : null);
              }}
              renderButton={(selectedSecondPlanet, isOpened: boolean) => {
                if(selectedSecondPlanet) {
                  return (
                    <View style={[planetaryConjunctionStyles.content.parameters.dropdown, planetaryConjunctionStyles.content.parameters.dropdown.withIcon, {borderBottomLeftRadius: isOpened ? 0 : 10, borderBottomRightRadius: isOpened ? 0 : 10}]}>
                      <Text style={planetaryConjunctionStyles.content.parameters.dropdown.text}>{selectedSecondPlanet.title}</Text>
                      <Image source={selectedSecondPlanet.icon} style={{width: 20, height: 20}}/>
                    </View>
                  )
                }else {
                  return (
                    <View style={[planetaryConjunctionStyles.content.parameters.dropdown, {borderBottomLeftRadius: isOpened ? 0 : 10, borderBottomRightRadius: isOpened ? 0 : 10}]}>
                      <Text style={planetaryConjunctionStyles.content.parameters.dropdown.text}>Planète</Text>
                    </View>
                  )
                }
              }}
              renderItem={(item, index: number, isSelected: boolean) => {
                return (
                  <TouchableOpacity style={[planetaryConjunctionStyles.content.parameters.dropdown.list.item, {backgroundColor: isSelected ? app_colors.white_twenty : app_colors.white_no_opacity, borderBottomWidth: index === planetsList.length - 1 ? 0 : 1}]}>
                    <Text style={planetaryConjunctionStyles.content.parameters.dropdown.list.item.value}>{item.title}</Text>
                    <Image source={item.icon} style={{width: 20, height: 20}}/>
                  </TouchableOpacity>
                )
              }}
              dropdownStyle={planetaryConjunctionStyles.content.parameters.dropdown.list}
            />
          </View>
          <Text style={planetaryConjunctionStyles.content.parameters.text}>Sélectionnez un intervalle</Text>
          <View style={planetaryConjunctionStyles.content.row}>
            <Text style={planetaryConjunctionStyles.content.parameters.text}>Entre le</Text>
            <SimpleButton
              text={dayjs(startDate).format('DD MMM YYYY')}
              activeBorderColor={app_colors.white_twenty}
              onPress={() => setIsStartDateModalVisible(true)}
              active
            />
            <Text style={planetaryConjunctionStyles.content.parameters.text}>et le</Text>
            <SimpleButton
              text={dayjs(endDate).format('DD MMM YYYY')}
              activeBorderColor={app_colors.white_twenty}
              onPress={() => setIsEndDateModalVisible(true)}
              active
            />
          </View>
          <View style={planetaryConjunctionStyles.content.row}>
            <SimpleButton
              text={"Rechercher"}
              onPress={() => {
                setLoadingConjunctions(true);
                searchConjunctions();
              }}
              backgroundColor={app_colors.white}
              textColor={app_colors.black}
              fullWidth
              small
            />
          </View>
        </View>

        {
          isStartDateModalVisible && (
            <DateTimePicker
              value={startDate}
              mode='date'
              display='default'
              themeVariant={'dark'}
              onChange={(event, selectedDate) => {
                if (event.type === 'dismissed') {
                  setIsStartDateModalVisible(false)
                }
                if (event.type === 'set' && selectedDate) {
                  setIsStartDateModalVisible(false)
                  setStartDate(selectedDate)
                }
              }}
            />
          )
        }

        {
          isEndDateModalVisible && (
            <DateTimePicker
              value={endDate}
              mode='date'
              themeVariant={'dark'}
              display='default'
              onChange={(event, selectedDate) => {
                if (event.type === 'dismissed') {
                  setIsEndDateModalVisible(false)
                }
                if (event.type === 'set' && selectedDate) {
                  setIsEndDateModalVisible(false)
                  setEndDate(selectedDate)
                }
              }}
            />
          )
        }

        {
          !loadingConjunctions && conjunctions && (
            <ConjunctionCard conjunction={conjunctions} />
          )
        }

        {
          !loadingConjunctions && conjunctions === undefined && (
            <ScreenInfo image={require('../../../assets/icons/FiXCircle.png')} text={"Aucune conjonction trouvée avec les paramètres donnés..."}/>
          )
        }
        {
          !loadingConjunctions && conjunctions === null && (
            <ScreenInfo image={require('../../../assets/icons/FiTransit.png')} text={"Ajustez les paramètres pour trouver des conjonctions"}/>
          )
        }
      </View>
    </View>
  );
}
