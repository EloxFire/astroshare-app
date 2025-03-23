import React, {useRef, useState} from "react";
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

export default function CalculationHome({ navigation }: any) {

  const [focalLength, setFocalLength] = useState<number | undefined>(undefined);
  const [diameter, setDiameter] = useState<number | undefined>(undefined);
  const [eyepieceFocalLength, setEyepieceFocalLength] = useState<number | undefined>(undefined);
  const [pixelSize, setPixelSize] = useState<string | undefined>(undefined);

  const [fD, setFD] = useState<string | undefined>(undefined);
  const [magnification, setMagnification] = useState<string | undefined>(undefined);
  const [minMagnification, setMinMagnification] = useState<string | undefined>(undefined);
  const [sampling, setSampling] = useState<string | undefined>(undefined);

  const computeCalculations = () => {
    if(!focalLength && !diameter && !eyepieceFocalLength && !pixelSize){
      showToast({message: "Veuillez renseigner au moins le diamètre", type: "error"});
      return;
    }

    setFD(calculateFD(focalLength, diameter));
    setMagnification(calculateMagnification(focalLength, eyepieceFocalLength));
    setMinMagnification(calculateMinMagnification(diameter));
    setSampling(calculateSampling(focalLength, pixelSize));
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
              <MathComponent expression={fD}/>
            </View>

            <View style={calculationHomeStyles.content.container}>
              <View>
                <Text style={calculationHomeStyles.content.title}>Grossissement</Text>
                <Text style={calculationHomeStyles.content.description}>Permet de connaître le grossissement obtenu avec un oculaire donné.</Text>
              </View>
              <MathComponent expression={magnification}/>
            </View>

            <View style={calculationHomeStyles.content.container}>
              <View>
                <Text style={calculationHomeStyles.content.title}>Grossissement minimum</Text>
                <Text style={calculationHomeStyles.content.description}>Indique le grossissement minimum pour une pupille de sortie optimale selon l'instrument.</Text>
              </View>
              <MathComponent expression={minMagnification}/>
            </View>

            <View style={calculationHomeStyles.content.container}>
              <View>
                <Text style={calculationHomeStyles.content.title}>Échantillonnage</Text>
                <Text style={calculationHomeStyles.content.description}>Détermine la résolution en secondes d'arc par pixel pour l'imagerie.</Text>
              </View>
              <MathComponent expression={sampling}/>
            </View>
          </View>
        </ScrollView>
    </View>
  );
}
