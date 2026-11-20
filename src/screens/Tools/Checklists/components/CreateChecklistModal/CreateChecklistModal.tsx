import { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { ListChecks } from "lucide-react-native";
import { InputWithIcon } from "../../../../../components/inputs/InputWithIcon/InputWithIcon";
import Button from "../../../../../components/buttons/Button/Button";
import { useUserDataStore } from "../../../../../store/userData.store";
import { generateCustomId } from "../../../../../helpers/ids";
import type { Checklist } from "../../../../../types/checklists/Checklist";
import { createChecklistModalStyles } from "./CreateChecklistModal.styles";

interface CreateChecklistModalProps {
  onClose: () => void;
}

/**
 * Panneau "Nouvelle liste" : nom (requis) + description (facultative), même structure que
 * AddSatelliteModal (voir ses commentaires pour le piège clavier/Android propre à <Modal>).
 */
const CreateChecklistModal = ({ onClose }: CreateChecklistModalProps) => {
  const { t } = useTranslation("tools/checklists/createModal");
  const addChecklist = useUserDataStore((state) => state.addChecklist);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleConfirm = () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const now = new Date().toISOString();
    const newChecklist: Checklist = {
      id: generateCustomId(),
      name: trimmedName,
      description: description.trim() || null,
      items: [],
      createdAt: now,
      updatedAt: now,
    };

    addChecklist(newChecklist);
    onClose();
    router.push(`/tools/checklists/${newChecklist.id}`);
  };

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={createChecklistModalStyles.backdrop}>
        <Pressable style={createChecklistModalStyles.dismissArea} onPress={onClose} />

        <View style={createChecklistModalStyles.sheet}>
          <Text style={createChecklistModalStyles.title}>{t("title")}</Text>

          <InputWithIcon
            icon={ListChecks}
            label={t("nameLabel")}
            required
            placeholder={t("namePlaceholder")}
            value={name}
            onChangeText={setName}
            action={handleConfirm}
          />

          <InputWithIcon
            label={t("descriptionLabel")}
            placeholder={t("descriptionPlaceholder")}
            value={description}
            onChangeText={setDescription}
            multiline
            action={() => {}}
          />

          <Button label={t("confirm")} onPress={handleConfirm} disabled={!name.trim()} />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default CreateChecklistModal;
