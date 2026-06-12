import React, {useMemo, useState} from 'react';
import {KeyboardAvoidingView, Modal, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {globalStyles} from "../../styles/global";
import {i18n} from "../../helpers/scripts/i18n";
import {observationPlannerScreenStyles} from "../../styles/screens/observationPlanner/observationPlannerScreen";
import {useTranslation} from "../../hooks/useTranslation";
import {useSettings} from "../../contexts/AppSettingsContext";
import {useSolarSystem} from "../../contexts/SolarSystemContext";
import {useStarCatalog} from "../../contexts/StarsContext";
import {routes} from "../../helpers/routes";
import { capitalize } from '../../helpers/scripts/utils/formatters/capitalize';
import { app_colors, storageKeys } from '../../helpers/constants';
import { ObservationPlannerParams, planObservationNight, PlannerResult } from '../../helpers/scripts/astro/planner/observationPlanner';
import { showToast } from '../../helpers/scripts/showToast';
import { useDsoCatalog } from '../../contexts/DSOContext';
import { ObservationPlannerModalContent } from '../../helpers/types/observationPlanner/ObservationPlannerModalContent';
import { getSunData } from '../../helpers/scripts/astro/solar/sunData';
import { ObservationPlannerObjectCard } from '../../components/cards/ObservationPlannerObjectCard';
import dayjs, {Dayjs} from "dayjs";
import PageTitle from "../../components/commons/PageTitle";
import SimpleButton from '../../components/commons/buttons/SimpleButton';
import DateTimePickerModal from '../../components/commons/DateTimePickerModal';
import InputWithIcon from '../../components/forms/InputWithIcon';
import { getData, storeData } from '../../helpers/storage';
import { DeviceEventEmitter } from 'react-native';
import ToolButton from '../../components/commons/buttons/ToolButton';

function ObservationPlannerScreen({navigation}: any) {
  const { currentLocale } = useTranslation();
  const { currentUserLocation } = useSettings();
  const { planets } = useSolarSystem();
  const { starsCatalog } = useStarCatalog();
  const { dsoCatalog } = useDsoCatalog();

  const [isPlanning, setIsPlanning] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<ObservationPlannerModalContent | null>(null);

  // Gestion des dates de début et de fin de la session d'observation
  const [startDate, setStartDate] = useState<Dayjs>(dayjs());
  const [startTime, setStartTime] = useState<string>(dayjs().add(1, 'hour').startOf('hour').format('HH:mm'));
  const [showStartPicker, setShowStartPicker] = useState<boolean>(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState<boolean>(false);
  const [endDate, setEndDate] = useState<Dayjs>(dayjs().add(3, 'hour'));
  const [endTime, setEndTime] = useState<string>(dayjs().add(3, 'hour').startOf('hour').format('HH:mm'));
  const [showEndDatePicker, setShowEndDatePicker] = useState<boolean>(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState<boolean>(false);
  const [dsoEnabled, setDsoEnabled] = useState<boolean>(true);
  const [dsoGalaxies, setDsoGalaxies] = useState<boolean>(true);
  const [dsoNebulae, setDsoNebulae] = useState<boolean>(true);
  const [dsoGlobularClusters, setDsoGlobularClusters] = useState<boolean>(true);
  const [dsoOpenClusters, setDsoOpenClusters] = useState<boolean>(true);
  const [starsEnabled, setStarsEnabled] = useState<boolean>(false);
  const [planetsEnabled, setPlanetsEnabled] = useState<boolean>(true);

  // Gestion des autres filtres pour l'étape 3
  // Magnitude
  const [minMag, setMinMag] = useState<number | null>(null);
  const [maxMag, setMaxMag] = useState<number | null>(null);
  // Altitude 
  const [minAlt, setMinAlt] = useState<number | null>(null);
  const [maxAlt, setMaxAlt] = useState<number | null>(null);

  // Paramètres et état de la recherche
  const [maxResults, setMaxResults] = useState<number | null>(null);
  const [perObjectObsTime, setPerObjectObsTime] = useState<number | null>(null);
  const [resultsList, setResultsList] = useState<PlannerResult[] | null>(null);

  type SortKey = 'settingTime' | 'risingTime' | 'magnitude' | 'altitude';
  const [sortBy, setSortBy] = useState<SortKey>('settingTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedResults = useMemo(() => {
    if (!resultsList) return null;
    return [...resultsList].sort((a, b) => {
      let valA: number;
      let valB: number;
      switch (sortBy) {
        case 'settingTime': valA = a.settingMinute; valB = b.settingMinute; break;
        case 'risingTime':  valA = a.risingMinute;  valB = b.risingMinute;  break;
        case 'magnitude':   valA = a.magnitude ?? Number.POSITIVE_INFINITY; valB = b.magnitude ?? Number.POSITIVE_INFINITY; break;
        case 'altitude':    valA = a.currentAlt;    valB = b.currentAlt;    break;
        default:            valA = a.settingMinute; valB = b.settingMinute;
      }
      const aInf = !Number.isFinite(valA);
      const bInf = !Number.isFinite(valB);
      if (aInf && bInf) return 0;
      if (aInf) return 1;
      if (bInf) return -1;
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });
  }, [resultsList, sortBy, sortOrder]);

  const handleSortPress = (key: SortKey) => {
    if (sortBy === key) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortOrder(key === 'altitude' ? 'desc' : 'asc');
    }
  };

  const checkVisibility = () => {
    // Check if sun is below horizon at the start date/time
    const startDateTime = startDate
      .hour(Number(startTime.split(':')[0]))
      .minute(Number(startTime.split(':')[1]));
    const ephemeris = getSunData(startDateTime, { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon });
    if(ephemeris.visibility.isCurrentlyVisible) {
      setModalVisible(true);
      setModalContent({
        type: 'warn',
        title: i18n.t('observationPlanner.screen.modal.sunAboveHorizon.title'),
        text: i18n.t('observationPlanner.screen.modal.sunAboveHorizon.text'),
        buttons: [
          {
            backgroundColor: app_colors.black,
            foregroundColor: app_colors.white,
            borderColor: app_colors.white_twenty,
            label: i18n.t('observationPlanner.screen.modal.sunAboveHorizon.cancel'),
            onPress: () => setModalVisible(false),
          },
          {
            label: i18n.t('observationPlanner.screen.modal.sunAboveHorizon.continue'),
            onPress: () => {
              setModalVisible(false);
              handleSearch();
            },
            backgroundColor: app_colors.white,
            foregroundColor: app_colors.black,
            borderColor: app_colors.white
          },
        ]
      });
    }else{
      handleSearch();
    }
  }

  const incrementSearchCounter = async () => {
    try {
      const existing = await getData(storageKeys.dashboardPlannerSearches);
      const current = existing ? parseInt(existing, 10) || 0 : 0;
      await storeData(storageKeys.dashboardPlannerSearches, String(current + 1));
      DeviceEventEmitter.emit('dashboardRefresh');
    } catch (error) {
      console.warn('[ObservationPlanner] Unable to increment search counter', error);
    }
  };

  const handleSearch = async () => {
    setIsPlanning(true);
    setResultsList(null);
    try {
      await incrementSearchCounter();

      const observationParams: ObservationPlannerParams = {
        maxResults,
        dsoCatalog,
        starsCatalog,
        planetsCatalog: planets,
        perObjectObsTime,
        locale: currentLocale,
        location: { latitude: currentUserLocation.lat, longitude: currentUserLocation.lon },
        date: {
          start: startDate, // Date only
          end: endDate, // Date only
          startTime: startDate.hour(Number(startTime.split(':')[0])).minute(Number(startTime.split(':')[1])), // Date with time
          endTime: endDate.hour(Number(endTime.split(':')[0])).minute(Number(endTime.split(':')[1])), // Date with time
        },
        objects: {
          dso: dsoEnabled,
          planets: planetsEnabled,
          stars: starsEnabled
        },
        dsoSubTypes: {
          galaxies: dsoGalaxies,
          nebulae: dsoNebulae,
          globularClusters: dsoGlobularClusters,
          openClusters: dsoOpenClusters,
        },
        magnitude: {
          min: minMag || -30,
          max: maxMag || 10
        },
        altitude: {
          min: minAlt,
          max: maxAlt
        },
      }

      const observations = await planObservationNight(observationParams);
      setResultsList(observations);
    } catch (error) {
      console.error("Error during observation planning:", error);
      showToast({message: i18n.t('observationPlanner.screen.errors.planning'), type: 'error'});
    } finally {
      setIsPlanning(false);
    }
  }


  return (
    <KeyboardAvoidingView
      style={{flex: 1, backgroundColor: app_colors.black}}
      behavior='padding'
    >
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('home.buttons.observationPlanner.title')}
        subtitle={i18n.t('home.buttons.observationPlanner.subtitle')}
        backRoute={routes.home.path}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{paddingBottom: 32, flexGrow: 1}}
      >
        {/* MODAL */}
        <Modal visible={modalVisible} transparent animationType='fade'>
          <View style={observationPlannerScreenStyles.modal}>
            {
              modalContent && (
                <View style={observationPlannerScreenStyles.modal.content}>
                  <Text style={{...observationPlannerScreenStyles.content.bloc.title, textAlign: 'center', marginBottom: 15, color: modalContent.type === 'error' ? 'red' : modalContent.type === 'warn' ? 'orange' : 'blue'}}>{modalContent.title}</Text>
                  <Text style={{...observationPlannerScreenStyles.content.bloc.subtitle, textAlign: 'center', marginBottom: 25, color: app_colors.white}}>{modalContent.text}</Text>
                  
                  <View style={observationPlannerScreenStyles.modal.buttons}>
                    {
                      modalContent.buttons.map((button, index) => (
                        <SimpleButton
                          active
                          activeBorderColor={button.borderColor}
                          key={index}
                          text={button.label}
                          onPress={button.onPress}
                          backgroundColor={button.backgroundColor}
                          textColor={button.foregroundColor}
                          iconColor={button.foregroundColor}
                          align='center'
                          width='30%'
                          textAdditionalStyles={{fontFamily: 'GilroyBlack'}}
                        />
                      ))
                    }
                  </View>
                </View>
              )
            }
          </View>
        </Modal>


        {/* PAGE CONTENT */}
        <View style={observationPlannerScreenStyles.content}>
          
          {/* TEMPORAL BLOC */}
          <View style={observationPlannerScreenStyles.content.bloc}>
            <Text style={observationPlannerScreenStyles.content.bloc.title}>{i18n.t('observationPlanner.screen.steps.sessionDuration')}</Text>

            <DateTimePickerModal
              visible={showStartPicker}
              mode='date'
              value={startDate.toDate()}
              onCancel={() => setShowStartPicker(false)}
              onConfirm={(selectedDate) => {
                setShowStartPicker(false)
                setStartDate(dayjs(selectedDate))
                if (dayjs(selectedDate).isAfter(endDate)) {
                  const [startHour, startMinute] = startTime.split(':').map(Number);
                  const newEndTime = dayjs(selectedDate).hour(startHour).minute(startMinute).add(3, 'hour');
                  setEndDate(dayjs(selectedDate));
                  setEndTime(newEndTime.format('HH:mm'));
                }
              }}
            />

            <DateTimePickerModal
              visible={showStartTimePicker}
              mode='time'
              value={startDate.toDate()}
              onCancel={() => setShowStartTimePicker(false)}
              onConfirm={(selectedDate) => {
                setShowStartTimePicker(false)
                setStartTime(dayjs(selectedDate).format('HH:mm'))
                const startDateTime = startDate.hour(Number(dayjs(selectedDate).format('HH'))).minute(Number(dayjs(selectedDate).format('mm')));
                const endDateTime = endDate.hour(Number(endTime.split(':')[0])).minute(Number(endTime.split(':')[1]));
                if (startDate.isSame(endDate, 'day') && startDateTime.isAfter(endDateTime)) {
                  setEndTime(startDateTime.add(3, 'hour').format('HH:mm'));
                }
              }}
            />

            <DateTimePickerModal
              visible={showEndDatePicker}
              mode='date'
              value={endDate.toDate()}
              onCancel={() => setShowEndDatePicker(false)}
              onConfirm={(selectedDate) => {
                setShowEndDatePicker(false)
                setEndDate(dayjs(selectedDate))
                if (dayjs(selectedDate).isBefore(startDate)) {
                  const [endHour, endMinute] = endTime.split(':').map(Number);
                  const newStartTime = dayjs(selectedDate).hour(endHour).minute(endMinute).subtract(3, 'hour');
                  setStartDate(dayjs(selectedDate));
                  setStartTime(newStartTime.format('HH:mm'));
                }
              }}
            />

            <DateTimePickerModal
              visible={showEndTimePicker}
              mode='time'
              value={endDate.toDate()}
              onCancel={() => setShowEndTimePicker(false)}
              onConfirm={(selectedDate) => {
                setShowEndTimePicker(false)
                setEndTime(dayjs(selectedDate).format('HH:mm'))
                const startDateTime = startDate.hour(Number(startTime.split(':')[0])).minute(Number(startTime.split(':')[1]));
                const endDateTime = endDate.hour(Number(dayjs(selectedDate).format('HH'))).minute(Number(dayjs(selectedDate).format('mm')));
                if (endDate.isSame(startDate, 'day') && endDateTime.isBefore(startDateTime)) {
                  const adjustedStart = endDateTime.subtract(3, 'hour');
                  setStartTime(adjustedStart.format('HH:mm'));
                  if (!adjustedStart.isSame(startDate, 'day')) {
                    setStartDate(adjustedStart.startOf('day'));
                  }
                }
              }}
            />
            

            <View>
              <Text style={observationPlannerScreenStyles.content.bloc.subtitle}>{i18n.t('observationPlanner.screen.labels.startDateTime')}</Text>
              <View style={observationPlannerScreenStyles.content.row}>
                <SimpleButton
                  icon={require('../../../assets/icons/FiCalendar.png')}
                  text={capitalize(startDate.format('ddd DD MMM YYYY'))}
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
              <Text style={observationPlannerScreenStyles.content.bloc.subtitle}>{i18n.t('observationPlanner.screen.labels.endDateTime')}</Text>
              <View style={observationPlannerScreenStyles.content.row}>
                <SimpleButton
                  icon={require('../../../assets/icons/FiCalendar.png')}
                  text={capitalize(endDate.format('ddd DD MMM YYYY'))}
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
            <Text style={observationPlannerScreenStyles.content.bloc.title}>{i18n.t('observationPlanner.screen.steps.objectTypes')}</Text>

            <ToolButton isChecked={planetsEnabled} onPress={() => setPlanetsEnabled(!planetsEnabled)} hasCheckbox icon={require('../../../assets/icons/astro/planets/color/JUPITER.png')} text={i18n.t('observationPlanner.filters.targets.planets')} />
            <ToolButton isChecked={dsoEnabled} onPress={() => setDsoEnabled(!dsoEnabled)} hasCheckbox icon={require('../../../assets/icons/astro/CL+N.png')} text={i18n.t('observationPlanner.filters.targets.dso')} />
            {dsoEnabled && (
              <View style={{ paddingLeft: 16, gap: 4 }}>
                <ToolButton isChecked={dsoGalaxies} onPress={() => setDsoGalaxies(!dsoGalaxies)} hasCheckbox icon={require('../../../assets/icons/astro/G.png')} text={i18n.t('observationPlanner.filters.dsoTypes.galaxies')} />
                <ToolButton isChecked={dsoNebulae} onPress={() => setDsoNebulae(!dsoNebulae)} hasCheckbox icon={require('../../../assets/icons/astro/NEB.png')} text={i18n.t('observationPlanner.filters.dsoTypes.nebulae')} />
                <ToolButton isChecked={dsoGlobularClusters} onPress={() => setDsoGlobularClusters(!dsoGlobularClusters)} hasCheckbox icon={require('../../../assets/icons/astro/GCL.png')} text={i18n.t('observationPlanner.filters.dsoTypes.globularClusters')} />
                <ToolButton isChecked={dsoOpenClusters} onPress={() => setDsoOpenClusters(!dsoOpenClusters)} hasCheckbox icon={require('../../../assets/icons/astro/OCL.png')} text={i18n.t('observationPlanner.filters.dsoTypes.openClusters')} />
              </View>
            )}
            <ToolButton isChecked={starsEnabled} onPress={() => setStarsEnabled(!starsEnabled)} hasCheckbox icon={require('../../../assets/icons/astro/BRIGHTSTAR.png')} text={i18n.t('observationPlanner.filters.targets.stars')} />
          </View>

          {/* OTHER FILTERS */}
          <View style={observationPlannerScreenStyles.content.bloc}>
            <Text style={observationPlannerScreenStyles.content.bloc.title}>{i18n.t('observationPlanner.screen.steps.otherFilters')}</Text>

            <Text style={observationPlannerScreenStyles.content.bloc.subtitle}>{i18n.t('observationPlanner.screen.labels.magnitude')}</Text>
            <View style={observationPlannerScreenStyles.content.row}>
              <InputWithIcon type='number' value={minMag ? minMag.toString() : undefined} placeholder={i18n.t('observationPlanner.screen.placeholders.minMag')} changeEvent={(value) => setMinMag(parseInt(value))} additionalStyles={{marginVertical: 0}} />
              <InputWithIcon type='number' value={maxMag ? maxMag.toString() : undefined} placeholder={i18n.t('observationPlanner.screen.placeholders.maxMag')} changeEvent={(value) => setMaxMag(parseInt(value))} additionalStyles={{marginVertical: 0}} />
            </View>
            
            <Text style={observationPlannerScreenStyles.content.bloc.subtitle}>{i18n.t('observationPlanner.screen.labels.altitude')}</Text>
            <View style={observationPlannerScreenStyles.content.row}>
              <InputWithIcon type='number' value={minAlt ? minAlt.toString() : undefined} placeholder={i18n.t('observationPlanner.screen.placeholders.minAlt')} changeEvent={(value) => setMinAlt(parseInt(value))} additionalStyles={{marginVertical: 0}} />
              <InputWithIcon type='number' value={maxAlt ? maxAlt.toString() : undefined} placeholder={i18n.t('observationPlanner.screen.placeholders.maxAlt')} changeEvent={(value) => setMaxAlt(parseInt(value))} additionalStyles={{marginVertical: 0}} />
            </View>

            <Text style={observationPlannerScreenStyles.content.bloc.subtitle}>{i18n.t('observationPlanner.screen.labels.maxResults')}</Text>
            <View style={observationPlannerScreenStyles.content.row}>
              <InputWithIcon type='number' value={maxResults ? maxResults.toString() : undefined} placeholder={i18n.t('observationPlanner.screen.placeholders.maxResults')} changeEvent={(value) => setMaxResults(parseInt(value))} additionalStyles={{marginVertical: 0}} />
              {/* <InputWithIcon type='number' value={maxAlt ? maxAlt.toString() : undefined} placeholder='Alt max (°)' changeEvent={(value) => setMaxAlt(parseInt(value))} additionalStyles={{marginVertical: 0}} /> */}
            </View>

            <Text style={observationPlannerScreenStyles.content.bloc.subtitle}>{i18n.t('observationPlanner.screen.labels.perObjectTime')}</Text>
            <View style={observationPlannerScreenStyles.content.row}>
              <InputWithIcon
                type='number'
                value={perObjectObsTime ? perObjectObsTime.toString() : undefined}
                placeholder={i18n.t('observationPlanner.screen.placeholders.perObjectTime')}
                changeEvent={(value) => setPerObjectObsTime(parseInt(value) || 5)}
                additionalStyles={{marginVertical: 0}}
              />
            </View>
          </View>

          {/* RESULTS */}
          {
            !resultsList && (
              <SimpleButton
                icon={require('../../../assets/icons/FiSearch.png')}
                text={i18n.t('observationPlanner.screen.buttons.search')}
                onPress={() => checkVisibility()}
                backgroundColor={app_colors.white}
                textColor={app_colors.black}
                iconColor={app_colors.black}
                fullWidth
                loading={isPlanning}
                align='center'
                textAdditionalStyles={{fontFamily: 'GilroyBlack'}}
              />
            )
          }
          {
            resultsList && resultsList.length === 0 && (
              <View style={observationPlannerScreenStyles.content.bloc}>
                <Text style={observationPlannerScreenStyles.content.bloc.title}>{i18n.t('observationPlanner.screen.steps.results')}</Text>
                
                <Text style={observationPlannerScreenStyles.content.bloc.subtitle}>{i18n.t('observationPlanner.screen.messages.empty')}</Text>

                <SimpleButton
                  icon={require('../../../assets/icons/FiTrash.png')}
                  text={i18n.t('observationPlanner.screen.buttons.clear')}
                  onPress={() => setResultsList(null)}
                  backgroundColor={app_colors.red_eighty}
                  textColor={app_colors.white}
                  iconColor={app_colors.white}
                  fullWidth
                  loading={isPlanning}
                  align='center'
                  textAdditionalStyles={{fontFamily: 'GilroyBlack'}}
                />
              </View>
            )
          }
          {
            sortedResults && sortedResults.length > 0 && (
              <View style={observationPlannerScreenStyles.content.bloc}>
                <Text style={observationPlannerScreenStyles.content.bloc.title}>{i18n.t('observationPlanner.screen.steps.results')}</Text>
                <Text style={observationPlannerScreenStyles.content.bloc.subtitle}>{i18n.t('observationPlanner.screen.messages.recommended')}</Text>

                {/* Sort chips */}
                <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 8}}>
                  {(['settingTime', 'risingTime', 'magnitude', 'altitude'] as const).map(key => {
                    const isActive = sortBy === key;
                    return (
                      <TouchableOpacity
                        key={key}
                        onPress={() => handleSortPress(key)}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 6,
                          borderRadius: 20,
                          borderWidth: 1,
                          borderColor: isActive ? app_colors.white : app_colors.white_twenty,
                          backgroundColor: isActive ? app_colors.white_twenty : 'transparent',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <Text style={{color: isActive ? app_colors.white : app_colors.white_sixty, fontSize: 11, fontFamily: 'GilroyBold'}}>
                          {i18n.t(`observationPlanner.screen.sort.${key}`)}
                        </Text>
                        {isActive && (
                          <Text style={{color: app_colors.white, fontSize: 11}}>
                            {sortOrder === 'asc' ? '↑' : '↓'}
                          </Text>
                        )}
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {
                  sortedResults.slice(0, maxResults || 10).map((result, index) => (
                    <ObservationPlannerObjectCard key={index} object={result.object} navigation={navigation} date={startDate.hour(Number(startTime.split(':')[0])).minute(Number(startTime.split(':')[1]))} />
                  ))
                }

                <View style={{marginTop: 10, gap: 10}}>
                  <SimpleButton
                    icon={require('../../../assets/icons/FiSearch.png')}
                    text={i18n.t('observationPlanner.screen.buttons.searchAgain')}
                    onPress={() => checkVisibility()}
                    backgroundColor={app_colors.white}
                    textColor={app_colors.black}
                    iconColor={app_colors.black}
                    fullWidth
                    loading={isPlanning}
                    align='center'
                    textAdditionalStyles={{fontFamily: 'GilroyBlack'}}
                  />

                  <SimpleButton
                    icon={require('../../../assets/icons/FiTrash.png')}
                    text={i18n.t('observationPlanner.screen.buttons.clear')}
                    onPress={() => setResultsList(null)}
                    backgroundColor={app_colors.red_eighty}
                    textColor={app_colors.white}
                    iconColor={app_colors.white}
                    fullWidth
                    loading={isPlanning}
                    align='center'
                    textAdditionalStyles={{fontFamily: 'GilroyBlack'}}
                  />
                </View>
              </View>
            )
          }
        </View>
      </ScrollView>
    </View>
    </KeyboardAvoidingView>
  );
}

export default ObservationPlannerScreen;
