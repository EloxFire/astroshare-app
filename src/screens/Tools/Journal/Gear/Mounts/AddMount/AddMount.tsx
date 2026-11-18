import { ScrollView, View, Text, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from "react-native"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { Trash2 } from "lucide-react-native"
import { router, useLocalSearchParams } from "expo-router"
import { globalStyles } from "../../../../../../helpers/globalStyles"
import { app_colors } from "../../../../../../helpers/variables"
import { generateCustomId } from "../../../../../../helpers/ids"
import { ScreenHeader } from "../../../../../../components/layout/ScreenHeader/ScreenHeader"
import { addMountStyles } from "./AddMount.styles"
import SectionHeader from "../../../../../../components/layout/SectionHeader/SectionHeader"
import { InputWithIcon } from "../../../../../../components/inputs/InputWithIcon/InputWithIcon"
import SwitchButton from "../../../../../../components/inputs/SwitchButton/SwitchButton"
import { Mount } from "../../../../../../types/gear/Mount"
import { useUserDataStore } from "../../../../../../store/userData.store"
import { MOUNT_TYPES } from "../../../../../../helpers/gear/mounts"
import { parseOptionalFloat } from "../../../../../../helpers/parseNumberInput"
import Button from "../../../../../../components/buttons/Button/Button"

const AddMount = () => {
  const { t } = useTranslation("tools/journal/gear/mounts/add")
  const { id: editedMountId } = useLocalSearchParams<{ id?: string }>()
  const mounts = useUserDataStore(state => state.gear.mounts)
  const addMount = useUserDataStore(state => state.addMount)
  const updateMount = useUserDataStore(state => state.updateMount)
  const removeMount = useUserDataStore(state => state.removeMount)

  const editedMount = editedMountId ? mounts.find(mount => mount.id === editedMountId) : undefined

  const [name, setName] = useState(editedMount?.name ?? "")
  const [brand, setBrand] = useState(editedMount?.brand ?? "")
  const [model, setModel] = useState(editedMount?.model ?? "")
  const [selectedType, setSelectedType] = useState<Mount["type"]>(editedMount?.type ?? "equatorial")
  const [motorized, setMotorized] = useState(editedMount?.motorized ?? false)
  const [maxPayloadText, setMaxPayloadText] = useState(editedMount?.maxPayload?.toString() ?? "")
  const maxPayload = parseOptionalFloat(maxPayloadText)

  const handleSave = () => {
    const mountData: Mount = {
      id: editedMount?.id ?? generateCustomId(),
      name: name.trim() || null,
      brand: brand.trim() || null,
      model: model.trim() || null,
      type: selectedType,
      motorized,
      maxPayload,
    }

    if (editedMount) {
      updateMount(editedMount.id, mountData)
    } else {
      addMount(mountData)
    }
    router.back()
  }

  const handleDelete = () => {
    if (!editedMount) return
    removeMount(editedMount.id)
    router.replace("/tools/journal/gear")
  }

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={editedMount ? t("editTitle") : t("title")} main={false} />

      {/* Formulaire long, dernier champ proche du bouton d'enregistrement : sans ça, Android ne
          redimensionne rien tout seul une fois le clavier ouvert (voir AddSession). */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView>
        <View style={globalStyles.content}>
          <View style={addMountStyles.form}>
            <View style={addMountStyles.form.formBlock}>
              <SectionHeader title={t("sections.identity.title")} />

              <InputWithIcon
                label={t("fields.name.label")}
                placeholder={t("fields.name.placeholder")}
                value={name}
                onChangeText={setName}
                fill
                action={() => {}}
              />

              <View style={addMountStyles.form.formRow}>
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

            <View style={addMountStyles.form.formBlock}>
              <SectionHeader title={t("sections.characteristics.title")} />

              <Text style={addMountStyles.form.label}>{t("fields.type.label")}</Text>
              <View style={addMountStyles.form.chipsRow}>
                {
                  MOUNT_TYPES.map((value) => (
                    <TouchableOpacity
                      key={value}
                      style={[addMountStyles.form.chipsRow.chip, selectedType === value && addMountStyles.form.chipsRow.chip.active]}
                      onPress={() => setSelectedType(value)}
                      accessibilityRole="button"
                      accessibilityState={{ selected: selectedType === value }}
                    >
                      <Text style={[addMountStyles.form.chipsRow.chip.text, selectedType === value && addMountStyles.form.chipsRow.chip.active.text]}>{t(`types.${value}`)}</Text>
                    </TouchableOpacity>
                  ))
                }
              </View>

              <View style={addMountStyles.form.switchField}>
                <Text style={addMountStyles.form.switchField.label}>{t("fields.motorized.label")}</Text>
                <SwitchButton isEnabled={motorized} onToggle={() => setMotorized(previous => !previous)} />
              </View>

              <View style={addMountStyles.form.numberField}>
                <Text style={addMountStyles.form.numberField.label}>{t("fields.maxPayload.label")}</Text>
                <View style={addMountStyles.form.numberField.valueContainer}>
                  <TextInput
                    style={addMountStyles.form.numberField.valueContainer.value}
                    value={maxPayloadText}
                    onChangeText={setMaxPayloadText}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor={app_colors.primary.medium}
                  />
                  <Text style={addMountStyles.form.numberField.valueContainer.unit}>{t("unit.kilograms")}</Text>
                </View>
              </View>
            </View>

            <View style={addMountStyles.form.actions}>
              <Button label={editedMount ? t("actions.update") : t("actions.save")} onPress={handleSave} />
              {
                editedMount && (
                  <Button label={t("actions.delete")} icon={Trash2} variant="danger" onPress={handleDelete} />
                )
              }
            </View>
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

export default AddMount
