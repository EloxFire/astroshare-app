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
import { scopeAlignmentStyles } from "../styles/screens/scopeAlignment";
import { routes } from "../helpers/routes";
import { scopeAlignmentSteps } from "../helpers/constants";
import PageTitle from "../components/commons/PageTitle";
import PolarClock from "../components/PolarClock";

export default function ScopeAlignment({ navigation }: any) {

  const [currentStep, setCurrentStep] = useState(1);

  const handleNextStep = () => {
    currentStep === 2 ? navigation.navigate(routes.home.path) : setCurrentStep(currentStep + 1);
  }

  const handlePreviousStep = () => {
    currentStep === 1 ? navigation.navigate(routes.home.path) : setCurrentStep(currentStep - 1);
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle navigation={navigation} title="Mise en station" subtitle="// Pour un alignement précis" />
      <View style={globalStyles.screens.separator} />

      <ScrollView>
        <View style={scopeAlignmentStyles.header}>
          <Text style={scopeAlignmentStyles.header.title}>{scopeAlignmentSteps[currentStep - 1].title}</Text>
          <Text style={scopeAlignmentStyles.header.description}>{scopeAlignmentSteps[currentStep - 1].description}</Text>
        </View>

        <View style={scopeAlignmentStyles.content}>
          {currentStep === 1 && (
            <View style={scopeAlignmentStyles.content.list}>
              <View style={scopeAlignmentStyles.content.list.listElement}>
                <Text style={scopeAlignmentStyles.content.list.listElement.number}>1</Text>
                <Text style={scopeAlignmentStyles.content.list.listElement.value}>- Votre monture doit être orientée vers le nord, le plus précisément possible.</Text>
              </View>
              <View style={scopeAlignmentStyles.content.list.listElement}>
                <Text style={scopeAlignmentStyles.content.list.listElement.number}>2</Text>
                <Text style={scopeAlignmentStyles.content.text}>- Votre télescope doit être à l'horizontal, vérifiable avec un niveau à bulle.</Text>
              </View>
              <View style={scopeAlignmentStyles.content.list.listElement}>
                <Text style={scopeAlignmentStyles.content.list.listElement.number}>3</Text>
                <Text style={scopeAlignmentStyles.content.text}>- Assurez-vous que votre monture est bien fixée sur le trépied de votre télescope.</Text>
              </View>

            </View>
          )}
          {
            currentStep === 2 && <PolarClock />
          }
        </View>
        <View style={scopeAlignmentStyles.footer}>
          {currentStep !== 1 && (
            <TouchableOpacity onPress={() => handlePreviousStep()} style={scopeAlignmentStyles.footer.button}>
              <Text style={scopeAlignmentStyles.footer.button.text}>Précédent</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity onPress={() => handleNextStep()} style={scopeAlignmentStyles.footer.button}>
            <Text style={scopeAlignmentStyles.footer.button.text}>{currentStep === 2 ? "Retour à l'accueil" : "Suivant"}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
