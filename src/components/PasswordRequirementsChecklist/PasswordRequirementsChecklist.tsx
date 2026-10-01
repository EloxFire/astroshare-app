import { Text, View, ViewStyle } from "react-native";
import { Check } from "lucide-react-native";
import { app_colors } from "../../helpers/variables";
import { passwordRequirementsChecklistStyles } from "./PasswordRequirementsChecklist.styles";

export interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

export const DEFAULT_PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  { label: "8 caractères minimum", test: (password) => password.length >= 8 },
  { label: "Une majuscule", test: (password) => /[A-Z]/.test(password) },
  { label: "Un chiffre", test: (password) => /[0-9]/.test(password) },
];

interface PasswordRequirementsChecklistProps {
  password: string;
  requirements?: PasswordRequirement[];
  // Le container n'a pas de largeur propre par défaut (il se réduit à son contenu) — dans un
  // parent avec alignItems:"center" (ex: RegisterScreen), ça le centre comme bloc plutôt que
  // d'aligner ses lignes à gauche avec le reste du formulaire. À surcharger au cas par cas
  // (ex: { width: "100%", alignSelf: "flex-start" }).
  style?: ViewStyle;
}

export const PasswordRequirementsChecklist = ({
  password,
  requirements = DEFAULT_PASSWORD_REQUIREMENTS,
  style,
}: PasswordRequirementsChecklistProps) => {
  return (
    <View style={[passwordRequirementsChecklistStyles.container, style]}>
      {requirements.map((requirement) => {
        const isValid = requirement.test(password);
        return (
          <View key={requirement.label} style={passwordRequirementsChecklistStyles.row}>
            <View style={[passwordRequirementsChecklistStyles.indicator, isValid && passwordRequirementsChecklistStyles.indicator.valid]}>
              {isValid && <Check size={10} color={app_colors.white} strokeWidth={3} />}
            </View>
            <Text style={passwordRequirementsChecklistStyles.label}>{requirement.label}</Text>
          </View>
        );
      })}
    </View>
  );
};
