import { ScreenHeader } from "../../../../components/layout/ScreenHeader/ScreenHeader"
import { globalStyles } from "../../../../helpers/globalStyles"
import { KeyboardAvoidingView, Platform, View } from "react-native"
import { useTranslation } from "react-i18next"
import { useLocalSearchParams } from "expo-router"
import { AddObservatoryFormProvider, useAddObservatoryForm } from "./AddObservatoryFormContext";
import StepOne from "./StepOne/StepOne";
import StepTwo from "./StepTwo/StepTwo";

// currentFormStep vient du AddObservatoryFormProvider — ce composant doit être un enfant du
// Provider pour pouvoir le lire via useAddObservatoryForm().
const AddNewObservatoryScreenContent = () => {
  const { t } = useTranslation("settings/addObservatory");
  // const { currentFormStep } = useAddObservatoryForm();

  // Présent (query param ?id=) depuis ObservatoryDetails "Modifier" : StepOne préremplit alors ses
  // champs et sauvegarde par mise à jour plutôt que par création — voir StepOne.tsx.
  const { id: editedObservatoryId } = useLocalSearchParams<{ id?: string }>();

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={editedObservatoryId ? t("stepOne.editScreenTitle") : t("stepOne.screenTitle")} main={false} />
      {/* StepOne a un champ de notes multiligne juste avant le bouton d'enregistrement : sans ça,
          Android ne redimensionne rien tout seul une fois le clavier ouvert (voir AddSession). */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <StepOne />
      </KeyboardAvoidingView>
      {/* {
        currentFormStep === 1 && (
          <>
            <ScreenHeader title={t("stepOne.screenTitle")} main={false} />
            <StepOne />
          </>
        )
      } */}

      {/* {
        currentFormStep === 2 && (
          <>
            <ScreenHeader title={t("stepTwo.screenTitle")} main={false} subtitle={t("stepTwo.screenSubtitle")} />
            <StepTwo />
          </>
        )
      } */}
    </View>
  )
}

const AddNewObservatoryScreen = () => (
  <AddObservatoryFormProvider>
    <AddNewObservatoryScreenContent />
  </AddObservatoryFormProvider>
);

export default AddNewObservatoryScreen
