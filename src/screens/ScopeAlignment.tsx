import React, { useState } from "react";
import {
  Keyboard,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { globalStyles } from "../styles/global";
import { compassStyles } from "../styles/components/compass";
import PageTitle from "../components/commons/PageTitle";
import { scopeAlignmentStyles } from "../styles/screens/scopeAlignment";
import { app_colors, scopeAlignmentSteps } from "../helpers/constants";
import Compass from "../components/Compass";
import SimpleButton from "../components/commons/buttons/SimpleButton";
import { routes } from "../helpers/routes";
import PolarClock from "../components/PolarClock";
import SpiritLevel from "../components/SpiritLevel";

export default function ScopeAlignment({ navigation }: any) {

  const [currentStep, setCurrentStep] = useState(3);

  const handleNextStep = () => {
    currentStep === 3 ? navigation.navigate(routes.home) : setCurrentStep(currentStep + 1);
  }

  const handlePreviousStep = () => {
    currentStep === 1 ? navigation.navigate(routes.home) : setCurrentStep(currentStep - 1);
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={globalStyles.body}>
        <PageTitle navigation={navigation} title="Mise en station" subtitle="// Pour un alignement précis" />
        <View style={globalStyles.screens.separator} />
        <ScrollView>
          <View style={scopeAlignmentStyles.content}>
            <Text style={scopeAlignmentStyles.content.title}>Viseur polaire</Text>
            {/* <Text style={scopeAlignmentStyles.content.title}>Étape {currentStep}</Text> */}
            {/* <Text style={scopeAlignmentStyles.content.subtitle}>{scopeAlignmentSteps[currentStep - 1].title}</Text> */}
            {/* <Text style={scopeAlignmentStyles.content.infoText}>{scopeAlignmentSteps[currentStep - 1].description}</Text> */}
            <Text style={scopeAlignmentStyles.content.infoText}>Placez Polaris dans votre viseur polaire comme sur le schéma</Text>

            <View style={scopeAlignmentStyles.content.toolContainer}>
              {currentStep === 1 && <Compass />}
              {currentStep === 2 && <SpiritLevel />}
              {currentStep === 3 && <PolarClock />}
            </View>

            {/* <TouchableOpacity activeOpacity={.5} style={scopeAlignmentStyles.content.button} onPress={() => handleNextStep()}>
              <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Text style={scopeAlignmentStyles.content.button.text}>{currentStep === 3 ? "Retour à l'accueil" : "Étape suivante"}</Text>
              </View>
            </TouchableOpacity>
            {
              currentStep !== 1 &&
              <TouchableOpacity activeOpacity={.5} style={[scopeAlignmentStyles.content.button, { marginTop: 10 }]} onPress={() => handlePreviousStep()}>
                <View style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={scopeAlignmentStyles.content.button.text}>{currentStep === 1 ? "Retour à l'accueil" : "Retour"}</Text>
                </View>
              </TouchableOpacity>
            } */}
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
}
