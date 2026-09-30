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
  const { t } = useTranslation("settings/addObservatory");
  // const { currentFormStep } = useAddObservatoryForm();

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("stepOne.screenTitle")} main={false} />
      <StepOne />
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
