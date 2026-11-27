import { Text, TouchableOpacity, View } from "react-native";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Pause, Play, RotateCcw } from "lucide-react-native";
import { DARK_GLASS_ICON, DARK_GLASS_ICON_ACTIVE } from "../../../helpers/planetarium/utils/darkGlass";
import { timeControlPanelStyles as styles } from "./TimeControlPanel.styles";

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

interface TimeControlPanelProps {
  expanded: boolean;
  dateLabel: string;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onAdjust: (deltaMs: number) => void;
  onReset: () => void;
  bottom: number;
}

/**
 * Carte d'horloge, en bas de l'écran — toujours visible (juste la date/heure), les boutons de
 * pas +/-/lecture n'apparaissent que si le bouton "horloge" de la pile a été tapé (`expanded`), comme
 * sur `main` (compact par défaut, déplié à la demande). Statique, pas d'animation d'apparition.
 */
const TimeControlPanel = ({ expanded, dateLabel, isPlaying, onTogglePlay, onAdjust, onReset, bottom }: TimeControlPanelProps) => (
  <View style={[styles.container, { bottom }]} pointerEvents="box-none">
    <View style={styles.card}>
      <Text style={styles.dateText}>{dateLabel}</Text>

      {expanded && (
        <View style={styles.buttons}>
          <TouchableOpacity style={styles.buttons.button} onPress={() => onAdjust(-DAY_MS)}>
            <ChevronsLeft size={16} color={DARK_GLASS_ICON} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttons.button} onPress={() => onAdjust(-HOUR_MS)}>
            <ChevronLeft size={16} color={DARK_GLASS_ICON} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.buttons.button, styles.buttons.playButton]} onPress={onTogglePlay}>
            {isPlaying ? <Pause size={14} color={DARK_GLASS_ICON_ACTIVE} /> : <Play size={14} color={DARK_GLASS_ICON_ACTIVE} />}
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttons.button} onPress={() => onAdjust(HOUR_MS)}>
            <ChevronRight size={16} color={DARK_GLASS_ICON} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttons.button} onPress={() => onAdjust(DAY_MS)}>
            <ChevronsRight size={16} color={DARK_GLASS_ICON} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.buttons.button} onPress={onReset}>
            <RotateCcw size={14} color={DARK_GLASS_ICON} />
          </TouchableOpacity>
        </View>
      )}
    </View>
  </View>
);

export default TimeControlPanel;
