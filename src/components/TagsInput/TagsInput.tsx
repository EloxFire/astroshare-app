import { Text, TextInput, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { X } from "lucide-react-native";
import { app_colors } from "../../helpers/variables";
import { tagsInputStyles } from "./TagsInput.styles";

interface TagsInputProps {
  label?: string;
  placeholder?: string;
  tags: string[];
  onChange: (tags: string[]) => void;
}

export const TagsInput = ({ label, placeholder, tags, onChange }: TagsInputProps) => {
  const [inputValue, setInputValue] = useState("");

  const addTag = (rawTag: string) => {
    const tag = rawTag.trim();
    if (tag === "" || tags.includes(tag)) return;
    onChange([...tags, tag]);
  };

  const handleChangeText = (text: string) => {
    // Une virgule tapée transforme immédiatement le mot qui précède en tag — le texte après la
    // dernière virgule reste dans le champ pour continuer à taper (cas "montagne, lac, ").
    if (!text.includes(",")) {
      setInputValue(text);
      return;
    }

    const parts = text.split(",");
    const remainder = parts.pop() ?? "";
    parts.forEach(addTag);
    setInputValue(remainder);
  };

  const handleSubmit = () => {
    addTag(inputValue);
    setInputValue("");
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <View style={tagsInputStyles.wrapper}>
      {label && <Text style={tagsInputStyles.label}>{label}</Text>}
      <View style={tagsInputStyles.container}>
        {tags.map((tag) => (
          <View key={tag} style={tagsInputStyles.container.tag}>
            <Text style={tagsInputStyles.container.tag.text}>{tag}</Text>
            <TouchableOpacity onPress={() => removeTag(tag)}>
              <X size={12} color={app_colors.primary.main} />
            </TouchableOpacity>
          </View>
        ))}
        <TextInput
          style={tagsInputStyles.container.input}
          value={inputValue}
          onChangeText={handleChangeText}
          onSubmitEditing={handleSubmit}
          onBlur={handleSubmit}
          placeholder={placeholder}
          placeholderTextColor={app_colors.primary.medium}
          returnKeyType="done"
          submitBehavior="submit"
        />
      </View>
    </View>
  );
};
