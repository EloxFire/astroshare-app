import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Telescope } from "lucide-react-native";
import { globalStyles } from "../../../../helpers/globalStyles";
import { ScreenHeader } from "../../../../components/layout/ScreenHeader/ScreenHeader";
import SectionHeader from "../../../../components/layout/SectionHeader/SectionHeader";
import FormulaCard from "../../../../components/calculations/FormulaCard/FormulaCard";
import CalculationInputField from "../../../../components/calculations/CalculationInputField/CalculationInputField";
import CalculationResultCard from "../../../../components/calculations/CalculationResultCard/CalculationResultCard";
import { useCalculationGear } from "../../../../context/CalculationGearContext";
import { getCalculationById } from "../../../../helpers/calculations/calculations";
import { CALCULATION_VARIABLES } from "../../../../helpers/calculations/variables";
import { CalculationValues } from "../../../../types/calculations/Calculation";
import { calculationDetailsScreenStyles } from "./CalculationDetailsScreen.styles";

// Construit les textes de champs à partir des valeurs résolues depuis le matériel choisi : une clé
// absente (pas de fiche sélectionnée pour cette variable) laisse le champ vide, à saisir à la main.
const buildInputTexts = (keys: string[], gearValues: CalculationValues): Record<string, string> =>
  Object.fromEntries(keys.map((key) => [key, gearValues[key] != null ? String(gearValues[key]) : ""]));

const CalculationDetailsScreen = () => {
  const id = useLocalSearchParams().id as string;
  const { t, i18n } = useTranslation("tools/astroCalculations");
  const { gearValues } = useCalculationGear();

  const calculation = getCalculationById(id);

  const [inputTexts, setInputTexts] = useState<Record<string, string>>(() =>
    calculation ? buildInputTexts(calculation.inputs, gearValues) : {}
  );

  // Resynchronise les champs quand la fiche de calcul ou le matériel sélectionné change (ex:
  // l'utilisateur change de télescope via "Changer" sur l'écran principal, puis revient ici).
  useEffect(() => {
    if (calculation) setInputTexts(buildInputTexts(calculation.inputs, gearValues));
  }, [calculation?.id, gearValues]);

  if (!calculation) {
    return (
      <View style={globalStyles.screen}>
        <ScreenHeader main={false} />
        <View style={globalStyles.content}>
          <Text style={calculationDetailsScreenStyles.notFound}>{t("errors.notFound")}</Text>
        </View>
      </View>
    );
  }

  const values: CalculationValues = Object.fromEntries(
    Object.entries(inputTexts)
      .map(([key, text]) => [key, parseFloat(text.replace(",", "."))] as const)
      .filter(([, value]) => !isNaN(value))
  );

  const result = calculation.compute(values);
  const Visualization = calculation.Visualization;

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader main={false} title={t(`calculations.${calculation.id}.title`)} />
      <ScrollView>
        <View style={globalStyles.content}>

          <FormulaCard
            formulaLatex={calculation.formulaLatex}
            description={t(`calculations.${calculation.id}.formulaDescription`)}
          />

          <View style={calculationDetailsScreenStyles.section}>
            <SectionHeader
              title={t("screen.yourValues")}
              button={{
                label: t("screen.useMyGear"),
                icon: Telescope,
                onPress: () => setInputTexts(buildInputTexts(calculation.inputs, gearValues)),
              }}
            />

            <View style={calculationDetailsScreenStyles.section.fields}>
              {calculation.inputs.map((key) => (
                <CalculationInputField
                  key={key}
                  label={t(`variables.${key}.label`)}
                  description={t(`variables.${key}.description`)}
                  value={inputTexts[key] ?? ""}
                  onChangeText={(text) => setInputTexts((current) => ({ ...current, [key]: text }))}
                  unit={CALCULATION_VARIABLES[key as keyof typeof CALCULATION_VARIABLES]?.unit}
                />
              ))}
            </View>
          </View>

          {result != null && !Number.isNaN(result) && (
            <CalculationResultCard
              formattedValue={calculation.formatResult(result, i18n.language)}
              note={t(`calculations.${calculation.id}.resultNote`, { defaultValue: "" }) || undefined}
            >
              {Visualization && (
                <Visualization
                  value={result}
                  values={values}
                  onValuesChange={(updatedValues) =>
                    setInputTexts((current) => ({
                      ...current,
                      ...Object.fromEntries(Object.entries(updatedValues).map(([key, value]) => [key, String(value)])),
                    }))
                  }
                />
              )}
            </CalculationResultCard>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default CalculationDetailsScreen;
