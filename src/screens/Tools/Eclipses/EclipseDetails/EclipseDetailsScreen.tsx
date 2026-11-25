import { useLocalSearchParams } from "expo-router";
import SolarEclipseDetailsScreen from "./SolarEclipseDetailsScreen";
import LunarEclipseDetailsScreen from "./LunarEclipseDetailsScreen";

// Aiguilleur : l'id de route ("solar:2027-08-02" / "lunar:2028-12-31") décide quel écran de détail
// rendre — deux écrans séparés plutôt qu'un seul avec beaucoup de branches conditionnelles, les
// deux types d'éclipse ayant des circonstances et une carte de visibilité assez différentes (voir
// docs/agents-reference.md).
const EclipseDetailsScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const kind = id?.split(":")[0];

  if (kind === "lunar") return <LunarEclipseDetailsScreen />;
  return <SolarEclipseDetailsScreen />;
};

export default EclipseDetailsScreen;
