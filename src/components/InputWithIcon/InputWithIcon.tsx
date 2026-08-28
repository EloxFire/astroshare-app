import { Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { LucideIcon } from "lucide-react-native";
import { app_colors, withOpacity } from "../../helpers/variables";
import { inputWithIconStyles } from "./InputWithIcon.styles";

interface InputWithIconProps extends TextInputProps {
  icon: LucideIcon;
  action: () => void;
  suggestions?: string[];
  onSuggestionPress?: (suggestion: string) => void;
}

export const InputWithIcon = ({ icon: Icon, style, action, suggestions, ...props }: InputWithIconProps) => {

  const [isFocused, setIsFocused] = useState(false);

  const hasSuggestions = suggestions && suggestions.length > 0;

  const handleSuggestionPress = (suggestion: string) => {
    if(!props.onSuggestionPress) return;
    props.onSuggestionPress(suggestion);
    setIsFocused(false);
  }

  return (
    <View style={{display: 'flex', flexDirection: 'row', flex: 1, width: '100%'}}>
      <View style={[inputWithIconStyles.container, hasSuggestions && isFocused && inputWithIconStyles.container.withSuggestions]}>
        <Icon color={withOpacity(app_colors.primary.main, 0.8)} size={16} />
        <TextInput
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[inputWithIconStyles.input, style]}
          placeholderTextColor={withOpacity(app_colors.primary.main, 0.8)}
          returnKeyType="search"
          submitBehavior="submit"
          onSubmitEditing={action}
          {...props}
        />
      </View>
      {hasSuggestions && isFocused && (
        <View style={inputWithIconStyles.suggestionsContainer}>
          {suggestions.map((suggestion, index) => (
            <TouchableOpacity onPress={() => handleSuggestionPress(suggestion)} key={index} style={[inputWithIconStyles.suggestionText, index < suggestions.length - 1 && inputWithIconStyles.suggestionText.withBorder]}>
              <Text>{suggestion}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};
