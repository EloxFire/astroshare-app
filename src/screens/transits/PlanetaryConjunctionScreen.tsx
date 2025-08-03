import React, {useEffect, useRef, useState} from 'react';
import {View, Text, TouchableOpacity, Image, ActivityIndicator} from 'react-native';
import { i18n } from '../../helpers/scripts/i18n';
import { globalStyles } from '../../styles/global';
import PageTitle from '../../components/commons/PageTitle';
import {
  Conjunction,
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

  const planetSelector1Ref = useRef<SelectDropdown>(null);
  const planetSelector2Ref = useRef<SelectDropdown>(null);


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
      setLoadingConjunctions(true);
      setConjunctions(null);
      const separation = 1;

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

  const handleSearchButton = () => {
    if(!conjunctions) {
      searchConjunctions();
    }else{
      setSelectedPlanet1(null);
      setSelectedPlanet2(null);
      planetSelector1Ref.current?.reset()
      planetSelector2Ref.current?.reset()
      setConjunctions(null);
    }
  }


  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('transits.planetaryConjunction.title')}
        subtitle={i18n.t('transits.planetaryConjunction.subtitle')}
      />
      <View style={globalStyles.screens.separator} />
      <View style={planetaryConjunctionStyles.content}>

        <Text style={planetaryConjunctionStyles.content.parameters.text}>1. Sélectionnez deux planètes</Text>
        <View style={planetaryConjunctionStyles.content.parameters}>
          <View style={planetaryConjunctionStyles.content.row}>
            <SelectDropdown
              ref={planetSelector1Ref}
              data={planetsList}
              onSelect={(selectedFirstPlanet) => {
                setSelectedPlanet1(selectedFirstPlanet.object ? selectedFirstPlanet.object : null);
              }}
              renderButton={(selectedFirstPlanet, isOpened: boolean) => {
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
                      <Text style={planetaryConjunctionStyles.content.parameters.dropdown.text}>Planète 1</Text>
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
              ref={planetSelector2Ref}
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
                      <Text style={planetaryConjunctionStyles.content.parameters.dropdown.text}>Planète 2</Text>
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
          <Text style={[planetaryConjunctionStyles.content.parameters.text, {borderTopWidth: 1, borderTopColor: app_colors.white_forty, paddingTop: 5, marginTop: 10}]}>2. Sélectionnez un intervalle</Text>
          <View style={planetaryConjunctionStyles.content.row}>
            <Text style={planetaryConjunctionStyles.content.parameters.text}>Entre le</Text>
            <SimpleButton
              text={dayjs(startDate).format('DD MMM YYYY')}
              activeBorderColor={app_colors.white_twenty}
              onPress={() => setIsStartDateModalVisible(true)}
              active
              textColor={app_colors.white}
            />
            <Text style={planetaryConjunctionStyles.content.parameters.text}>et le</Text>
            <SimpleButton
              text={dayjs(endDate).format('DD MMM YYYY')}
              activeBorderColor={app_colors.white_twenty}
              onPress={() => setIsEndDateModalVisible(true)}
              active
              textColor={app_colors.white}
            />
          </View>
          <Text style={[planetaryConjunctionStyles.content.parameters.text, {borderTopWidth: 1, borderTopColor: app_colors.white_forty, paddingTop: 5, marginTop: 10}]}>3. Séparation angulaire max</Text>
          <View style={planetaryConjunctionStyles.content.row}>
            <Text style={planetaryConjunctionStyles.content.parameters.text}>Entre le</Text>
            <SimpleButton
              text={dayjs(startDate).format('DD MMM YYYY')}
              activeBorderColor={app_colors.white_twenty}
              onPress={() => setIsStartDateModalVisible(true)}
              active
              textColor={app_colors.white}
            />
            <Text style={planetaryConjunctionStyles.content.parameters.text}>et le</Text>
            <SimpleButton
              text={dayjs(endDate).format('DD MMM YYYY')}
              activeBorderColor={app_colors.white_twenty}
              onPress={() => setIsEndDateModalVisible(true)}
              active
              textColor={app_colors.white}
            />
          </View>
          <View style={planetaryConjunctionStyles.content.row}>
            <SimpleButton
              text={conjunctions ? "Supprimer la recherche" : "Rechercher"}
              onPress={() => {
                handleSearchButton()
              }}
              backgroundColor={app_colors.white}
              textColor={app_colors.black}
              fullWidth
              small
              align={"center"}
              icon={require('../../../assets/icons/FiSearch.png')}
              iconColor={app_colors.black}
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
          loadingConjunctions && <ActivityIndicator size='large' color={app_colors.white} />
        }


        {
          !loadingConjunctions && conjunctions && (
            <View style={{borderTopWidth: 1, borderTopColor: app_colors.white_twenty, paddingTop: 5}}>
              <Text style={[planetaryConjunctionStyles.content.parameters.text, {marginBottom: 10, fontFamily: 'GilroyBlack', textTransform: 'uppercase'}]}>Prochaine conjonction</Text>
              <ConjunctionCard conjunction={conjunctions} />
            </View>
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
