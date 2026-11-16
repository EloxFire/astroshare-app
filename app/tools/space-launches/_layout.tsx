import { Stack } from "expo-router";
import { SpaceLaunchesProvider } from "../../../src/context/SpaceLaunchesContext";

export default function SpaceLaunchesStackLayout() {
  return (
    <SpaceLaunchesProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </SpaceLaunchesProvider>
  );
}
