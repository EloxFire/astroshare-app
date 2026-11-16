import { Text, TouchableOpacity, View } from "react-native";
import { ChevronRight } from "lucide-react-native";
import { app_colors, icons } from "../../../helpers/variables";
import { calculationTileStyles } from "./CalculationTile.styles";

interface CalculationTileProps {
  title: string;
  subtitle: string;
  value: string | null;
  backgroundColor: string;
  onPress: () => void;
}

// Tuile de résultat de l'écran "Calculs" : valeur bien visible, titre et petit rappel de la
// formule en dessous. `value` à null (matériel incomplet pour ce calcul) affiche un tiret plutôt
// que de cacher la tuile : l'utilisateur voit tout de suite quels calculs il peut déjà consulter.
const CalculationTile = ({ title, subtitle, value, backgroundColor, onPress }: CalculationTileProps) => (
  <TouchableOpacity style={[calculationTileStyles.tile, { backgroundColor }]} onPress={onPress}>
    <View style={calculationTileStyles.tile.chevron}>
      <ChevronRight color={app_colors.primary.medium} size={icons.rowChevron} />
    </View>

    <Text style={calculationTileStyles.tile.value}>{value ?? "—"}</Text>
    <View style={calculationTileStyles.tile.texts}>
      <Text style={calculationTileStyles.tile.texts.title}>{title}</Text>
      <Text style={calculationTileStyles.tile.texts.subtitle}>{subtitle}</Text>
    </View>
  </TouchableOpacity>
);

export default CalculationTile;
