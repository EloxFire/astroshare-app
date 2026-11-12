import { ScrollView, View, Text, TouchableOpacity, TextInput } from "react-native"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { Check, Pencil, Plus, Trash2 } from "lucide-react-native"
import { router, useLocalSearchParams } from "expo-router"
import { globalStyles } from "../../../../../../helpers/globalStyles"
import { app_colors, withOpacity } from "../../../../../../helpers/variables"
import { generateCustomId } from "../../../../../../helpers/ids"
import { gearName } from "../../../../../../helpers/gear/gearName"
import { ScreenHeader } from "../../../../../../components/ScreenHeader/ScreenHeader"
import SectionHeader from "../../../../../../components/SectionHeader/SectionHeader"
import { addSetupStyles } from "./AddSetup.styles"
import { Setup } from "../../../../../../types/gear/Setup"
import { useUserDataStore } from "../../../../../../store/userData.store"

interface CompositionCategoryProps {
  title: string
  badge: string
  items: { id: string; label: string }[]
  selectedIds: string[]
  onToggle: (id: string) => void
  emptyStateLabel: string
  addRoute: string
}

// Une seule carte "catégorie" pour les 8 emplacements du setup : la différence entre sélection
// unique (télescope, monture...) et multiple (oculaires, filtres...) ne vit que dans la façon dont
// le parent construit `selectedIds`/`onToggle`, pas ici.
const CompositionCategory = ({ title, badge, items, selectedIds, onToggle, emptyStateLabel, addRoute }: CompositionCategoryProps) => (
  <View style={addSetupStyles.categoryCard}>
    <View style={addSetupStyles.categoryCard.header}>
      <Text style={addSetupStyles.categoryCard.header.title}>{title}</Text>
      <Text style={addSetupStyles.categoryCard.header.badge}>{badge}</Text>
    </View>

    {
      items.length === 0 ? (
        <TouchableOpacity style={addSetupStyles.categoryCard.emptyStateButton} onPress={() => router.push(addRoute)}>
          <Plus size={14} color={app_colors.accent.main} />
          <Text style={addSetupStyles.categoryCard.emptyStateButton.text}>{emptyStateLabel}</Text>
        </TouchableOpacity>
      ) : (
        <View style={addSetupStyles.categoryCard.chipsRow}>
          {
            items.map(item => {
              const isSelected = selectedIds.includes(item.id)
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[addSetupStyles.categoryCard.chip, isSelected && addSetupStyles.categoryCard.chip.active]}
                  onPress={() => onToggle(item.id)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  {isSelected && <Check size={12} color={app_colors.white} />}
                  <Text style={[addSetupStyles.categoryCard.chip.text, isSelected && addSetupStyles.categoryCard.chip.active.text]}>{item.label}</Text>
                </TouchableOpacity>
              )
            })
          }
        </View>
      )
    }
  </View>
)

const AddSetup = () => {
  const { t } = useTranslation("tools/journal/gear/setups/add")
  const { id: editedSetupId } = useLocalSearchParams<{ id?: string }>()

  const setups = useUserDataStore(state => state.gear.setups)
  const userScopes = useUserDataStore(state => state.gear.telescopes)
  const userMounts = useUserDataStore(state => state.gear.mounts)
  const userEyepieces = useUserDataStore(state => state.gear.eyepieces)
  const userFilters = useUserDataStore(state => state.gear.filters)
  const userCameras = useUserDataStore(state => state.gear.cameras)
  const userGuideScopes = useUserDataStore(state => state.gear.guideScopes)
  const userFocusers = useUserDataStore(state => state.gear.focusers)
  const addSetup = useUserDataStore(state => state.addSetup)
  const updateSetup = useUserDataStore(state => state.updateSetup)
  const removeSetup = useUserDataStore(state => state.removeSetup)

  const editedSetup = editedSetupId ? setups.find(setup => setup.id === editedSetupId) : undefined

  const [name, setName] = useState(editedSetup?.name ?? "")
  const [showNameError, setShowNameError] = useState(false)
  const [description, setDescription] = useState(editedSetup?.description ?? "")
  const [selectedScopeId, setSelectedScopeId] = useState<string | null>(editedSetup?.scope?.id ?? null)
  const [selectedMountId, setSelectedMountId] = useState<string | null>(editedSetup?.mount?.id ?? null)
  const [selectedEyepieceIds, setSelectedEyepieceIds] = useState<string[]>(editedSetup?.eyepieces.map(e => e.id) ?? [])
  const [selectedFilterIds, setSelectedFilterIds] = useState<string[]>(editedSetup?.filters.map(f => f.id) ?? [])
  const [selectedCameraIds, setSelectedCameraIds] = useState<string[]>(editedSetup?.cameras.map(c => c.id) ?? [])
  const [selectedGuideScopeId, setSelectedGuideScopeId] = useState<string | null>(editedSetup?.guideScope?.id ?? null)
  const [selectedGuideCameraId, setSelectedGuideCameraId] = useState<string | null>(editedSetup?.guideCamera?.id ?? null)
  const [selectedFocuserIds, setSelectedFocuserIds] = useState<string[]>(editedSetup?.focusers.map(f => f.id) ?? [])

  const toggleInArray = (setIds: (updater: (previousIds: string[]) => string[]) => void, id: string) =>
    setIds(previousIds => previousIds.includes(id) ? previousIds.filter(previousId => previousId !== id) : [...previousIds, id])

  const toggleSingleSelect = (setId: (updater: (previousId: string | null) => string | null) => void, id: string) =>
    setId(previousId => previousId === id ? null : id)

  // Pas le même décompte que getSetupPieceCount (helpers/gear/setups.ts) : ici on compte les ids
  // sélectionnés dans le formulaire, pas les objets d'un Setup déjà enregistré.
  const pieceCount = (selectedScopeId ? 1 : 0)
    + (selectedMountId ? 1 : 0)
    + selectedEyepieceIds.length
    + selectedFilterIds.length
    + selectedCameraIds.length
    + (selectedGuideScopeId ? 1 : 0)
    + (selectedGuideCameraId ? 1 : 0)
    + selectedFocuserIds.length

  const handleNameChange = (text: string) => {
    setName(text)
    if (showNameError) setShowNameError(false)
  }

  const handleSave = () => {
    // Avec `disabled` sur le bouton, un nom vide bloque le press AVANT même d'atteindre ce
    // handler : impossible d'y afficher une erreur. La validation vit donc ici, pas sur le bouton.
    if (name.trim().length === 0) {
      setShowNameError(true)
      return
    }

    const setupData: Setup = {
      id: editedSetup?.id ?? generateCustomId(),
      name: name.trim(),
      description: description.trim() || null,
      scope: userScopes.find(scope => scope.id === selectedScopeId) ?? null,
      mount: userMounts.find(mount => mount.id === selectedMountId) ?? null,
      eyepieces: userEyepieces.filter(eyepiece => selectedEyepieceIds.includes(eyepiece.id)),
      filters: userFilters.filter(filter => selectedFilterIds.includes(filter.id)),
      cameras: userCameras.filter(camera => selectedCameraIds.includes(camera.id)),
      guideScope: userGuideScopes.find(guideScope => guideScope.id === selectedGuideScopeId) ?? null,
      guideCamera: userCameras.find(camera => camera.id === selectedGuideCameraId) ?? null,
      focusers: userFocusers.filter(focuser => selectedFocuserIds.includes(focuser.id)),
    }

    if (editedSetup) {
      updateSetup(editedSetup.id, setupData)
    } else {
      addSetup(setupData)
    }
    router.back()
  }

  const handleDelete = () => {
    if (!editedSetup) return
    removeSetup(editedSetup.id)
    router.replace("/tools/journal/gear")
  }

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={editedSetup ? t("editTitle") : t("title")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>

          <View style={addSetupStyles.heroCard}>
            <View style={addSetupStyles.heroCard.label}>
              <Pencil size={11} color={app_colors.ambre.main} />
              <Text style={addSetupStyles.heroCard.label.text}>
                {t("fields.name.label")}<Text style={addSetupStyles.heroCard.label.required}> *</Text>
              </Text>
            </View>
            <View style={[addSetupStyles.heroCard.nameField, showNameError && addSetupStyles.heroCard.nameField.error]}>
              <TextInput
                style={addSetupStyles.heroCard.nameInput}
                value={name}
                onChangeText={handleNameChange}
                placeholder={t("fields.name.placeholder")}
                placeholderTextColor={withOpacity(app_colors.white, 0.5)}
              />
            </View>
            {showNameError && <Text style={addSetupStyles.heroCard.nameError}>{t("fields.name.error")}</Text>}
            <View style={addSetupStyles.heroCard.descriptionField}>
              <TextInput
                style={addSetupStyles.heroCard.descriptionInput}
                value={description}
                onChangeText={setDescription}
                placeholder={t("fields.description.placeholder")}
                placeholderTextColor={withOpacity(app_colors.white, 0.5)}
                multiline
              />
            </View>

            <View style={addSetupStyles.heroCard.pieceCount}>
              <Text style={addSetupStyles.heroCard.pieceCount.value}>{pieceCount}</Text>
              <Text style={addSetupStyles.heroCard.pieceCount.label}>{pieceCount > 1 ? t("pieceCount_other") : t("pieceCount_one")}</Text>
            </View>
          </View>

          <View style={addSetupStyles.compositionSection}>
            <SectionHeader title={t("sections.composition.title")} />

            <CompositionCategory
              title={t("categories.telescope.title")}
              badge={t("badges.single")}
              items={userScopes.map(scope => ({ id: scope.id, label: gearName(scope.name, scope.brand, scope.model, t("categories.telescope.title")) }))}
              selectedIds={selectedScopeId ? [selectedScopeId] : []}
              onToggle={(id) => toggleSingleSelect(setSelectedScopeId, id)}
              emptyStateLabel={t("emptyState.telescope")}
              addRoute="/tools/journal/gear/telescopes/add"
            />

            <CompositionCategory
              title={t("categories.mount.title")}
              badge={t("badges.single")}
              items={userMounts.map(mount => ({ id: mount.id, label: gearName(mount.name, mount.brand, mount.model, t("categories.mount.title")) }))}
              selectedIds={selectedMountId ? [selectedMountId] : []}
              onToggle={(id) => toggleSingleSelect(setSelectedMountId, id)}
              emptyStateLabel={t("emptyState.mount")}
              addRoute="/tools/journal/gear/mounts/add"
            />

            <CompositionCategory
              title={t("categories.eyepieces.title")}
              badge={t("badges.multiple")}
              items={userEyepieces.map(eyepiece => ({ id: eyepiece.id, label: gearName(eyepiece.name, eyepiece.brand, eyepiece.model, t("categories.eyepieces.title")) }))}
              selectedIds={selectedEyepieceIds}
              onToggle={(id) => toggleInArray(setSelectedEyepieceIds, id)}
              emptyStateLabel={t("emptyState.eyepieces")}
              addRoute="/tools/journal/gear/eyepieces/add"
            />

            <CompositionCategory
              title={t("categories.filters.title")}
              badge={t("badges.multiple")}
              items={userFilters.map(filter => ({ id: filter.id, label: gearName(filter.name, filter.brand, filter.model, t("categories.filters.title")) }))}
              selectedIds={selectedFilterIds}
              onToggle={(id) => toggleInArray(setSelectedFilterIds, id)}
              emptyStateLabel={t("emptyState.filters")}
              addRoute="/tools/journal/gear/filters/add"
            />

            <CompositionCategory
              title={t("categories.cameras.title")}
              badge={t("badges.multiple")}
              items={userCameras.map(camera => ({ id: camera.id, label: gearName(camera.name, camera.brand, camera.model, t("categories.cameras.title")) }))}
              selectedIds={selectedCameraIds}
              onToggle={(id) => toggleInArray(setSelectedCameraIds, id)}
              emptyStateLabel={t("emptyState.cameras")}
              addRoute="/tools/journal/gear/cameras/add"
            />

            <CompositionCategory
              title={t("categories.guideScope.title")}
              badge={t("badges.single")}
              items={userGuideScopes.map(guideScope => ({ id: guideScope.id, label: gearName(guideScope.name, guideScope.brand, guideScope.model, t("categories.guideScope.title")) }))}
              selectedIds={selectedGuideScopeId ? [selectedGuideScopeId] : []}
              onToggle={(id) => toggleSingleSelect(setSelectedGuideScopeId, id)}
              emptyStateLabel={t("emptyState.guideScope")}
              addRoute="/tools/journal/gear/guide-scopes/add"
            />

            <CompositionCategory
              title={t("categories.guideCamera.title")}
              badge={t("badges.single")}
              items={userCameras.map(camera => ({ id: camera.id, label: gearName(camera.name, camera.brand, camera.model, t("categories.cameras.title")) }))}
              selectedIds={selectedGuideCameraId ? [selectedGuideCameraId] : []}
              onToggle={(id) => toggleSingleSelect(setSelectedGuideCameraId, id)}
              emptyStateLabel={t("emptyState.guideCamera")}
              addRoute="/tools/journal/gear/cameras/add"
            />

            <CompositionCategory
              title={t("categories.focusers.title")}
              badge={t("badges.multiple")}
              items={userFocusers.map(focuser => ({ id: focuser.id, label: gearName(focuser.name, focuser.brand, focuser.model, t("categories.focusers.title")) }))}
              selectedIds={selectedFocuserIds}
              onToggle={(id) => toggleInArray(setSelectedFocuserIds, id)}
              emptyStateLabel={t("emptyState.focusers")}
              addRoute="/tools/journal/gear/focusers/add"
            />
          </View>

          <View style={addSetupStyles.actions}>
            <TouchableOpacity style={addSetupStyles.actions.saveButton} onPress={handleSave}>
              <Text style={addSetupStyles.actions.saveButton.text}>{editedSetup ? t("actions.update") : t("actions.save")}</Text>
            </TouchableOpacity>
            {
              editedSetup && (
                <TouchableOpacity style={addSetupStyles.actions.deleteButton} onPress={handleDelete}>
                  <Trash2 color={app_colors.red.main} size={18} />
                  <Text style={addSetupStyles.actions.deleteButton.text}>{t("actions.delete")}</Text>
                </TouchableOpacity>
              )
            }
          </View>

        </View>
      </ScrollView>
    </View>
  )
}

export default AddSetup
