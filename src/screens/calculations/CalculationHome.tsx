import React, {useEffect, useRef, useState} from "react";
import {ScrollView, Text, TextInput, View} from "react-native";
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

  const [focalLength, setFocalLength] = useState<number | undefined>(undefined);
  const [diameter, setDiameter] = useState<number | undefined>(undefined);
  const [eyepieceFocalLength, setEyepieceFocalLength] = useState<number | undefined>(undefined);
  const [eyepieceField, setEyepieceField] = useState<number | undefined>(undefined);
  const [pixelSize, setPixelSize] = useState<string | undefined>(undefined);

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

  const computeCalculations = () => {
    if(!focalLength && !diameter && !eyepieceFocalLength && !pixelSize){
      showToast({message: "Veuillez renseigner au moins deux valeurs", type: "error"});
      return;
    }

    setFD(calculateFD(focalLength, diameter));
    setMagnification(calculateMagnification(focalLength, eyepieceFocalLength));
    setMinMagnification(calculateMinMagnification(diameter));
    setSampling(calculateSampling(focalLength, pixelSize));
    setFov(calculateApparentFov(focalLength, diameter, eyepieceField));
    setExitPupil(calculateExitPupil(diameter, focalLength, eyepieceFocalLength));
    setResolvingPower(calculateResolvingPower(diameter));
  }

  const resetCalculations = () => {
    setFocalLength(undefined);
    setDiameter(undefined);
    setEyepieceFocalLength(undefined);
    setPixelSize(undefined);
    setFD(undefined);
    setMagnification(undefined);
    setMinMagnification(undefined);
    setSampling(undefined);
    setFov(undefined);
    setExitPupil(undefined);
    setResolvingPower(undefined);
  }

  const handlePixelSize = (e: string) => {
    setPixelSize(e.replace(/[^\d.]/g, ''))
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title={i18n.t('home.buttons.calculations.title')}
        subtitle={i18n.t('home.buttons.calculations.subtitle')}
        backRoute={routes.home.path}
      />
      <View style={globalStyles.screens.separator} />
        <ScrollView contentContainerStyle={{display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 80}}>
          <View style={calculationHomeStyles.content}>
            <Text style={[calculationHomeStyles.content.description, {opacity: 1, fontFamily: 'GilroyRegular', fontSize: 15}]}>Entrez les informations dont vous disposez, le calculateur s'occupe du reste !</Text>

            <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
              <InputWithIcon keyboardType={"numeric"} additionalStyles={{marginVertical: 0}} search={() => {}} placeholder={"Focale télescope (mm)"} changeEvent={(e) => setFocalLength(parseInt(e))} value={focalLength ? focalLength.toString() : ""} type={"number"}/>
              <InputWithIcon keyboardType={"numeric"} additionalStyles={{marginVertical: 0}} search={() => {}} placeholder={"Diamètre télescope (mm)"} changeEvent={(e) => setDiameter(parseInt(e))} value={diameter ? diameter.toString() : ""} type={"number"}/>
            </View>
            <View style={{display: 'flex', flexDirection: 'row', gap: 10}}>
              <InputWithIcon keyboardType={"numeric"} additionalStyles={{marginVertical: 0}} search={() => {}} placeholder={"Focale oculaire (mm)"} changeEvent={(e) => setEyepieceFocalLength(parseInt(e))} value={eyepieceFocalLength ? eyepieceFocalLength.toString() : ""} type={"number"}/>
              <InputWithIcon keyboardType={"numeric"} additionalStyles={{marginVertical: 0}} search={() => {}} placeholder={"Champ oculaire (°)"} changeEvent={(e) => setEyepieceField(parseInt(e))} value={eyepieceField ? eyepieceField.toString() : ""} type={"number"}/>
            </View>
            <View style={{display: 'flex', flexDirection: 'row', gap: 10, width: '50%', paddingRight: 5}}>
              <InputWithIcon keyboardType={"default"} additionalStyles={{marginVertical: 0}} search={() => {}} placeholder={"Taille pixel caméra (µm)"} changeEvent={(e) => handlePixelSize(e)} value={pixelSize ? pixelSize.toString() : ""} type={"text"}/>
            </View>


            <SimpleButton
              text={"Calculer"}
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
                  text={"Effacer"}
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

            <View style={calculationHomeStyles.content.container}>
              <View>
                <Text style={calculationHomeStyles.content.title}>Rapport focale</Text>
                <Text style={calculationHomeStyles.content.description}>Permet de calculer le rapport f/D d'un instrument optique.</Text>
              </View>
              {
                fD ?
                <MathComponent expression={fD}/>
                :
                <View>
                  <MathComponent expression={`f/D = \\frac{F}{D}`}/>
                  <Text style={calculationHomeStyles.content.description}>F = focale instrument et D = diamètre instrument</Text>
                </View>
              }
            </View>

            <View style={calculationHomeStyles.content.container}>
              <View>
                <Text style={calculationHomeStyles.content.title}>Grossissement</Text>
                <Text style={calculationHomeStyles.content.description}>Permet de connaître le grossissement obtenu avec un oculaire donné.</Text>
              </View>
              {
                magnification ?
                <MathComponent expression={magnification}/>
                :
                <View>
                  <MathComponent expression={`G = \\frac{F}{f}`} />
                  <Text style={calculationHomeStyles.content.description}>F = focale instrument et f = focale oculaire</Text>
                </View>
              }
            </View>

            <View style={calculationHomeStyles.content.container}>
              <View>
                <Text style={calculationHomeStyles.content.title}>Grossissement minimum</Text>
                <Text style={calculationHomeStyles.content.description}>Indique le grossissement minimum pour une pupille de sortie optimale selon l'instrument.</Text>
              </View>
              {
                minMagnification ?
                <MathComponent expression={minMagnification}/>
                :
                <View>
                  <MathComponent expression={`G_{min} = \\frac{D}{7}`} />
                  <Text style={calculationHomeStyles.content.description}>D = diamètre instrument</Text>
                </View>
              }
            </View>

            <View style={calculationHomeStyles.content.container}>
              <View>
                <Text style={calculationHomeStyles.content.title}>Échantillonnage</Text>
                <Text style={calculationHomeStyles.content.description}>Détermine la résolution en secondes d'arc par pixel pour l'imagerie. (En seconde d'arc / pixel)</Text>
              </View>
              {
                sampling ?
                <MathComponent expression={sampling}/>
                :
                <View>
                  <MathComponent expression={`S = \\frac{206.3 \\times p}{F}`} />
                  <Text style={calculationHomeStyles.content.description}>p = taille pixel caméra (µm) et F = focale instrument (mm)</Text>
                </View>
              }
            </View>

            <View style={calculationHomeStyles.content.container}>
              <View>
                <Text style={calculationHomeStyles.content.title}>Champ réel</Text>
                <Text style={calculationHomeStyles.content.description}>Détermine le champ de vision pour un oculaire donné. (En minutes d'arc)</Text>
              </View>
              {
                fov ?
                <MathComponent expression={fov}/>
                :
                <View>
                  <MathComponent expression={`FoV = \\frac{C}{G}`} />
                  <Text style={calculationHomeStyles.content.description}>C = champ oculaire (°) et G = grossissement</Text>
                </View>
              }
            </View>

            <View style={calculationHomeStyles.content.container}>
              <View>
                <Text style={calculationHomeStyles.content.title}>Pupille de sortie</Text>
                <Text style={calculationHomeStyles.content.description}>Détermine le diamètre de la pupille de sortie pour un oculaire donné. (En mm)</Text>
              </View>
              {
                exitPupil ?
                <MathComponent expression={exitPupil}/>
                :
                <View>
                  <MathComponent expression={`P = \\frac{D}{G}`} />
                  <Text style={calculationHomeStyles.content.description}>D = diamètre instrument (mm) et G = grossissement</Text>
                </View>
              }
            </View>

            <View style={calculationHomeStyles.content.container}>
              <View>
                <Text style={calculationHomeStyles.content.title}>Pouvoir séparateur</Text>
                <Text style={calculationHomeStyles.content.description}>Détermine la capacité de l'instrument à distinguer deux objets proches. (En secondes d'arc)</Text>
              </View>
              {
                resolvingPower ?
                <MathComponent expression={resolvingPower}/>
                :
                <View>
                  <MathComponent expression={`Ps = \\frac{120}{D}`} />
                  <Text style={calculationHomeStyles.content.description}>D = diamètre instrument (mm)</Text>
                </View>
              }
            </View>
          </View>
        </ScrollView>
    </View>
  );
}
