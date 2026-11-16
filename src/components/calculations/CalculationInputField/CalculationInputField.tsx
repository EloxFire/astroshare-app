import { Text, TextInput, View } from "react-native";
import { app_colors } from "../../../helpers/variables";
import { calculationInputFieldStyles } from "./CalculationInputField.styles";

interface CalculationInputFieldProps {
  label: string;
  description: string;
  value: string;
  onChangeText: (text: string) => void;
  unit?: string;
}

// Ligne "titre + description + valeur numérique" des fiches de calcul. Généralise le champ numéro
// hérité des formulaires de matériel (AddTelescope, AddCamera...), qui n'ont pas de ligne de
// description sous le libellé — nouveau composant partagé plutôt qu'un énième champ dupliqué.
const CalculationInputField = ({ label, description, value, onChangeText, unit }: CalculationInputFieldProps) => (
  <View style={calculationInputFieldStyles.field}>
    <View style={calculationInputFieldStyles.field.texts}>
      <Text style={calculationInputFieldStyles.field.texts.label}>{label}</Text>
      <Text style={calculationInputFieldStyles.field.texts.description}>{description}</Text>
    </View>

    <View style={calculationInputFieldStyles.field.valueContainer}>
      <TextInput
        style={calculationInputFieldStyles.field.valueContainer.value}
        value={value}
        onChangeText={onChangeText}
        keyboardType="decimal-pad"
        placeholder="0"
        placeholderTextColor={app_colors.primary.medium}
      />
      {unit && <Text style={calculationInputFieldStyles.field.valueContainer.unit}>{unit}</Text>}
    </View>
  </View>
);

export default CalculationInputField;
