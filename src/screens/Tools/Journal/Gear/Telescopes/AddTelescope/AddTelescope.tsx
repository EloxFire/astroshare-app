import { ScrollView, View, Text, TouchableOpacity, TextInput } from "react-native"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { Trash2 } from "lucide-react-native"
import { router, useLocalSearchParams } from "expo-router"
import { globalStyles } from "../../../../../../helpers/globalStyles"
import { app_colors } from "../../../../../../helpers/variables"
import { generateCustomId } from "../../../../../../helpers/ids"
import { ScreenHeader } from "../../../../../../components/ScreenHeader/ScreenHeader"
import { addTelescopeStyles } from "./AddTelescope.styles"
import SectionHeader from "../../../../../../components/SectionHeader/SectionHeader"
import { InputWithIcon } from "../../../../../../components/InputWithIcon/InputWithIcon"
import { Telescope, TelescopeUsage } from "../../../../../../types/gear/Telescope"
import { useUserDataStore } from "../../../../../../store/userData.store"
import { SELECTABLE_TELESCOPE_TYPES, TELESCOPE_USAGES } from "../../../../../../helpers/gear/telescopes"
import { parseOptionalFloat } from "../../../../../../helpers/parseNumberInput"

const AddTelescope = () => {
  const { t } = useTranslation("tools/journal/gear/telescopes/add")
  const { id: editedTelescopeId } = useLocalSearchParams<{ id?: string }>()
  const telescopes = useUserDataStore(state => state.gear.telescopes)
  const addTelescope = useUserDataStore(state => state.addTelescope)
  const updateTelescope = useUserDataStore(state => state.updateTelescope)
  const removeTelescope = useUserDataStore(state => state.removeTelescope)

  // Présent (query param ?id=) depuis TelescopeDetails "Modifier" : ce même formulaire préremplit
  // alors ses champs et sauvegarde par mise à jour plutôt que par création.
  const editedTelescope = editedTelescopeId ? telescopes.find(scope => scope.id === editedTelescopeId) : undefined

  const [name, setName] = useState(editedTelescope?.name ?? "")
  const [brand, setBrand] = useState(editedTelescope?.brand ?? "")
  const [model, setModel] = useState(editedTelescope?.model ?? "")
  const [notes, setNotes] = useState(editedTelescope?.notes ?? "")
  const [selectedType, setSelectedType] = useState<Telescope["type"]>(editedTelescope?.type ?? "refractor")
  const [selectedUsages, setSelectedUsages] = useState<TelescopeUsage[]>(editedTelescope?.usages ?? ["visual", "planetary"])
  const [apertureText, setApertureText] = useState(editedTelescope?.aperture?.toString() ?? "")
  const [focalLengthText, setFocalLengthText] = useState(editedTelescope?.focalLength?.toString() ?? "")
  const aperture = parseOptionalFloat(apertureText)
  const focalLength = parseOptionalFloat(focalLengthText)

  const toggleUsage = (usage: TelescopeUsage) => {
    setSelectedUsages(previousUsages =>
      previousUsages.includes(usage) ? previousUsages.filter(u => u !== usage) : [...previousUsages, usage]
    )
  }

  const isFormValid = name.trim().length > 0 && aperture !== null && focalLength !== null

  const handleSave = () => {
    if (!isFormValid || aperture === null || focalLength === null) return

    const telescopeData: Telescope = {
      id: editedTelescope?.id ?? generateCustomId(),
      name: name.trim(),
      brand: brand.trim() || null,
      model: model.trim() || null,
      type: selectedType,
      aperture,
      focalLength,
      // Pas de contrôle UI pour ce champ dans ce formulaire (absent de la maquette) : laissé tel
      // quel en modification, vide à la création, à compléter si une sélection du diamètre de
      // porte-oculaire est ajoutée plus tard.
      eyepieceConnection: editedTelescope?.eyepieceConnection ?? [],
      notes: notes.trim() || null,
      usages: selectedUsages,
    }

    if (editedTelescope) {
      updateTelescope(editedTelescope.id, telescopeData)
    } else {
      addTelescope(telescopeData)
    }
    router.back()
  }

  const handleDelete = () => {
    if (!editedTelescope) return
    removeTelescope(editedTelescope.id)
    router.replace("/tools/journal/gear")
  }

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={editedTelescope ? t("editTitle") : t("title")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>
          <View style={addTelescopeStyles.form}>
            <View style={addTelescopeStyles.form.formBlock}>
              <SectionHeader title={t("sections.identity.title")} />

              <InputWithIcon
                label={t("fields.name.label")}
                required
                placeholder={t("fields.name.placeholder")}
                value={name}
                onChangeText={setName}
                fill
                action={() => {}}
              />

              <View style={addTelescopeStyles.form.formRow}>
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

              <InputWithIcon
                label={t("fields.notes.label")}
                placeholder={t("fields.notes.placeholder")}
                value={notes}
                onChangeText={setNotes}
                fill
                multiline
                action={() => {}}
              />
            </View>


            <View style={addTelescopeStyles.form.formBlock}>
              <SectionHeader title={t("sections.characteristics.title")} />

              <Text style={addTelescopeStyles.form.label}>{t("fields.type.label")}</Text>
              <View style={addTelescopeStyles.form.chipsRow}>
                {
                  SELECTABLE_TELESCOPE_TYPES.map((value) => (
                    <TouchableOpacity
                      key={value}
                      style={[addTelescopeStyles.form.chipsRow.chip, selectedType === value && addTelescopeStyles.form.chipsRow.chip.active]}
                      onPress={() => setSelectedType(value)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: selectedType === value }}
                    >
                      <Text style={[addTelescopeStyles.form.chipsRow.chip.text, selectedType === value && addTelescopeStyles.form.chipsRow.chip.active.text]}>{t(`types.${value}`)}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>

              <View style={addTelescopeStyles.form.numberField}>
                <Text style={addTelescopeStyles.form.numberField.label}>
                  {t("fields.aperture.label")}<Text style={addTelescopeStyles.form.numberField.label.required}> *</Text>
                </Text>
                <View style={addTelescopeStyles.form.numberField.valueContainer}>
                  <TextInput
                    style={addTelescopeStyles.form.numberField.valueContainer.value}
                    value={apertureText}
                    onChangeText={setApertureText}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={app_colors.primary.medium}
                  />
                  <Text style={addTelescopeStyles.form.numberField.valueContainer.unit}>{t("unit.millimeters")}</Text>
                </View>
              </View>

              <View style={addTelescopeStyles.form.numberField}>
                <Text style={addTelescopeStyles.form.numberField.label}>
                  {t("fields.focalLength.label")}<Text style={addTelescopeStyles.form.numberField.label.required}> *</Text>
                </Text>
                <View style={addTelescopeStyles.form.numberField.valueContainer}>
                  <TextInput
                    style={addTelescopeStyles.form.numberField.valueContainer.value}
                    value={focalLengthText}
                    onChangeText={setFocalLengthText}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={app_colors.primary.medium}
                  />
                  <Text style={addTelescopeStyles.form.numberField.valueContainer.unit}>{t("unit.millimeters")}</Text>
                </View>
              </View>

              <Text style={addTelescopeStyles.form.label}>{t("fields.usages.label")}</Text>
              <View style={addTelescopeStyles.form.chipsRow}>
                {
                  TELESCOPE_USAGES.map((value) => (
                    <TouchableOpacity
                      key={value}
                      style={[addTelescopeStyles.form.chipsRow.chip, selectedUsages.includes(value) && addTelescopeStyles.form.chipsRow.chip.active]}
                      onPress={() => toggleUsage(value)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: selectedUsages.includes(value) }}
                    >
                      <Text style={[addTelescopeStyles.form.chipsRow.chip.text, selectedUsages.includes(value) && addTelescopeStyles.form.chipsRow.chip.active.text]}>{t(`usages.${value}`)}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>
            </View>

            <View style={addTelescopeStyles.form.actions}>
              <TouchableOpacity style={addTelescopeStyles.form.actions.saveButton} onPress={handleSave} disabled={!isFormValid}>
                <Text style={addTelescopeStyles.form.actions.saveButton.text}>{editedTelescope ? t("actions.update") : t("actions.save")}</Text>
              </TouchableOpacity>
              {
                editedTelescope && (
                  <TouchableOpacity style={addTelescopeStyles.form.actions.deleteButton} onPress={handleDelete}>
                    <Trash2 color={app_colors.red.main} size={18} />
                    <Text style={addTelescopeStyles.form.actions.deleteButton.text}>{t("actions.delete")}</Text>
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

export default AddTelescope
