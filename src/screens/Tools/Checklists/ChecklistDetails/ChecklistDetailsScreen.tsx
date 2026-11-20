import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { router, useLocalSearchParams } from "expo-router";
import { Plus, RotateCcw, Trash2 } from "lucide-react-native";
import { globalStyles } from "../../../../helpers/globalStyles";
import { app_colors, withOpacity } from "../../../../helpers/variables";
import { generateCustomId } from "../../../../helpers/ids";
import { ScreenHeader } from "../../../../components/layout/ScreenHeader/ScreenHeader";
import SectionHeader from "../../../../components/layout/SectionHeader/SectionHeader";
import Badge from "../../../../components/Badges/Badge/Badge";
import { InputWithIcon } from "../../../../components/inputs/InputWithIcon/InputWithIcon";
import CircularGauge from "../../../../components/charts/CircularGauge/CircularGauge";
import ConfirmModal from "../../../../components/overlays/ConfirmModal/ConfirmModal";
import { useUserDataStore } from "../../../../store/userData.store";
import type { ChecklistItem } from "../../../../types/checklists/Checklist";
import ChecklistItemRow from "./components/ChecklistItemRow/ChecklistItemRow";
import { checklistDetailsScreenStyles } from "./ChecklistDetailsScreen.styles";

const ChecklistDetailsScreen = () => {
  const { t } = useTranslation("tools/checklists/detail");

  const checklistId = useLocalSearchParams().id as string;
  const checklists = useUserDataStore((state) => state.checklists);
  const addChecklistItem = useUserDataStore((state) => state.addChecklistItem);
  const removeChecklistItem = useUserDataStore((state) => state.removeChecklistItem);
  const toggleChecklistItem = useUserDataStore((state) => state.toggleChecklistItem);
  const uncheckAllChecklistItems = useUserDataStore((state) => state.uncheckAllChecklistItems);
  const removeChecklist = useUserDataStore((state) => state.removeChecklist);

  const checklist = checklists.find((list) => list.id === checklistId);

  const [newItemLabel, setNewItemLabel] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Pas de router.push direct pendant le rendu (même raison que dans TelescopeDetails) : après
  // suppression, `checklist` passe à undefined au prochain rendu, et c'est cet effet qui gère le
  // retour une fois ce rendu terminé.
  useEffect(() => {
    if (!checklist) {
      router.back();
    }
  }, [checklist]);

  if (!checklist) return null;

  const total = checklist.items.length;
  const checkedCount = checklist.items.filter((item) => item.checked).length;
  const remaining = total - checkedCount;
  const uncheckedItems = checklist.items.filter((item) => !item.checked);
  const checkedItems = checklist.items.filter((item) => item.checked);

  const subtitle = total === 0
    ? t("empty")
    : remaining === 0
      ? t("allChecked")
      : t("subtitle", { count: remaining });

  const handleAddItem = () => {
    const trimmedLabel = newItemLabel.trim();
    if (!trimmedLabel) return;

    const newItem: ChecklistItem = { id: generateCustomId(), label: trimmedLabel, checked: false };
    addChecklistItem(checklist.id, newItem);
    setNewItemLabel("");
  };

  // Suppression d'une liste entière (tous ses éléments avec) : contrairement aux suppressions de
  // fiches de matériel ailleurs dans l'app (bouton rouge en bas de l'écran, sans confirmation), le
  // déclencheur est ici une icône dans l'en-tête — plus facile à toucher par mégarde — d'où une
  // confirmation (ConfirmModal, pas de précédent ailleurs dans l'app mais un filet de sécurité qui
  // semble mérité pour une action aussi facilement accessible).
  const handleConfirmDelete = () => {
    setIsDeleteModalOpen(false);
    removeChecklist(checklist.id);
  };

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader backgroundColor={app_colors.primary.main} title={checklist.name} subtitle={subtitle} />

      <ScrollView>
        <View style={checklistDetailsScreenStyles.heroHeader}>
          <View style={checklistDetailsScreenStyles.heroHeader.topRow}>
            <View style={checklistDetailsScreenStyles.heroHeader.progressRow}>
              <CircularGauge
                value={checkedCount}
                max={total || 1}
                size={56}
                strokeWidth={5}
                progressColor={app_colors.yellow.main}
                trackColor={withOpacity(app_colors.white, 0.25)}
              >
                <Text style={checklistDetailsScreenStyles.heroHeader.progressRow.ringValue}>{total === 0 ? "-" : `${checkedCount}/${total}`}</Text>
              </CircularGauge>

              {
                checkedCount > 0 && (
                  <View style={checklistDetailsScreenStyles.heroHeader.progressRow.badgeWrapper}>
                    <Badge
                      text={t("uncheckAll")}
                      icon={RotateCcw}
                      backgroundColor={withOpacity(app_colors.white, 0.15)}
                      foregroundColor={app_colors.white}
                      action={() => uncheckAllChecklistItems(checklist.id)}
                    />
                  </View>
                )
              }
            </View>

            <TouchableOpacity
              style={checklistDetailsScreenStyles.heroHeader.deleteButton}
              onPress={() => setIsDeleteModalOpen(true)}
              accessibilityRole="button"
              accessibilityLabel={t("deleteButtonAccessibilityLabel")}
              hitSlop={8}
            >
              <Trash2 size={16} color={app_colors.white} />
            </TouchableOpacity>
          </View>

        </View>

        <View style={globalStyles.content}>
          {checklist.description && <Text style={checklistDetailsScreenStyles.description}>{checklist.description}</Text>}

          <View style={checklistDetailsScreenStyles.addItemRow}>
            <InputWithIcon
              fill
              placeholder={t("addItemPlaceholder")}
              value={newItemLabel}
              onChangeText={setNewItemLabel}
              action={handleAddItem}
            />
            <TouchableOpacity
              style={[checklistDetailsScreenStyles.addItemRow.addButton, !newItemLabel.trim() && checklistDetailsScreenStyles.addItemRow.addButton.disabled]}
              onPress={handleAddItem}
              disabled={!newItemLabel.trim()}
              accessibilityRole="button"
              accessibilityLabel={t("addItemAccessibilityLabel")}
            >
              <Plus size={20} color={app_colors.white} />
            </TouchableOpacity>
          </View>

          <View>
            <SectionHeader title={t("toCheckSection")} subtitle={String(uncheckedItems.length)} />
            {
              uncheckedItems.length === 0 ? (
                <Text style={checklistDetailsScreenStyles.emptySection}>{t("toCheckEmpty")}</Text>
              ) : (
                uncheckedItems.map((item) => (
                  <ChecklistItemRow
                    key={item.id}
                    label={item.label}
                    checked={item.checked}
                    onToggle={() => toggleChecklistItem(checklist.id, item.id)}
                    onRemove={() => removeChecklistItem(checklist.id, item.id)}
                  />
                ))
              )
            }
          </View>

          {
            checkedItems.length > 0 && (
              <View>
                <SectionHeader title={t("checkedSection")} subtitle={String(checkedItems.length)} />
                {
                  checkedItems.map((item) => (
                    <ChecklistItemRow
                      key={item.id}
                      label={item.label}
                      checked={item.checked}
                      onToggle={() => toggleChecklistItem(checklist.id, item.id)}
                      onRemove={() => removeChecklistItem(checklist.id, item.id)}
                    />
                  ))
                }
              </View>
            )
          }
        </View>
      </ScrollView>

      <ConfirmModal
        visible={isDeleteModalOpen}
        title={t("deleteConfirmTitle", { name: checklist.name })}
        message={t("deleteConfirmMessage", { count: total })}
        confirmLabel={t("deleteConfirmConfirm")}
        cancelLabel={t("deleteConfirmCancel")}
        destructive
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </View>
  );
};

export default ChecklistDetailsScreen;
