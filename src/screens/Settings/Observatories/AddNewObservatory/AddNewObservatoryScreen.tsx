import { ScreenHeader } from "../../../../components/ScreenHeader/ScreenHeader"
import { globalStyles } from "../../../../helpers/globalStyles"
import { View } from "react-native"
import { useTranslation } from "react-i18next"
import { AddObservatoryFormProvider, useAddObservatoryForm } from "./AddObservatoryFormContext";
import StepOne from "./StepOne/StepOne";

// currentFormStep vient du AddObservatoryFormProvider — ce composant doit être un enfant du
// Provider pour pouvoir le lire via useAddObservatoryForm().
const AddNewObservatoryScreenContent = () => {
  const { t } = useTranslation("settings");
  const { currentFormStep } = useAddObservatoryForm();

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("addObservatory.screenTitle")} main={false} subtitle={t("addObservatory.screenSubtitle")} />

      {
        currentFormStep === 1 && (
          <StepOne />
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
