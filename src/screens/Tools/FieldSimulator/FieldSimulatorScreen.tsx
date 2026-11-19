import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react-native";
import { globalStyles } from "../../../helpers/globalStyles";
import { ScreenHeader } from "../../../components/layout/ScreenHeader/ScreenHeader";
import { InputWithIcon } from "../../../components/inputs/InputWithIcon/InputWithIcon";
import TabSwitch from "../../../components/inputs/TabSwitch/TabSwitch";
import Button from "../../../components/buttons/Button/Button";
import { useUserDataStore } from "../../../store/userData.store";
import { useObjectSearch } from "../../../hooks/useObjectSearch";
import { getCatalogObjectTitle } from "../../../helpers/journal/sessions";
import { getObjectById } from "../../../helpers/api/catalog/objects";
import { CatalogObjectDetail } from "../../../types/catalog/CatalogObject";
import { formatLocaleNumber } from "../../../helpers/format";
import { getFieldSimulatorCombos, getComboLabel } from "../../../helpers/fieldSimulator/setupCombos";
import { getObjectAngularSize } from "../../../helpers/fieldSimulator/objectAngularSize";
import { formatAngularSizeLabel, formatFieldOfViewValue, getComboFieldOfView, getComboMagnification, getFieldFitResult } from "../../../helpers/fieldSimulator/fieldOfView";
import ComboResultCard from "./components/ComboResultCard/ComboResultCard";
import { comboResultCardStyles } from "./components/ComboResultCard/ComboResultCard.styles";
import ComboSelectionList, { ComboSelectionRow } from "./components/ComboSelectionList/ComboSelectionList";
import { fieldSimulatorScreenStyles } from "./FieldSimulatorScreen.styles";

const MAX_COMPARED_SETUPS = 4;

// Objets mis en avant par défaut (ids stables du catalogue, vérifiés en direct). Volontairement
// limités au ciel profond + Lune : seuls objets dont la taille angulaire est fiable — voir
// objectAngularSize.ts pour le reste du système solaire (recherche possible, pas mis en avant ici).
const QUICK_PICK_OBJECTS: { id: string; label: string }[] = [
  { id: "NGC1976", label: "M 42" },
  { id: "NGC0224", label: "M 31" },
  { id: "Mel022", label: "Pléiades" },
  { id: "NGC6205", label: "M 13" },
  { id: "SS-MOON", label: "Lune" },
];

const FieldSimulatorScreen = () => {
  const { t, i18n } = useTranslation("tools/fieldSimulator");

  const setups = useUserDataStore((state) => state.gear.setups);
  const combos = useMemo(() => getFieldSimulatorCombos(setups), [setups]);

  const [searchQuery, setSearchQuery] = useState("");
  const { results: objectSearchResults, search: searchObjects } = useObjectSearch();

  // Rien de présélectionné par défaut (ni objet, ni setup) : l'utilisateur choisit explicitement
  // les deux avant de voir un résultat, plutôt qu'un M 42 + premier setup posés d'office.
  const [selectedObjectId, setSelectedObjectId] = useState<string | null>(null);
  const [objectDetail, setObjectDetail] = useState<CatalogObjectDetail | null>(null);
  // Distingue "pas encore chargé" de "chargé, sans taille angulaire exploitable" (étoile, petit
  // corps...) : sans ce flag, l'état vide "taille indisponible" apparaîtrait brièvement à chaque
  // changement d'objet, le temps du fetch, avant que objectDetail ne soit à jour.
  const [objectLoading, setObjectLoading] = useState(false);

  const [mode, setMode] = useState<"single" | "compare">("single");
  const [selectedComboId, setSelectedComboId] = useState<string | null>(null);
  const [comparedComboIds, setComparedComboIds] = useState<string[]>([]);

  useEffect(() => {
    if (!selectedObjectId) { setObjectDetail(null); setObjectLoading(false); return; }

    let cancelled = false;
    setObjectLoading(true);
    (async () => {
      const detail = await getObjectById(selectedObjectId);
      if (cancelled) return;
      setObjectDetail(detail);
      setObjectLoading(false);
    })();
    return () => { cancelled = true; };
  }, [selectedObjectId]);

  // Ne fait que retirer une sélection devenue invalide (gear supprimé pendant que l'écran est
  // ouvert) : ne présélectionne jamais à la place, contrairement à une première version de cet
  // écran — voir le commentaire au-dessus des états.
  useEffect(() => {
    setSelectedComboId((current) => current && combos.some((combo) => combo.id === current) ? current : null);
  }, [combos]);

  useEffect(() => {
    setComparedComboIds((current) => current.filter((id) => combos.some((combo) => combo.id === id)));
  }, [combos]);

  const angularSize = useMemo(() => objectDetail ? getObjectAngularSize(objectDetail) : null, [objectDetail]);

  const comboRows = useMemo(() => combos.map((combo) => {
    const fieldOfView = getComboFieldOfView(combo);
    const fitResult = fieldOfView && angularSize ? getFieldFitResult(fieldOfView, angularSize) : null;
    const label = getComboLabel(combo, t("combos.unnamedScope"), t("combos.unnamedEyepiece"), t("combos.unnamedCamera"));

    const subtitle = combo.kind === "eyepiece"
      ? t("combos.eyepieceSubtitle", {
          afov: formatLocaleNumber(combo.eyepiece.afov, i18n.language, 0),
          magnification: (() => {
            const magnification = getComboMagnification(combo);
            return magnification ? Math.round(magnification) : "--";
          })(),
        })
      : t("combos.cameraSubtitle", {
          width: formatLocaleNumber(combo.camera.sensorSize.width, i18n.language, 1),
          height: formatLocaleNumber(combo.camera.sensorSize.height, i18n.language, 1),
        });

    const value = fieldOfView
      ? formatFieldOfViewValue(fieldOfView.shape === "circle" ? fieldOfView.diameterDegrees : fieldOfView.widthDegrees, i18n.language, formatLocaleNumber)
      : "--";

    return { combo, fieldOfView, fitResult, label, subtitle, value };
  }), [combos, angularSize, i18n.language, t]);

  const selectionRows: ComboSelectionRow[] = comboRows.map(({ combo, label, subtitle, value }) => ({ combo, label, subtitle, value }));

  const handleSearchQueryChange = (text: string) => {
    setSearchQuery(text);
    searchObjects(text);
  };

  // Même principe que la recherche d'objet dans AddSession : InputWithIcon ne porte qu'un libellé
  // (string) par suggestion, on retrouve l'objet complet par position dans les résultats. Le champ
  // garde le libellé choisi comme texte réel (pas un placeholder qui réapparaîtrait tout seul) :
  // il reste éditable pour relancer une recherche, et se vide pour de bon si l'utilisateur l'efface.
  const handleObjectSuggestionPress = (suggestion: string) => {
    const pickedObject = objectSearchResults[objectSearchResults.map(getCatalogObjectTitle).indexOf(suggestion)];
    if (!pickedObject) return;
    setSelectedObjectId(pickedObject.id);
    setSearchQuery(suggestion);
    searchObjects("");
  };

  const handleQuickPick = (objectId: string, label: string) => {
    setSelectedObjectId(objectId);
    setSearchQuery(label);
    searchObjects("");
  };

  const handleCompareToggle = (comboId: string) => {
    setComparedComboIds((current) => {
      if (current.includes(comboId)) return current.filter((id) => id !== comboId);
      if (current.length >= MAX_COMPARED_SETUPS) return current;
      return [...current, comboId];
    });
  };

  const selectedRow = comboRows.find((row) => row.combo.id === selectedComboId) ?? null;
  const comparedRows = comboRows.filter((row) => comparedComboIds.includes(row.combo.id));

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("screen.title")} subtitle={t("screen.subtitle")} main={false} />

      {/* keyboardShouldPersistTaps="handled" : sinon, clavier ouvert, le premier appui sur une
          suggestion de recherche ne fait que le fermer au lieu de la sélectionner (voir le même
          commentaire dans InputWithIcon). */}
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={globalStyles.content}>

          <View style={fieldSimulatorScreenStyles.searchRow}>
            <InputWithIcon
              icon={Search}
              action={() => {}}
              placeholder={t("search.placeholder")}
              value={searchQuery}
              onChangeText={handleSearchQueryChange}
              suggestions={objectSearchResults.map(getCatalogObjectTitle)}
              onSuggestionPress={handleObjectSuggestionPress}
            />
            {
              angularSize && (
                <Text style={fieldSimulatorScreenStyles.angularSizeCaption}>
                  {formatAngularSizeLabel(angularSize, i18n.language, formatLocaleNumber)}
                </Text>
              )
            }
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={fieldSimulatorScreenStyles.pillsRow.content}>
            {
              QUICK_PICK_OBJECTS.map((quickPick) => {
                const label = t(`quickPicks.${quickPick.id}`, { defaultValue: quickPick.label });
                return (
                  <TouchableOpacity
                    key={quickPick.id}
                    style={[fieldSimulatorScreenStyles.pillsRow.pill, selectedObjectId === quickPick.id && fieldSimulatorScreenStyles.pillsRow.pill.active]}
                    onPress={() => handleQuickPick(quickPick.id, label)}
                  >
                    <Text style={[fieldSimulatorScreenStyles.pillsRow.pill.text, selectedObjectId === quickPick.id && fieldSimulatorScreenStyles.pillsRow.pill.active.text]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })
            }
          </ScrollView>

          <TabSwitch
            tabs={[{ text: t("mode.single") }, { text: t("mode.compare") }]}
            activeTab={mode === "single" ? 0 : 1}
            onTabPress={(index) => setMode(index === 0 ? "single" : "compare")}
          />

          {
            combos.length === 0 ? (
              <View style={[globalStyles.defaultCard, fieldSimulatorScreenStyles.emptyState]}>
                <Text style={fieldSimulatorScreenStyles.emptyState.text}>{t("combos.empty")}</Text>
                <Button label={t("combos.addSetup")} onPress={() => router.push("/tools/journal/gear/setups/add")} />
              </View>
            ) : (
              <>
                {/* Zone d'aperçu : rien de présélectionné (objet ou setup), donc un texte d'invite
                    tant que l'un des deux manque, plutôt qu'un espace vide qui semblerait cassé. */}
                {
                  objectLoading ? null : !selectedObjectId ? (
                    <View style={[globalStyles.defaultCard, fieldSimulatorScreenStyles.emptyState]}>
                      <Text style={fieldSimulatorScreenStyles.emptyState.text}>{t("preview.noObjectSelected")}</Text>
                    </View>
                  ) : !angularSize ? (
                    <View style={[globalStyles.defaultCard, fieldSimulatorScreenStyles.emptyState]}>
                      <Text style={fieldSimulatorScreenStyles.emptyState.text}>{t("preview.noAngularSize")}</Text>
                    </View>
                  ) : mode === "single" ? (
                    selectedRow?.fieldOfView ? (
                      <View style={fieldSimulatorScreenStyles.hero}>
                        <ComboResultCard
                          combo={selectedRow.combo}
                          objectPrimary={objectDetail?.primary ?? ""}
                          fieldOfView={selectedRow.fieldOfView}
                          angularSize={angularSize}
                          fitResult={selectedRow.fitResult}
                          size={240}
                        />
                      </View>
                    ) : (
                      <View style={[globalStyles.defaultCard, fieldSimulatorScreenStyles.emptyState]}>
                        <Text style={fieldSimulatorScreenStyles.emptyState.text}>{t("combos.noneSelected")}</Text>
                      </View>
                    )
                  ) : comparedRows.length > 0 ? (
                    <View style={comboResultCardStyles.grid}>
                      {
                        comparedRows.map((row) => row.fieldOfView && (
                          <View key={row.combo.id} style={comboResultCardStyles.grid.item}>
                            <ComboResultCard
                              combo={row.combo}
                              objectPrimary={objectDetail?.primary ?? ""}
                              fieldOfView={row.fieldOfView}
                              angularSize={angularSize}
                              fitResult={row.fitResult}
                              size={140}
                              compact
                            />
                          </View>
                        ))
                      }
                    </View>
                  ) : (
                    <View style={[globalStyles.defaultCard, fieldSimulatorScreenStyles.emptyState]}>
                      <Text style={fieldSimulatorScreenStyles.emptyState.text}>{t("combos.noneCompared")}</Text>
                    </View>
                  )
                }

                {
                  mode === "single" ? (
                    <ComboSelectionList
                      title={t("combos.singleTitle")}
                      rows={selectionRows}
                      selectedComboIds={selectedComboId ? [selectedComboId] : []}
                      onToggle={setSelectedComboId}
                    />
                  ) : (
                    <ComboSelectionList
                      title={t("combos.compareTitle", { count: comparedComboIds.length, max: MAX_COMPARED_SETUPS })}
                      rows={selectionRows}
                      selectedComboIds={comparedComboIds}
                      onToggle={handleCompareToggle}
                    />
                  )
                }
              </>
            )
          }

        </View>
      </ScrollView>
    </View>
  );
};

export default FieldSimulatorScreen;
