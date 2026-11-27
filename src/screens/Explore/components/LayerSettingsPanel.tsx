import { Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { Cloud, Compass, LayoutGrid, type LucideIcon, Mountain, Network } from "lucide-react-native";
import SwitchButton from "../../../components/inputs/SwitchButton/SwitchButton";
import { DARK_GLASS_ICON } from "../../../helpers/planetarium/utils/darkGlass";
import type { LayerVisibility } from "../ExploreScreen.layers";
import { layerSettingsPanelStyles as styles } from "./LayerSettingsPanel.styles";

interface LayerSettingsPanelProps {
  visible: boolean;
  layerVisibility: LayerVisibility;
  onToggle: (key: keyof LayerVisibility) => void;
  onClose: () => void;
  top: number;
}

const ROWS: { key: keyof LayerVisibility; icon: LucideIcon; titleKey: string }[] = [
  { key: "constellations", icon: Network, titleKey: "layers.constellations" },
  { key: "eqGrid", icon: LayoutGrid, titleKey: "layers.eqGrid" },
  { key: "azGrid", icon: Compass, titleKey: "layers.azGrid" },
  { key: "ground", icon: Mountain, titleKey: "layers.ground" },
  { key: "atmosphere", icon: Cloud, titleKey: "layers.atmosphere" },
];

/**
 * Panneau de bascule des couches (phase 7) : pas une feuille à la EclipseCircumstancesSheet/
 * ObjectSelectionSheet (trop pour 5 réglages), juste une petite carte flottante ancrée sous le bouton
 * qui l'ouvre, avec un fond transparent plein écran DERRIÈRE elle pour se fermer au tap en dehors
 * (pattern RN classique : la carte, rendue après/par-dessus, capte ses propres taps en priorité).
 */
const LayerSettingsPanel = ({ visible, layerVisibility, onToggle, onClose, top }: LayerSettingsPanelProps) => {
  const { t } = useTranslation("explore");
  if (!visible) return null;

  return (
    <>
      <TouchableOpacity style={styles.backdrop} activeOpacity={1} onPress={onClose} />
      <View style={[styles.card, { top }]}>
        {ROWS.map((row, index) => (
          <View key={row.key} style={[styles.row, index < ROWS.length - 1 && styles.row.withBorder]}>
            <View style={styles.row.content}>
              <row.icon size={16} color={DARK_GLASS_ICON} />
              <Text style={styles.row.content.title}>{t(row.titleKey)}</Text>
            </View>
            <SwitchButton isEnabled={layerVisibility[row.key]} onToggle={() => onToggle(row.key)} />
          </View>
        ))}
      </View>
    </>
  );
};

export default LayerSettingsPanel;
