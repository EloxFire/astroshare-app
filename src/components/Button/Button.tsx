import { ActivityIndicator, StyleProp, Text, TextStyle, TouchableOpacity, ViewStyle } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { buttonStyles } from "./Button.styles";

interface ButtonProps {
  // Facultatif : un bouton icône seule (ex: supprimer, sans texte) reste possible.
  label?: string;
  onPress?: () => void;
  icon?: LucideIcon;
  // "color" (accent.main, action principale) / "danger" (rouge plein, action destructive) /
  // "info" (habillage defaultCard, action secondaire qui doit se fondre dans une liste de cartes).
  variant?: "color" | "danger" | "info";
  disabled?: boolean;
  // Remplace l'icône + le texte par un spinner (ex: soumission en cours) sans changer la taille du
  // bouton ni son style.
  loading?: boolean;
  iconSize?: number;
  // "left" (défaut) pour une action classique, "right" pour un bouton "suivant" (ex: étapes d'un
  // formulaire multi-écrans), où la flèche suit le texte plutôt que de le précéder.
  iconPosition?: "left" | "right";
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const Button = ({ label, onPress, icon: Icon, variant = "color", disabled, loading, iconSize = 18, iconPosition = "left", style, textStyle }: ButtonProps) => {
  const variantStyle = buttonStyles[variant];

  return (
    <TouchableOpacity
      style={[buttonStyles.base, variantStyle, style]}
      onPress={onPress}
      disabled={disabled || loading}
      accessibilityRole="button"
    >
      {
        loading ? (
          <ActivityIndicator size="small" color={variantStyle.text.color} />
        ) : (
          <>
            {Icon && iconPosition === "left" && <Icon size={iconSize} color={variantStyle.text.color} />}
            {label && <Text style={[buttonStyles.base.text, variantStyle.text, textStyle]}>{label}</Text>}
            {Icon && iconPosition === "right" && <Icon size={iconSize} color={variantStyle.text.color} />}
          </>
        )
      }
    </TouchableOpacity>
  );
};

export default Button;
