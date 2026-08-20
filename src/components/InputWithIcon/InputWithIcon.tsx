import { TextInput, TextInputProps, View } from "react-native";
import { LucideIcon } from "lucide-react-native";
import { app_colors, withOpacity } from "../../helpers/variables";
import { inputWithIconStyles } from "./InputWithIcon.styles";

interface InputWithIconProps extends TextInputProps {
  icon: LucideIcon;
}

export const InputWithIcon = ({ icon: Icon, style, ...props }: InputWithIconProps) => {
  return (
    <View style={inputWithIconStyles.container}>
      <Icon color={withOpacity(app_colors.primary.main, 0.8)} size={16} />
      <TextInput
        style={[inputWithIconStyles.input, style]}
        placeholderTextColor={withOpacity(app_colors.primary.main, 0.8)}
        {...props}
      />
    </View>
  );
};
