import { useEffect, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Satellite } from "lucide-react-native";
import { addSatelliteModalStyles } from "./AddSatelliteModal.styles";
import { app_colors } from "../../../../../helpers/variables";
import { InputWithIcon } from "../../../../../components/inputs/InputWithIcon/InputWithIcon";
import Button from "../../../../../components/buttons/Button/Button";
import { useDebounce } from "../../../../../hooks/useDebounce";
import { getNoradSatellite } from "../../../../../helpers/api/satellites/norad";
import { resolveObjectTypeKey, resolveOpsStatusKey } from "../../../../../helpers/satellites/labels";
import { useUserDataStore } from "../../../../../store/userData.store";
import type { NoradSatellite } from "../../../../../types/satellites/NoradSatellite";

interface AddSatelliteModalProps {
  onClose: () => void;
}

/**
 * Panneau "Ajouter un satellite" : saisie d'un ID NORAD, prévisualisation (nom, type, statut) via
 * le catalogue, puis ajout à "Mes satellites" (store local, voir userData.store.ts — pas de route
 * API dédiée à une liste de suivi côté serveur).
 */
const AddSatelliteModal = ({ onClose }: AddSatelliteModalProps) => {
  const { t } = useTranslation("tools/satelliteTracker");
  const trackedSatellites = useUserDataStore((state) => state.trackedSatellites);
  const addTrackedSatellite = useUserDataStore((state) => state.addTrackedSatellite);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<NoradSatellite | null>(null);
  const [searched, setSearched] = useState(false);

  const lookup = useDebounce(async (query: string) => {
    if (!query.trim()) {
      setPreview(null);
      setSearched(false);
      return;
    }
    setIsLoading(true);
    const result = await getNoradSatellite(query.trim());
    setPreview(result);
    setSearched(true);
    setIsLoading(false);
  }, 400);

  useEffect(() => {
    lookup(inputValue);
  }, [inputValue, lookup]);

  const alreadyTracked = preview ? trackedSatellites.includes(preview.norad_id) : false;

  const handleConfirm = () => {
    if (!preview || alreadyTracked) return;
    addTrackedSatellite(preview.norad_id);
    onClose();
  };

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={addSatelliteModalStyles.backdrop} onPress={onClose}>
        <Pressable style={addSatelliteModalStyles.sheet} onPress={(event) => event.stopPropagation()}>
          <Text style={addSatelliteModalStyles.title}>{t("addModal.title")}</Text>

          <InputWithIcon
            icon={Satellite}
            label={t("addModal.label")}
            placeholder={t("addModal.placeholder")}
            value={inputValue}
            onChangeText={setInputValue}
            keyboardType="number-pad"
            action={() => lookup(inputValue)}
          />
          <Text style={addSatelliteModalStyles.helper}>{t("addModal.helper")}</Text>

          {!isLoading && preview && (
            <View style={addSatelliteModalStyles.preview}>
              <View style={addSatelliteModalStyles.preview.badge}>
                <Satellite size={18} color={app_colors.accent.main} />
              </View>
              <View style={addSatelliteModalStyles.preview.texts}>
                <Text style={addSatelliteModalStyles.preview.texts.title} numberOfLines={1}>{preview.object_name}</Text>
                <Text style={addSatelliteModalStyles.preview.texts.subtitle} numberOfLines={1}>
                  {`${t(`objectType.${resolveObjectTypeKey(preview.object_type.label)}`)} · ${t(`opsStatus.${resolveOpsStatusKey(preview.ops_status.label)}`)}${preview.launch_date ? ` · ${new Date(preview.launch_date).getFullYear()}` : ""}`}
                </Text>
              </View>
            </View>
          )}

          {!isLoading && searched && !preview && (
            <Text style={addSatelliteModalStyles.notFound}>{t("addModal.notFound")}</Text>
          )}

          <Button
            label={alreadyTracked ? t("addModal.alreadyTracked") : t("addModal.confirm")}
            onPress={handleConfirm}
            disabled={!preview || alreadyTracked}
            loading={isLoading}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AddSatelliteModal;
