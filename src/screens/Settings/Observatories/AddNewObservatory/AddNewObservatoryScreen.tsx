import { ScreenHeader } from "../../../../components/ScreenHeader/ScreenHeader"
import { globalStyles } from "../../../../helpers/globalStyles"
import { View } from "react-native"
import { useTranslation } from "react-i18next"
import { AddObservatoryFormProvider, useAddObservatoryForm } from "./AddObservatoryFormContext";
import StepOne from "./StepOne/StepOne";
import StepTwo from "./StepTwo/StepTwo";

// currentFormStep vient du AddObservatoryFormProvider — ce composant doit être un enfant du
// Provider pour pouvoir le lire via useAddObservatoryForm().
const AddNewObservatoryScreenContent = () => {
  const { t } = useTranslation("settings");
  const { currentFormStep } = useAddObservatoryForm();

  return (
    <View style={globalStyles.screen}>

      {
        currentFormStep === 1 && (
          <>
            <ScreenHeader title={t("addObservatory.stepOne.screenTitle")} main={false} subtitle={t("addObservatory.stepOne.screenSubtitle")} />
            <StepOne />
          </>
        )
      }

      {
        currentFormStep === 2 && (
          <>
            <ScreenHeader title={t("addObservatory.stepTwo.screenTitle")} main={false} subtitle={t("addObservatory.stepTwo.screenSubtitle")} />
            <StepTwo />
          </>
        )
      }
    </View>
  )
}

const AddNewObservatoryScreen = () => (
  <AddObservatoryFormProvider>
    <AddNewObservatoryScreenContent />
  </AddObservatoryFormProvider>
);

export default AddNewObservatoryScreen
