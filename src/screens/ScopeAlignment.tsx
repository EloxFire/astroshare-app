import React, { useState } from "react";
import {
  Keyboard,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { globalStyles } from "../styles/global";
import { scopeAlignmentStyles } from "../styles/screens/scopeAlignment";
import { routes } from "../helpers/routes";
import PageTitle from "../components/commons/PageTitle";
import Compass from "../components/Compass";
import PolarClock from "../components/PolarClock";
import SpiritLevel from "../components/SpiritLevel";

export default function ScopeAlignment({ navigation }: any) {

  const [currentStep, setCurrentStep] = useState(3);

  const handleNextStep = () => {
    currentStep === 3 ? navigation.navigate(routes.home.path) : setCurrentStep(currentStep + 1);
  }

  const handlePreviousStep = () => {
    currentStep === 1 ? navigation.navigate(routes.home.path) : setCurrentStep(currentStep - 1);
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
