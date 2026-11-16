import { Stack } from "expo-router";
import { CalculationGearProvider } from "../../../src/context/CalculationGearContext";

export default function AstroCalculationsLayout() {
  return (
    <CalculationGearProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CalculationGearProvider>
  );
}
