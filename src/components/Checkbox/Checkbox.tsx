import { TouchableOpacity } from "react-native";
import { Check } from "lucide-react-native";
import { app_colors } from "../../helpers/variables";
import { checkboxStyles } from "./Checkbox.styles";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

// Visuel seul, comme SwitchButton — le label (texte simple ou enrichi, ex: liens en gras) est
// composé à côté par l'écran appelant plutôt qu'imposé par ce composant.
const Checkbox = ({ checked, onChange }: CheckboxProps) => {
  return (
    <TouchableOpacity
      style={[checkboxStyles.box, checked && checkboxStyles.box.checked]}
      onPress={() => onChange(!checked)}
      accessibilityRole="checkbox"
      accessibilityState={{ checked }}
      hitSlop={8}
    >
      {checked && <Check size={14} color={app_colors.white} strokeWidth={3} />}
    </TouchableOpacity>
  );
};

export default Checkbox;
