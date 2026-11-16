import { ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { globalStyles } from "../../../helpers/globalStyles";
import { ScreenHeader } from "../../../components/layout/ScreenHeader/ScreenHeader";
import SectionHeader from "../../../components/layout/SectionHeader/SectionHeader";
import GearSummaryBar from "../../../components/calculations/GearSummaryBar/GearSummaryBar";
import CalculationTile from "../../../components/calculations/CalculationTile/CalculationTile";
import { useCalculationGear } from "../../../context/CalculationGearContext";
import { CALCULATIONS, getCalculationsByCategory } from "../../../helpers/calculations/calculations";
import { CALCULATION_CATEGORIES } from "../../../helpers/calculations/categories";
import { astroCalculationsScreenStyles } from "./AstroCalculationsScreen.styles";

const AstroCalculationsScreen = () => {
  const { t, i18n } = useTranslation("tools/astroCalculations");
  const { gearValues } = useCalculationGear();

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader main={false} title={t('screen.title')} />
      <ScrollView>
        <View style={globalStyles.content}>
          
          <GearSummaryBar />

          {CALCULATION_CATEGORIES.map(({ id: categoryId, color }) => (
            <View key={categoryId} style={astroCalculationsScreenStyles.section}>
              <SectionHeader title={t(`categories.${categoryId}`)} />

              <View style={astroCalculationsScreenStyles.section.grid}>
                {getCalculationsByCategory(categoryId).map((calculation) => {
                  // `compute()` sait déjà quelles entrées lui sont vraiment indispensables (ses
                  // propres gardes `!= null`) : certaines de `inputs` sont facultatives (ex: le
                  // facteur de barlow de l'échantillonnage), donc exiger TOUTES les entrées ici
                  // aurait empêché cette tuile de calculer dès que cette entrée facultative n'a
                  // pas de source matériel.
                  const result = calculation.compute(gearValues);
                  const formattedValue = result != null && !Number.isNaN(result) ? calculation.formatResult(result, i18n.language) : null;

                  return (
                    <CalculationTile
                      key={calculation.id}
                      title={t(`calculations.${calculation.id}.title`)}
                      subtitle={t(`calculations.${calculation.id}.shortFormula`)}
                      value={formattedValue}
                      backgroundColor={color}
                      onPress={() => router.push(`/tools/astro-calculations/${calculation.id}`)}
                    />
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default AstroCalculationsScreen;
