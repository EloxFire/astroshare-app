import { ScrollView, View, Text, TouchableOpacity, TextInput } from "react-native"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { Trash2 } from "lucide-react-native"
import { router, useLocalSearchParams } from "expo-router"
import { globalStyles } from "../../../../../../helpers/globalStyles"
import { app_colors } from "../../../../../../helpers/variables"
import { generateCustomId } from "../../../../../../helpers/ids"
import { ScreenHeader } from "../../../../../../components/ScreenHeader/ScreenHeader"
import { addGuideScopeStyles } from "./AddGuideScope.styles"
import SectionHeader from "../../../../../../components/SectionHeader/SectionHeader"
import { InputWithIcon } from "../../../../../../components/InputWithIcon/InputWithIcon"
import { GuideScope } from "../../../../../../types/gear/GuideScope"
import { useUserDataStore } from "../../../../../../store/userData.store"
import { GUIDE_SCOPE_TYPES } from "../../../../../../helpers/gear/guideScopes"
import { parseOptionalFloat } from "../../../../../../helpers/parseNumberInput"

const AddGuideScope = () => {
  const { t } = useTranslation("tools/journal/gear/guideScopes/add")
  const { id: editedGuideScopeId } = useLocalSearchParams<{ id?: string }>()
  const guideScopes = useUserDataStore(state => state.gear.guideScopes)
  const addGuideScope = useUserDataStore(state => state.addGuideScope)
  const updateGuideScope = useUserDataStore(state => state.updateGuideScope)
  const removeGuideScope = useUserDataStore(state => state.removeGuideScope)

  const editedGuideScope = editedGuideScopeId ? guideScopes.find(scope => scope.id === editedGuideScopeId) : undefined

  const [name, setName] = useState(editedGuideScope?.name ?? "")
  const [brand, setBrand] = useState(editedGuideScope?.brand ?? "")
  const [model, setModel] = useState(editedGuideScope?.model ?? "")
  const [selectedType, setSelectedType] = useState<GuideScope["type"]>(editedGuideScope?.type ?? "refractor")
  const [apertureText, setApertureText] = useState(editedGuideScope?.aperture?.toString() ?? "")
  const [focalLengthText, setFocalLengthText] = useState(editedGuideScope?.focalLength?.toString() ?? "")
  const aperture = parseOptionalFloat(apertureText)
  const focalLength = parseOptionalFloat(focalLengthText)

  const isFormValid = aperture !== null && focalLength !== null

  const handleSave = () => {
    if (!isFormValid || aperture === null || focalLength === null) return

    const guideScopeData: GuideScope = {
      id: editedGuideScope?.id ?? generateCustomId(),
      name: name.trim() || null,
      brand: brand.trim() || null,
      model: model.trim() || null,
      type: selectedType,
      aperture,
      focalLength,
    }

    if (editedGuideScope) {
      updateGuideScope(editedGuideScope.id, guideScopeData)
    } else {
      addGuideScope(guideScopeData)
    }
    router.back()
  }

  const handleDelete = () => {
    if (!editedGuideScope) return
    removeGuideScope(editedGuideScope.id)
    router.replace("/tools/journal/gear")
  }

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={editedGuideScope ? t("editTitle") : t("title")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>
          <View style={addGuideScopeStyles.form}>
            <View style={addGuideScopeStyles.form.formBlock}>
              <SectionHeader title={t("sections.identity.title")} />

              <InputWithIcon
                label={t("fields.name.label")}
                placeholder={t("fields.name.placeholder")}
                value={name}
                onChangeText={setName}
                fill
                action={() => {}}
              />

              <View style={addGuideScopeStyles.form.formRow}>
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

            <View style={addGuideScopeStyles.form.formBlock}>
              <SectionHeader title={t("sections.characteristics.title")} />

              <Text style={addGuideScopeStyles.form.label}>{t("fields.type.label")}</Text>
              <View style={addGuideScopeStyles.form.chipsRow}>
                {
                  GUIDE_SCOPE_TYPES.map((value) => (
                    <TouchableOpacity
                      key={value}
                      style={[addGuideScopeStyles.form.chipsRow.chip, selectedType === value && addGuideScopeStyles.form.chipsRow.chip.active]}
                      onPress={() => setSelectedType(value)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: selectedType === value }}
                    >
                      <Text style={[addGuideScopeStyles.form.chipsRow.chip.text, selectedType === value && addGuideScopeStyles.form.chipsRow.chip.active.text]}>{t(`types.${value}`)}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>

              <View style={addGuideScopeStyles.form.numberField}>
                <Text style={addGuideScopeStyles.form.numberField.label}>
                  {t("fields.aperture.label")}<Text style={addGuideScopeStyles.form.numberField.label.required}> *</Text>
                </Text>
                <View style={addGuideScopeStyles.form.numberField.valueContainer}>
                  <TextInput
                    style={addGuideScopeStyles.form.numberField.valueContainer.value}
                    value={apertureText}
                    onChangeText={setApertureText}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={app_colors.primary.medium}
                  />
                  <Text style={addGuideScopeStyles.form.numberField.valueContainer.unit}>{t("unit.millimeters")}</Text>
                </View>
              </View>

              <View style={addGuideScopeStyles.form.numberField}>
                <Text style={addGuideScopeStyles.form.numberField.label}>
                  {t("fields.focalLength.label")}<Text style={addGuideScopeStyles.form.numberField.label.required}> *</Text>
                </Text>
                <View style={addGuideScopeStyles.form.numberField.valueContainer}>
                  <TextInput
                    style={addGuideScopeStyles.form.numberField.valueContainer.value}
                    value={focalLengthText}
                    onChangeText={setFocalLengthText}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={app_colors.primary.medium}
                  />
                  <Text style={addGuideScopeStyles.form.numberField.valueContainer.unit}>{t("unit.millimeters")}</Text>
                </View>
              </View>
            </View>

            <View style={addGuideScopeStyles.form.actions}>
              <TouchableOpacity style={addGuideScopeStyles.form.actions.saveButton} onPress={handleSave} disabled={!isFormValid}>
                <Text style={addGuideScopeStyles.form.actions.saveButton.text}>{editedGuideScope ? t("actions.update") : t("actions.save")}</Text>
              </TouchableOpacity>
              {
                editedGuideScope && (
                  <TouchableOpacity style={addGuideScopeStyles.form.actions.deleteButton} onPress={handleDelete}>
                    <Trash2 color={app_colors.red.main} size={18} />
                    <Text style={addGuideScopeStyles.form.actions.deleteButton.text}>{t("actions.delete")}</Text>
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

export default AddGuideScope
