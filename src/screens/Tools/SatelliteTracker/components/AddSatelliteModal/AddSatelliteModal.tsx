import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Modal, Platform, Pressable, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Satellite, Search } from "lucide-react-native";
import { addSatelliteModalStyles } from "./AddSatelliteModal.styles";
import { app_colors } from "../../../../../helpers/variables";
import { InputWithIcon } from "../../../../../components/inputs/InputWithIcon/InputWithIcon";
import Button from "../../../../../components/buttons/Button/Button";
import { useDebounce } from "../../../../../hooks/useDebounce";
import { useSatelliteNameSearch } from "../../../../../hooks/useSatelliteNameSearch";
import { getNoradSatellite } from "../../../../../helpers/api/satellites/norad";
import { resolveObjectTypeKey, resolveOpsStatusKey } from "../../../../../helpers/satellites/labels";
import { useUserDataStore } from "../../../../../store/userData.store";
import type { NoradSatellite } from "../../../../../types/satellites/NoradSatellite";

interface AddSatelliteModalProps {
  onClose: () => void;
}

// Le NORAD id lève toute ambiguïté entre deux résultats de même nom (voir handleNameSuggestionPress).
const formatNameSuggestion = (satellite: NoradSatellite) => `${satellite.object_name} · NORAD ${satellite.norad_id}`;

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

  const [nameQuery, setNameQuery] = useState("");
  const { results: nameResults, total: nameResultsTotal, loading: isNameSearchLoading, search: searchByName } = useSatelliteNameSearch();

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

  const handleNameChange = (text: string) => {
    setNameQuery(text);
    searchByName(text);
  };

  // Les suggestions de InputWithIcon ne portent qu'un libellé (string) : le NORAD id y est inclus
  // pour rester unique même entre deux résultats de même nom (ex: plusieurs débris du même lancement).
  const handleNameSuggestionPress = (suggestion: string) => {
    const picked = nameResults[nameResults.map(formatNameSuggestion).indexOf(suggestion)];
    if (!picked) return;

    setPreview(picked);
    setSearched(true);
    setInputValue(String(picked.norad_id));
    setNameQuery("");
    searchByName("");
  };

  const alreadyTracked = preview ? trackedSatellites.includes(preview.norad_id) : false;

  const handleConfirm = () => {
    if (!preview || alreadyTracked) return;
    addTrackedSatellite(preview.norad_id);
    onClose();
  };

  return (
    <Modal visible animationType="slide" transparent onRequestClose={onClose}>
      {/* Une <Modal> RN s'ouvre dans sa propre fenêtre Android (un Dialog), qui n'hérite pas du
          windowSoftInputMode="adjustResize" de l'activité (AndroidManifest.xml) : le système ne
          redimensionne donc rien tout seul, contrairement à un écran normal de l'app. "height" (et
          non "padding", qui ne fait rien sur Android) redimensionne la vue à la main en écoutant la
          hauteur du clavier — ça marche quelle que soit la fenêtre. iOS : padding remonte le panneau. */}
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={addSatelliteModalStyles.backdrop}>
        <Pressable style={addSatelliteModalStyles.dismissArea} onPress={onClose} />

        <View style={addSatelliteModalStyles.sheet}>
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

          <Text style={addSatelliteModalStyles.orDivider}>{t("addModal.or")}</Text>

          <InputWithIcon
            icon={Search}
            label={t("addModal.nameLabel")}
            placeholder={t("addModal.namePlaceholder")}
            value={nameQuery}
            onChangeText={handleNameChange}
            action={() => searchByName(nameQuery)}
            suggestions={nameResults.map(formatNameSuggestion)}
            onSuggestionPress={handleNameSuggestionPress}
          />

          {isNameSearchLoading && (
            <ActivityIndicator size="small" color={app_colors.accent.main} style={addSatelliteModalStyles.nameLoader} />
          )}

          {!isNameSearchLoading && nameResultsTotal > nameResults.length && (
            <Text style={addSatelliteModalStyles.helper}>
              {t("addModal.tooManyResults", { count: nameResultsTotal })}
            </Text>
          )}

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
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddSatelliteModal;
