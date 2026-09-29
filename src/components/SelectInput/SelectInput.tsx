import { FlatList, KeyboardAvoidingView, Modal, Platform, Pressable, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Check, ChevronDown, ChevronUp, LucideIcon, Search, X } from "lucide-react-native";
import { app_colors, spacing, withOpacity } from "../../helpers/variables";
import { InputWithIcon } from "../InputWithIcon/InputWithIcon";
import { selectInputStyles } from "./SelectInput.styles";

// Au-delà de ce nombre d'options, une liste ouverte sous le champ allongerait trop la page : par
// défaut, la liste s'ouvre alors dans un panneau depuis le bas de l'écran (voir `presentation`).
const SHEET_OPTIONS_THRESHOLD = 8;

// Recherche insensible à la casse et aux accents ("electricite" trouve "Électricité").
const normalizeForSearch = (text: string) => text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

export interface SelectOption<T extends string | number> {
  label: string;
  value: T;
}

interface SelectInputBaseProps<T extends string | number> {
  options: SelectOption<T>[];
  label?: string;
  placeholder?: string;
  icon?: LucideIcon;
  // Même logique que InputWithIcon — false (défaut) : largeur pleine (100% du parent) ; true :
  // flex:1, uniquement pour partager une View flexDirection:"row" avec un autre élément.
  fill?: boolean;
  // "dropdown" : liste ouverte sous le champ, dans le flux de la page — pour quelques options.
  // "sheet" : panneau qui s'ouvre depuis le bas de l'écran, avec une liste virtualisée (FlatList)
  // qui reste fluide même avec des centaines d'options.
  // Par défaut : "sheet" au-delà de SHEET_OPTIONS_THRESHOLD options, "dropdown" sinon.
  presentation?: "dropdown" | "sheet";
  // Champ de recherche en haut du panneau (mode "sheet" uniquement).
  searchable?: boolean;
  searchPlaceholder?: string;
}

// NoInfer sur value/onChange : le type T n'est déduit que des `options`. Sinon TypeScript le
// déduirait aussi de `value` — qui vaut T en choix simple mais T[] en choix multiple — et, face à
// ces candidats contradictoires, retomberait sur `string | number` (le setState d'un
// useState<T[]> était alors refusé).

// Choix simple : `value` est la valeur sélectionnée (null tant qu'il n'y en a aucune). La liste se
// referme dès qu'une option est choisie.
interface SingleSelectInputProps<T extends string | number> extends SelectInputBaseProps<T> {
  multiple?: false;
  value: NoInfer<T> | null;
  onChange: (value: NoInfer<T>) => void;
}

// Choix multiple : `value` est la liste des valeurs sélectionnées, toujours dans l'ordre des
// options (quel que soit l'ordre des clics). La liste reste ouverte pour enchaîner les choix.
interface MultipleSelectInputProps<T extends string | number> extends SelectInputBaseProps<T> {
  multiple: true;
  value: NoInfer<T>[];
  onChange: (value: NoInfer<T>[]) => void;
}

// Composant contrôlé (comme un TextInput) : la sélection vit chez le parent, via value/onChange.
// `multiple` sert de discriminant : il fixe le type de `value` et de `onChange`.
export type SelectInputProps<T extends string | number> = SingleSelectInputProps<T> | MultipleSelectInputProps<T>;

export const SelectInput = <T extends string | number>(props: SelectInputProps<T>) => {
  const { options, label, placeholder, icon: Icon, fill = false, searchable = false, searchPlaceholder } = props;
  const presentation = props.presentation ?? (options.length > SHEET_OPTIONS_THRESHOLD ? "sheet" : "dropdown");
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const insets = useSafeAreaInsets();

  const isSelected = (value: T) => props.multiple ? props.value.includes(value) : props.value === value;

  const selectedLabels = options.filter((option) => isSelected(option.value)).map((option) => option.label);
  const isDropdownOpen = isOpen && presentation === "dropdown";
  const Chevron = isDropdownOpen ? ChevronUp : ChevronDown;

  const normalizedQuery = normalizeForSearch(searchQuery.trim());
  const filteredOptions = normalizedQuery
    ? options.filter((option) => normalizeForSearch(option.label).includes(normalizedQuery))
    : options;

  const close = () => {
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleOptionPress = (value: T) => {
    if (props.multiple) {
      props.onChange(
        options
          .map((option) => option.value)
          .filter((optionValue) => optionValue === value ? !isSelected(optionValue) : isSelected(optionValue))
      );
      return;
    }

    props.onChange(value);
    close();
  };

  // Même ligne d'option pour la liste déroulante et le panneau.
  const renderOption = (option: SelectOption<T>, index: number, count: number, inSheet: boolean) => {
    const selected = isSelected(option.value);
    return (
      <TouchableOpacity
        key={String(option.value)}
        style={[
          selectInputStyles.options.option,
          inSheet && selectInputStyles.sheet.option,
          index < count - 1 && selectInputStyles.options.option.withBorder,
        ]}
        onPress={() => handleOptionPress(option.value)}
        accessibilityRole={props.multiple ? "checkbox" : "radio"}
        accessibilityState={props.multiple ? { checked: selected } : { selected }}
      >
        <Text style={[selectInputStyles.options.option.label, selected && selectInputStyles.options.option.label.selected]}>
          {option.label}
        </Text>
        {selected && <Check color={app_colors.accent.main} size={16} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={[selectInputStyles.wrapper, fill ? { flex: 1 } : { width: "100%" }]}>
      {label && <Text style={selectInputStyles.label}>{label}</Text>}

      <View>
        <TouchableOpacity
          style={[selectInputStyles.field, isDropdownOpen && selectInputStyles.field.open]}
          onPress={() => (isOpen ? close() : setIsOpen(true))}
          accessibilityRole="button"
          accessibilityState={{ expanded: isOpen }}
        >
          {Icon && <Icon color={withOpacity(app_colors.primary.main, 0.8)} size={16} />}
          <Text
            style={[selectInputStyles.field.value, selectedLabels.length === 0 && selectInputStyles.field.value.placeholder]}
            numberOfLines={1}
          >
            {selectedLabels.length > 0 ? selectedLabels.join(", ") : placeholder}
          </Text>
          <Chevron color={withOpacity(app_colors.primary.main, 0.8)} size={16} />
        </TouchableOpacity>

        {isDropdownOpen && (
          <View style={selectInputStyles.options}>
            {options.map((option, index) => renderOption(option, index, options.length, false))}
          </View>
        )}
      </View>

      {presentation === "sheet" && (
        // statusBarTranslucent/navigationBarTranslucent (Android) : le fond assombri couvre tout
        // l'écran, barres système comprises ; le bas du panneau est décalé de l'inset bas.
        <Modal
          visible={isOpen}
          animationType="slide"
          transparent
          statusBarTranslucent
          navigationBarTranslucent
          onRequestClose={close}
        >
          {/* iOS : le clavier (recherche) ne redimensionne pas l'écran — le padding remonte le panneau. */}
          <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={selectInputStyles.sheet.backdrop}>
            {/* Zone de fermeture derrière le panneau (et non autour de lui) : un Pressable parent
                intercepterait les gestes et pourrait gêner le défilement de la liste. */}
            <Pressable style={selectInputStyles.sheet.dismissArea} onPress={close} />

            <View style={[selectInputStyles.sheet.container, { paddingBottom: spacing.modalSheet.bottom + insets.bottom }]}>
              <View style={selectInputStyles.sheet.header}>
                <Text style={selectInputStyles.sheet.header.title} numberOfLines={1}>{label ?? placeholder}</Text>
                <TouchableOpacity onPress={close} accessibilityRole="button" hitSlop={10}>
                  <X color={app_colors.primary.main} size={20} />
                </TouchableOpacity>
              </View>

              {searchable && (
                <InputWithIcon
                  icon={Search}
                  placeholder={searchPlaceholder}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  action={() => {}}
                />
              )}

              <FlatList
                data={filteredOptions}
                keyExtractor={(option) => String(option.value)}
                renderItem={({ item, index }) => renderOption(item, index, filteredOptions.length, true)}
                keyboardShouldPersistTaps="handled"
                style={selectInputStyles.sheet.list}
              />
            </View>
          </KeyboardAvoidingView>
        </Modal>
      )}
    </View>
  );
};
