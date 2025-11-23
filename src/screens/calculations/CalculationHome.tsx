import React, {useEffect, useState} from "react";
import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import PageTitle from "../../components/commons/PageTitle";
import {i18n} from "../../helpers/scripts/i18n";
import {globalStyles} from "../../styles/global";
import {calculationHomeStyles} from "../../styles/screens/calculations/home";
import InputWithIcon from "../../components/forms/InputWithIcon";
import {showToast} from "../../helpers/scripts/showToast";
import MathComponent from "../../components/MathComponent";
import SimpleButton from "../../components/commons/buttons/SimpleButton";
import {app_colors} from "../../helpers/constants";
import {calculateFD} from "../../helpers/scripts/math/calculateFD";
import {calculateMagnification} from "../../helpers/scripts/math/calculateMagnification";
import {calculateMinMagnification} from "../../helpers/scripts/math/calculateMinMagnification";
import {calculateSampling} from "../../helpers/scripts/math/calculateSampling";
import {calculateApparentFov} from "../../helpers/scripts/math/calculateApparentFov";
import {routes} from "../../helpers/routes";
import {useSettings} from "../../contexts/AppSettingsContext";
import {useAuth} from "../../contexts/AuthContext";
import {useTranslation} from "../../hooks/useTranslation";
import {sendAnalyticsEvent} from "../../helpers/scripts/analytics";
import {eventTypes} from "../../helpers/constants/analytics";
import { calculateExitPupil } from "../../helpers/scripts/math/calculateExitPupil";
import { calculateResolvingPower } from "../../helpers/scripts/math/calculateResolvingPower";

export default function CalculationHome({ navigation }: any) {

  const { currentUserLocation } = useSettings();
  const { currentUser } = useAuth()
  const { currentLocale } = useTranslation()

  const [focalLengthInput, setFocalLengthInput] = useState<string>('');
  const [focalUnit, setFocalUnit] = useState<'mm' | 'inch'>('mm');
  const [diameter, setDiameter] = useState<number | undefined>(undefined);
  const [eyepieceFocalLength, setEyepieceFocalLength] = useState<number | undefined>(undefined);
  const [eyepieceField, setEyepieceField] = useState<number | undefined>(undefined);
  const [pixelSize, setPixelSize] = useState<string | undefined>(undefined);
  const [selectedPupil, setSelectedPupil] = useState<5 | 6 | 7>(6);

  const [fD, setFD] = useState<string | undefined>(undefined);
  const [magnification, setMagnification] = useState<string | undefined>(undefined);
  const [minMagnification, setMinMagnification] = useState<string | undefined>(undefined);
  const [sampling, setSampling] = useState<string | undefined>(undefined);
  const [fov, setFov] = useState<string | undefined>(undefined);
  const [exitPupil, setExitPupil] = useState<string | undefined>(undefined);
  const [resolvingPower, setResolvingPower] = useState<string | undefined>(undefined);


  useEffect(() => {
    sendAnalyticsEvent(currentUser, currentUserLocation, 'Calculations screen view', eventTypes.SCREEN_VIEW, {}, currentLocale)
  }, []);

  const t = (path: string, params?: Record<string, any>) => i18n.t(`calculations.home.${path}`, params);

  const computeCalculations = () => {
    const parsedFocalInput = focalLengthInput ? parseFloat(focalLengthInput.replace(',', '.')) : undefined;
    const focalLength = parsedFocalInput ? (focalUnit === 'mm' ? parsedFocalInput : parsedFocalInput * 25.4) : undefined;

    if(!focalLength && !diameter && !eyepieceFocalLength && !pixelSize){
      showToast({message: t('actions.missingValues'), type: "error"});
      return;
    }

    setFD(calculateFD(focalLength, diameter));
    setMagnification(calculateMagnification(focalLength, eyepieceFocalLength));
    setMinMagnification(calculateMinMagnification(diameter, selectedPupil));
    setSampling(calculateSampling(focalLength, pixelSize));
    setFov(calculateApparentFov(focalLength, eyepieceFocalLength, eyepieceField));
    setExitPupil(calculateExitPupil(diameter, focalLength, eyepieceFocalLength));
    setResolvingPower(calculateResolvingPower(diameter));
  }

  const resetCalculations = () => {
    setFocalLengthInput('');
    setFocalUnit('mm');
    setDiameter(undefined);
    setEyepieceFocalLength(undefined);
    setEyepieceField(undefined);
    setPixelSize(undefined);
    setSelectedPupil(6);
    setFD(undefined);
    setMagnification(undefined);
    setMinMagnification(undefined);
    setSampling(undefined);
    setFov(undefined);
    setExitPupil(undefined);
    setResolvingPower(undefined);
  }

  const handlePixelSize = (e: string) => {
    const sanitized = e.replace(/,/g, '.').replace(/[^\d.]/g, '');
    setPixelSize(sanitized === '' ? undefined : sanitized)
  }

  const handleFocalLengthChange = (value: string) => {
    const sanitized = value.replace(/,/g, '.').replace(/[^\d.]/g, '');
    setFocalLengthInput(sanitized);
  };

  const handleUnitChange = (unit: 'mm' | 'inch') => {
    if(unit === focalUnit){
      return;
    }

    if(focalLengthInput){
      const parsedValue = parseFloat(focalLengthInput.replace(',', '.'));
      if(!isNaN(parsedValue)){
        const converted = focalUnit === 'mm' ? parsedValue / 25.4 : parsedValue * 25.4;
        const formatted = Number.isInteger(converted) ? converted.toString() : converted.toFixed(2).replace(/\.?0+$/, '');
        setFocalLengthInput(formatted);
      }
    }

    setFocalUnit(unit);
  }

  const handleDiameterChange = (value: string) => {
    const sanitized = value.replace(/,/g, '.').replace(/[^\d.]/g, '');
    setDiameter(sanitized === '' ? undefined : parseFloat(sanitized));
  };

  const handleEyepieceFocalLengthChange = (value: string) => {
    const sanitized = value.replace(/,/g, '.').replace(/[^\d.]/g, '');
    setEyepieceFocalLength(sanitized === '' ? undefined : parseFloat(sanitized));
  };

  const handleEyepieceFieldChange = (value: string) => {
    const sanitized = value.replace(/,/g, '.').replace(/[^\d.]/g, '');
    setEyepieceField(sanitized === '' ? undefined : parseFloat(sanitized));
  };

  const renderResultCard = (
    title: string,
    description: string,
    value: string | undefined,
    fallbackExpression: string,
    fallbackNote?: string,
  ) => (
    <View style={calculationHomeStyles.resultCard}>
      <Text style={calculationHomeStyles.resultTitle}>{title}</Text>
      <Text style={calculationHomeStyles.resultDescription}>{description}</Text>
      {
        value ?
          <MathComponent expression={value}/>
          :
          <View style={{gap: 6}}>
            <MathComponent expression={fallbackExpression}/>
            {fallbackNote && <Text style={calculationHomeStyles.resultDescription}>{fallbackNote}</Text>}
          </View>
      }
    </View>
  );

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('home.buttons.calculations.title')}
        subtitle={i18n.t('home.buttons.calculations.subtitle')}
        backRoute={routes.home.path}
      />
      <View style={globalStyles.screens.separator} />
      <ScrollView contentContainerStyle={{display: 'flex', flexDirection: 'column', gap: 16, paddingBottom: 100}}>
        <Text style={[calculationHomeStyles.content.description, {opacity: 1, fontFamily: 'GilroyRegular', fontSize: 15}]}>
          {t('intro')}
        </Text>

        <View style={calculationHomeStyles.sectionCard}>
          <View style={calculationHomeStyles.sectionHeader}>
            <Text style={calculationHomeStyles.sectionTitle}>{t('sections.instrument.title')}</Text>
            {/* <Text style={calculationHomeStyles.sectionSubtitle}>{t('sections.instrument.subtitle')}</Text> */}
          </View>
          <View>
            <View style={{display: 'flex', flexDirection: 'row', marginBottom: 10}}>
              <View style={{flex: 1, marginRight: 10}}>
                <Text style={calculationHomeStyles.label}>{t('sections.instrument.focalLabel')}</Text>
                <InputWithIcon
                  keyboardType={"numeric"}
                  additionalStyles={{marginVertical: 0}}
                  search={() => {}}
                  placeholder={t('sections.instrument.focalPlaceholder', { unit: t(`units.${focalUnit}`) })}
                  changeEvent={(e) => handleFocalLengthChange(e)}
                  value={focalLengthInput}
                  type={"number"}
                />
              </View>
              <View>
                <Text style={calculationHomeStyles.label}>{t('sections.instrument.unitLabel')}</Text>
                <View style={calculationHomeStyles.chipRow}>
                  {[
                    {label: t('units.mm'), value: 'mm'},
                    {label: t('units.inch'), value: 'inch'},
                  ].map((unit) => {
                    const isActive = focalUnit === unit.value;
                    return (
                      <TouchableOpacity
                        key={unit.value}
                        onPress={() => handleUnitChange(unit.value as 'mm' | 'inch')}
                        style={[calculationHomeStyles.chip, isActive && calculationHomeStyles.chipActive]}
                      >
                        <Text style={calculationHomeStyles.chipText}>{unit.label}</Text>
                      </TouchableOpacity>
                    )
                  })}
                </View>
              </View>
            </View>
            <View style={{flex: 1}}>
              <Text style={calculationHomeStyles.label}>{t('sections.instrument.diameterLabel')}</Text>
              <InputWithIcon keyboardType={"numeric"} additionalStyles={{marginVertical: 0}} search={() => {}} placeholder={t('sections.instrument.diameterLabel')} changeEvent={(e) => handleDiameterChange(e)} value={diameter ? diameter.toString() : ""} type={"number"}/>
            </View>
          </View>
        </View>

        <View style={calculationHomeStyles.sectionCard}>
          <View style={calculationHomeStyles.sectionHeader}>
            <Text style={calculationHomeStyles.sectionTitle}>{t('sections.eyepiece.title')}</Text>
            {/* <Text style={calculationHomeStyles.sectionSubtitle}>{t('sections.eyepiece.subtitle')}</Text> */}
          </View>
          <View style={calculationHomeStyles.row}>
            <View style={{flex: 1}}>
              <Text style={calculationHomeStyles.label}>{t('sections.eyepiece.focalLabel')}</Text>
              <InputWithIcon keyboardType={"numeric"} additionalStyles={{marginVertical: 0}} search={() => {}} placeholder={t('sections.eyepiece.focalPlaceholder')} changeEvent={(e) => handleEyepieceFocalLengthChange(e)} value={eyepieceFocalLength ? eyepieceFocalLength.toString() : ""} type={"number"}/>
            </View>
            <View style={{flex: 1}}>
              <Text style={calculationHomeStyles.label}>{t('sections.eyepiece.fieldLabel')}</Text>
              <InputWithIcon keyboardType={"numeric"} additionalStyles={{marginVertical: 0}} search={() => {}} placeholder={t('sections.eyepiece.fieldPlaceholder')} changeEvent={(e) => handleEyepieceFieldChange(e)} value={eyepieceField ? eyepieceField.toString() : ""} type={"number"}/>
            </View>
          </View>
        </View>

        <View style={calculationHomeStyles.sectionCard}>
          <View style={calculationHomeStyles.sectionHeader}>
            <Text style={calculationHomeStyles.sectionTitle}>{t('sections.camera.title')}</Text>
            {/* <Text style={calculationHomeStyles.sectionSubtitle}>{t('sections.camera.subtitle')}</Text> */}
          </View>
          <View style={calculationHomeStyles.row}>
            <View style={{flex: 1}}>
              <Text style={calculationHomeStyles.label}>{t('sections.camera.pixelLabel')}</Text>
              <InputWithIcon keyboardType={"default"} additionalStyles={{marginVertical: 0}} search={() => {}} placeholder={t('sections.camera.pixelPlaceholder')} changeEvent={(e) => handlePixelSize(e)} value={pixelSize ? pixelSize.toString() : ""} type={"text"}/>
            </View>
            <View style={{flex: 1}}>
              <Text style={calculationHomeStyles.label}>{t('sections.camera.exitPupilLabel')}</Text>
              <View style={calculationHomeStyles.chipRow}>
                {[5, 6, 7].map((pupilValue) => {
                  const isActive = selectedPupil === pupilValue;
                  return (
                    <TouchableOpacity
                      key={pupilValue}
                      onPress={() => setSelectedPupil(pupilValue as 5 | 6 | 7)}
                      style={[calculationHomeStyles.chip, isActive && calculationHomeStyles.chipActive]}
                    >
                      <Text style={calculationHomeStyles.chipText}>{pupilValue} mm</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>
          </View>
        </View>

        <View style={calculationHomeStyles.actionRow}>
          <SimpleButton
            text={t('actions.compute')}
            icon={require('../../../assets/icons/FiCpu.png')}
            backgroundColor={app_colors.white}
            textColor={app_colors.black}
            fullWidth
            small
            onPress={() => computeCalculations()}
            iconColor={app_colors.black}
            align={'center'}
          />
          {
            (fD || magnification || minMagnification || sampling) &&
              <SimpleButton
                text={t('actions.reset')}
                icon={require('../../../assets/icons/FiTrash.png')}
                backgroundColor={app_colors.white}
                textColor={app_colors.black}
                fullWidth
                small
                onPress={() => resetCalculations()}
                iconColor={app_colors.black}
                align={'center'}
              />
          }
        </View>

        <View style={calculationHomeStyles.sectionHeader}>
          <Text style={calculationHomeStyles.sectionTitle}>{t('sections.results.title')}</Text>
          <Text style={calculationHomeStyles.sectionSubtitle}>{t('sections.results.subtitle')}</Text>
        </View>

        <View style={calculationHomeStyles.resultGrid}>
          {renderResultCard(
            t('sections.results.cards.focalRatio.title'),
            t('sections.results.cards.focalRatio.description'),
            fD,
            `f/D = \\frac{F}{D}`,
            t('sections.results.cards.focalRatio.fallbackNote')
          )}
          {renderResultCard(
            t('sections.results.cards.magnification.title'),
            t('sections.results.cards.magnification.description'),
            magnification,
            `G = \\frac{F}{f}`,
            t('sections.results.cards.magnification.fallbackNote')
          )}
          {renderResultCard(
            t('sections.results.cards.minMagnification.title'),
            t('sections.results.cards.minMagnification.description'),
            minMagnification,
            `G_{min} = \\frac{D}{${selectedPupil}}`,
            t('sections.results.cards.minMagnification.fallbackNote', { pupil: selectedPupil })
          )}
          {renderResultCard(
            t('sections.results.cards.sampling.title'),
            t('sections.results.cards.sampling.description'),
            sampling,
            `S = \\frac{206.3 \\times p}{F}`,
            t('sections.results.cards.sampling.fallbackNote')
          )}
          {renderResultCard(
            t('sections.results.cards.fov.title'),
            t('sections.results.cards.fov.description'),
            fov,
            `FoV = \\frac{C}{G}`,
            t('sections.results.cards.fov.fallbackNote')
          )}
          {renderResultCard(
            t('sections.results.cards.exitPupil.title'),
            t('sections.results.cards.exitPupil.description'),
            exitPupil,
            `P = \\frac{D}{G}`,
            t('sections.results.cards.exitPupil.fallbackNote')
          )}
          {renderResultCard(
            t('sections.results.cards.resolvingPower.title'),
            t('sections.results.cards.resolvingPower.description'),
            resolvingPower,
            `Ps = \\frac{120}{D}`,
            t('sections.results.cards.resolvingPower.fallbackNote')
          )}
        </View>
      </ScrollView>
    </View>
  );
}
