import { ScrollView, View, Text, TouchableOpacity, TextInput } from "react-native"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { Trash2 } from "lucide-react-native"
import { router, useLocalSearchParams } from "expo-router"
import { globalStyles } from "../../../../../../helpers/globalStyles"
import { app_colors } from "../../../../../../helpers/variables"
import { generateCustomId } from "../../../../../../helpers/ids"
import { ScreenHeader } from "../../../../../../components/ScreenHeader/ScreenHeader"
import { addFilterStyles } from "./AddFilter.styles"
import SectionHeader from "../../../../../../components/SectionHeader/SectionHeader"
import { InputWithIcon } from "../../../../../../components/InputWithIcon/InputWithIcon"
import { Filter } from "../../../../../../types/gear/Filter"
import { useUserDataStore } from "../../../../../../store/userData.store"
import { FILTER_SIZES, FILTER_TYPES } from "../../../../../../helpers/gear/filters"
import { parseOptionalFloat } from "../../../../../../helpers/parseNumberInput"

const AddFilter = () => {
  const { t } = useTranslation("tools/journal/gear/filters/add")
  const { id: editedFilterId } = useLocalSearchParams<{ id?: string }>()
  const filters = useUserDataStore(state => state.gear.filters)
  const addFilter = useUserDataStore(state => state.addFilter)
  const updateFilter = useUserDataStore(state => state.updateFilter)
  const removeFilter = useUserDataStore(state => state.removeFilter)

  const editedFilter = editedFilterId ? filters.find(filter => filter.id === editedFilterId) : undefined

  const [name, setName] = useState(editedFilter?.name ?? "")
  const [brand, setBrand] = useState(editedFilter?.brand ?? "")
  const [model, setModel] = useState(editedFilter?.model ?? "")
  const [selectedType, setSelectedType] = useState<Filter["type"]>(editedFilter?.type ?? "uv")
  const [size, setSize] = useState<Filter["size"]>(editedFilter?.size ?? "1.25\"")
  const [wavelengthMinText, setWavelengthMinText] = useState(editedFilter?.wavelengthRange.min?.toString() ?? "")
  const [wavelengthMaxText, setWavelengthMaxText] = useState(editedFilter?.wavelengthRange.max?.toString() ?? "")
  const wavelengthMin = parseOptionalFloat(wavelengthMinText)
  const wavelengthMax = parseOptionalFloat(wavelengthMaxText)

  const isFormValid = wavelengthMin !== null && wavelengthMax !== null

  // Une fourchette de longueur d'onde max < min n'a pas de sens : comme pour les dates de
  // AddSession, on resserre l'autre borne plutôt que de laisser l'utilisateur saisir l'incohérence.
  // Le texte brut de CE champ-ci est stocké tel quel (voir parseOptionalFloat) ; seule l'autre
  // borne, pas en cours de frappe, peut être réécrite sans risquer de couper une décimale en cours.
  const handleWavelengthMinChange = (text: string) => {
    setWavelengthMinText(text)
    const value = parseOptionalFloat(text)
    if (value !== null && wavelengthMax !== null && value > wavelengthMax) setWavelengthMaxText(value.toString())
  }

  const handleWavelengthMaxChange = (text: string) => {
    setWavelengthMaxText(text)
    const value = parseOptionalFloat(text)
    if (value !== null && wavelengthMin !== null && value < wavelengthMin) setWavelengthMinText(value.toString())
  }

  const handleSave = () => {
    if (!isFormValid || wavelengthMin === null || wavelengthMax === null) return

    const filterData: Filter = {
      id: editedFilter?.id ?? generateCustomId(),
      name: name.trim() || null,
      brand: brand.trim() || null,
      model: model.trim() || null,
      type: selectedType,
      size,
      wavelengthRange: { min: wavelengthMin, max: wavelengthMax },
    }

    if (editedFilter) {
      updateFilter(editedFilter.id, filterData)
    } else {
      addFilter(filterData)
    }
    router.back()
  }

  const handleDelete = () => {
    if (!editedFilter) return
    removeFilter(editedFilter.id)
    router.replace("/tools/journal/gear")
  }

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={editedFilter ? t("editTitle") : t("title")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>
          <View style={addFilterStyles.form}>
            <View style={addFilterStyles.form.formBlock}>
              <SectionHeader title={t("sections.identity.title")} />

              <InputWithIcon
                label={t("fields.name.label")}
                placeholder={t("fields.name.placeholder")}
                value={name}
                onChangeText={setName}
                fill
                action={() => {}}
              />

              <View style={addFilterStyles.form.formRow}>
                <InputWithIcon
                  label={t("fields.brand.label")}
                  placeholder={t("fields.optionalPlaceholder")}
                  value={brand}
                  onChangeText={setBrand}
                  fill
                  action={() => {}}
                />
                <InputWithIcon
                  label={t("fields.model.label")}
                  placeholder={t("fields.optionalPlaceholder")}
                  value={model}
                  onChangeText={setModel}
                  fill
                  action={() => {}}
                />
              </View>
            </View>

            <View style={addFilterStyles.form.formBlock}>
              <SectionHeader title={t("sections.characteristics.title")} />

              <Text style={addFilterStyles.form.label}>{t("fields.type.label")}</Text>
              <View style={addFilterStyles.form.chipsRow}>
                {
                  FILTER_TYPES.map((value) => (
                    <TouchableOpacity
                      key={value}
                      style={[addFilterStyles.form.chipsRow.chip, selectedType === value && addFilterStyles.form.chipsRow.chip.active]}
                      onPress={() => setSelectedType(value)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: selectedType === value }}
                    >
                      <Text style={[addFilterStyles.form.chipsRow.chip.text, selectedType === value && addFilterStyles.form.chipsRow.chip.active.text]}>{t(`types.${value}`)}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>

              <Text style={addFilterStyles.form.label}>{t("fields.size.label")}</Text>
              <View style={addFilterStyles.form.chipsRow}>
                {
                  FILTER_SIZES.map((value) => (
                    <TouchableOpacity
                      key={value}
                      style={[addFilterStyles.form.chipsRow.chip, size === value && addFilterStyles.form.chipsRow.chip.active]}
                      onPress={() => setSize(value)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: size === value }}
                    >
                      <Text style={[addFilterStyles.form.chipsRow.chip.text, size === value && addFilterStyles.form.chipsRow.chip.active.text]}>{value}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>

              <View style={addFilterStyles.form.numberField}>
                <Text style={addFilterStyles.form.numberField.label}>
                  {t("fields.wavelengthMin.label")}<Text style={addFilterStyles.form.numberField.label.required}> *</Text>
                </Text>
                <View style={addFilterStyles.form.numberField.valueContainer}>
                  <TextInput
                    style={addFilterStyles.form.numberField.valueContainer.value}
                    value={wavelengthMinText}
                    onChangeText={handleWavelengthMinChange}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={app_colors.primary.medium}
                  />
                  <Text style={addFilterStyles.form.numberField.valueContainer.unit}>{t("unit.nanometers")}</Text>
                </View>
              </View>

              <View style={addFilterStyles.form.numberField}>
                <Text style={addFilterStyles.form.numberField.label}>
                  {t("fields.wavelengthMax.label")}<Text style={addFilterStyles.form.numberField.label.required}> *</Text>
                </Text>
                <View style={addFilterStyles.form.numberField.valueContainer}>
                  <TextInput
                    style={addFilterStyles.form.numberField.valueContainer.value}
                    value={wavelengthMaxText}
                    onChangeText={handleWavelengthMaxChange}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={app_colors.primary.medium}
                  />
                  <Text style={addFilterStyles.form.numberField.valueContainer.unit}>{t("unit.nanometers")}</Text>
                </View>
              </View>
            </View>

            <View style={addFilterStyles.form.actions}>
              <TouchableOpacity style={addFilterStyles.form.actions.saveButton} onPress={handleSave} disabled={!isFormValid}>
                <Text style={addFilterStyles.form.actions.saveButton.text}>{editedFilter ? t("actions.update") : t("actions.save")}</Text>
              </TouchableOpacity>
              {
                editedFilter && (
                  <TouchableOpacity style={addFilterStyles.form.actions.deleteButton} onPress={handleDelete}>
                    <Trash2 color={app_colors.red.main} size={18} />
                    <Text style={addFilterStyles.form.actions.deleteButton.text}>{t("actions.delete")}</Text>
                  </TouchableOpacity>
                )
              }
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default AddFilter
