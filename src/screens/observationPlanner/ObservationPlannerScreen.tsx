import React, {useEffect, useMemo, useState} from 'react';
import {ActivityIndicator, Platform, ScrollView, Text, TextInput, View} from "react-native";
import {globalStyles} from "../../styles/global";
import {i18n} from "../../helpers/scripts/i18n";
import {observationPlannerScreenStyles} from "../../styles/screens/observationPlanner/observationPlannerScreen";
import {useTranslation} from "../../hooks/useTranslation";
import {useSettings} from "../../contexts/AppSettingsContext";
import {useSolarSystem} from "../../contexts/SolarSystemContext";
import {useStarCatalog} from "../../contexts/StarsContext";
import {useSpot} from "../../contexts/ObservationSpotContext";
import {DSO} from "../../helpers/types/DSO";
import {Star} from "../../helpers/types/Star";
import {GlobalPlanet} from "../../helpers/types/GlobalPlanet";
import {routes} from "../../helpers/routes";
import { capitalize } from '../../helpers/scripts/utils/formatters/capitalize';
import { app_colors } from '../../helpers/constants';
import dayjs, {Dayjs} from "dayjs";
import PageTitle from "../../components/commons/PageTitle";
import SimpleButton from '../../components/commons/buttons/SimpleButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import BigButton from '../../components/commons/buttons/BigButton';
import InputWithIcon from '../../components/forms/InputWithIcon';


type PlannerFilters = {
  magnitudeLimit: number;
  minAltitude: number;
  maxSizeArcmin?: number | null;
  includePlanets: boolean;
  includeStars: boolean;
  includeDSO: boolean;
  fovWidth?: number | null; // in degrees
  fovHeight?: number | null; // in degrees
}

type NumericFilterKeys = 'magnitudeLimit' | 'minAltitude' | 'maxSizeArcmin' | 'fovWidth' | 'fovHeight';

type PlannedObject = {
  object: DSO | Star | GlobalPlanet;
  peakAltitude: number;
  peakAzimuth: number;
  peakTime: Dayjs;
  visibilityPercent: number;
  visibilityGraph: { altitudes: number[]; hours: string[] };
  magnitude?: number;
  angularSizeDeg?: number | null;
  fitsInFov?: boolean | null;
}

function ObservationPlannerScreen({navigation}: any) {
  const { currentLocale } = useTranslation();
  const { currentUserLocation } = useSettings();
  const { selectedSpot, defaultAltitude } = useSpot();
  const { planets } = useSolarSystem();
  const { starsCatalog, starCatalogLoading } = useStarCatalog();

  // Gestion des dates de début et de fin de la session d'observation
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [startTime, setStartTime] = useState<string>(dayjs().add(1, 'hour').startOf('hour').format('HH:mm'));
  const [showStartPicker, setShowStartPicker] = useState<boolean>(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState<boolean>(false);
  const [endDate, setEndDate] = useState<Dayjs>(dayjs().add(1, 'hour'));
  const [endTime, setEndTime] = useState<string>(dayjs().add(2, 'hour').startOf('hour').format('HH:mm'));
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState<boolean>(false);
  const [dsoEnabled, setDsoEnabled] = useState<boolean>(true);
  const [starsEnabled, setStarsEnabled] = useState<boolean>(true);
  const [planetsEnabled, setPlanetsEnabled] = useState<boolean>(true);

  // Gestion des autres filtres pour l'étape 3
  // Magnitude
  const [minMag, setMinMag] = useState<number>(12);
  const [maxMag, setMaxMag] = useState<number>(0);
  // Taille angulaire
  const [maxAngularSizeArcmin, setMaxAngularSizeArcmin] = useState<number>(60);
  const [minAngularSizeArcmin, setMinAngularSizeArcmin] = useState<number>(0);


  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('home.buttons.observationPlanner.title')}
        subtitle={i18n.t('home.buttons.observationPlanner.subtitle')}
        backRoute={routes.home.path}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView>
        <View style={observationPlannerScreenStyles.content}>
          
          {/* TEMPORAL BLOC */}
          <View style={observationPlannerScreenStyles.content.bloc}>
            <Text style={observationPlannerScreenStyles.content.bloc.title}>1. Durée de la session</Text>

            {
              showStartPicker && (
                <DateTimePicker
                  value={startDate.toDate()}
                  mode='date'
                  display='default'
                  themeVariant={'dark'}
                  onChange={(event, selectedDate) => {
                    if (event.type === 'dismissed') {
                      setShowStartPicker(false)
                    }
                    if (event.type === 'set' && selectedDate) {
                      console.log("Setting start date:", selectedDate);
                      
                      setShowStartPicker(false)
                      setStartDate(dayjs(selectedDate))

                      // If new start date is after end date, set end date to start date and endTime to startTime + 3h
                      if (dayjs(selectedDate).isAfter(endDate)) {
                        const newEndDate = dayjs(selectedDate);
                        const [startHour, startMinute] = startTime.split(':').map(Number);
                        const newEndTime = dayjs(selectedDate).hour(startHour).minute(startMinute).add(3, 'hour');
                        
                        setEndDate(newEndDate);
                        setEndTime(newEndTime.format('HH:mm'));
                      }
                    }
                  }}
                />
              )
            }

            {
              showStartTimePicker && (
                <DateTimePicker
                  value={startDate.toDate()}
                  mode='time'
                  display='default'
                  themeVariant={'dark'}
                  onChange={(event, selectedDate) => {
                    if (event.type === 'dismissed') {
                      setShowStartTimePicker(false)
                    }
                    if (event.type === 'set' && selectedDate) {
                      setShowStartTimePicker(false)
                      setStartTime(dayjs(selectedDate).format('HH:mm'))

                      // If new start time is after end time on the same day, adjust end time to +3H
                      const startDateTime = startDate.hour(Number(dayjs(selectedDate).format('HH'))).minute(Number(dayjs(selectedDate).format('mm')));
                      const endDateTime = endDate.hour(Number(endTime.split(':')[0])).minute(Number(endTime.split(':')[1]));
                      if (startDate.isSame(endDate) && startDateTime.isAfter(endDateTime)) {
                        const adjustedEndTime = startDateTime.add(3, 'hour');
                        setEndTime(adjustedEndTime.format('HH:mm'));
                      }
                    }
                  }}
                />
              )
            }

            {
              showEndDatePicker && (
                <DateTimePicker
                  value={endDate.toDate()}
                  mode='date'
                  display='default'
                  themeVariant={'dark'}
                  onChange={(event, selectedDate) => {
                    if (event.type === 'dismissed') {
                      setShowEndDatePicker(false)
                    }
                    if (event.type === 'set' && selectedDate) {
                      console.log("Setting end date:", selectedDate);
                      
                      setShowEndDatePicker(false)
                      setEndDate(dayjs(selectedDate))

                      // If new end date is before start date, set start date to end date and startTime to endTime - 3h
                      if (dayjs(selectedDate).isBefore(startDate)) {
                        const newStartDate = dayjs(selectedDate);
                        const [endHour, endMinute] = endTime.split(':').map(Number);
                        const newStartTime = dayjs(selectedDate).hour(endHour).minute(endMinute).subtract(3, 'hour');
                        
                        setStartDate(newStartDate);
                        setStartTime(newStartTime.format('HH:mm'));
                      }
                    }
                  }}
                />
              )
            }

            {
              showEndTimePicker && (
                <DateTimePicker
                  value={endDate.toDate()}
                  mode='time'
                  display='default'
                  themeVariant={'dark'}
                  onChange={(event, selectedDate) => {
                    if (event.type === 'dismissed') {
                      setShowEndTimePicker(false)
                    }
                    if (event.type === 'set' && selectedDate) {
                      setShowEndTimePicker(false)
                      setEndTime(dayjs(selectedDate).format('HH:mm'))

                      // If new end time is before start time on the same day, adjust start time to -3H
                      const startDateTime = startDate.hour(Number(startTime.split(':')[0])).minute(Number(startTime.split(':')[1]));
                      const endDateTime = endDate.hour(Number(dayjs(selectedDate).format('HH'))).minute(Number(dayjs(selectedDate).format('mm')));
                      if (endDate.isSame(startDate) && endDateTime.isBefore(startDateTime)) {
                        const adjustedStartTime = endDateTime.subtract(3, 'hour');
                        setStartTime(adjustedStartTime.format('HH:mm'));
                      }
                    }
                  }}
                />
              )
            }
            

            <View>
              <Text style={observationPlannerScreenStyles.content.bloc.subtitle}>Date et heure de début</Text>
              <View style={observationPlannerScreenStyles.content.row}>
                <SimpleButton
                  icon={require('../../../assets/icons/FiCalendar.png')}
                  text={capitalize(startDate.format('DD-MM-YYYY'))}
                  textColor={app_colors.white}
                  align='flex-start'
                  onPress={() => setShowStartPicker(true)}
                />
                <SimpleButton
                  icon={require('../../../assets/icons/FiClock.png')}
                  text={capitalize(startTime.replace(':', 'h'))}
                  textColor={app_colors.white}
                  align='flex-start'
                  onPress={() => setShowStartTimePicker(true)}
                />
              </View>
            </View>

            <View>
              <Text style={observationPlannerScreenStyles.content.bloc.subtitle}>Date et heure de fin</Text>
              <View style={observationPlannerScreenStyles.content.row}>
                <SimpleButton
                  icon={require('../../../assets/icons/FiCalendar.png')}
                  text={capitalize(endDate.format('DD-MM-YYYY'))}
                  textColor={app_colors.white}
                  align='flex-start'
                  onPress={() => setShowEndDatePicker(true)}
                />
                <SimpleButton
                  icon={require('../../../assets/icons/FiClock.png')}
                  text={capitalize(endTime.replace(':', 'h'))}
                  textColor={app_colors.white}
                  align='flex-start'
                  onPress={() => setShowEndTimePicker(true)}
                />
              </View>
            </View>
          </View>

          {/* FILTERS */}
          <View style={observationPlannerScreenStyles.content.bloc}>
            <Text style={observationPlannerScreenStyles.content.bloc.title}>2. Type d'objets</Text>

            <BigButton isChecked={planetsEnabled} onPress={() => setPlanetsEnabled(!planetsEnabled)} hasCheckbox icon={require('../../../assets/icons/astro/planets/color/JUPITER.png')} text='Planètes' />
            <BigButton isChecked={dsoEnabled} onPress={() => setDsoEnabled(!dsoEnabled)} hasCheckbox icon={require('../../../assets/icons/astro/CL+N.png')} text='Objets du ciel profond' />
            <BigButton isChecked={starsEnabled} onPress={() => setStarsEnabled(!starsEnabled)} hasCheckbox icon={require('../../../assets/icons/astro/BRIGHTSTAR.png')} text='Étoiles brillantes' />
          </View>

          {/* OTHER FILTERS */}
          <View style={observationPlannerScreenStyles.content.bloc}>
            <Text style={observationPlannerScreenStyles.content.bloc.title}>3. Autres filtres</Text>

            <Text style={observationPlannerScreenStyles.content.bloc.subtitle}>Magnitude</Text>
            <View style={observationPlannerScreenStyles.content.row}>
              <InputWithIcon type='number' value={minMag.toString()} placeholder='Mag min' changeEvent={(value) => setMinMag(parseInt(value))} />
              <InputWithIcon type='number' value={maxMag.toString()} placeholder='Mag max' changeEvent={(value) => setMaxMag(parseInt(value))} />
            </View>
            
            <Text style={observationPlannerScreenStyles.content.bloc.subtitle}>Magnitude</Text>
            <View style={observationPlannerScreenStyles.content.row}>
              {/* HERE GOES THE FIRST ROW OF FILTERS */}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default ObservationPlannerScreen;
