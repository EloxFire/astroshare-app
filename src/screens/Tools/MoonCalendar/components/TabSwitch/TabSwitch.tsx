import { Text, TouchableOpacity, View } from "react-native"
import { tabSwitchStyles } from "./TabSwitch.styles";
import { LucideIcon } from "lucide-react-native";
import { app_colors } from "../../../../../helpers/variables";


interface TabSwitchProps {
  tabs: {text: string, icon?: LucideIcon}[];
  activeTab?: number;
  onTabPress?: (index: number) => void;
  // false (défaut) : les onglets se partagent toute la largeur disponible (flex:1).
  // true : chaque onglet prend la largeur de son texte, et le switch celle de ses onglets — pour le
  // placer en ligne à côté d'autres éléments. Sans ça, dans une ligne, un conteneur dont les enfants
  // sont en flex:1 réclame toute la largeur disponible et pousse ses voisins (ou se fait pousser)
  // hors de l'écran.
  fitContent?: boolean;
  activeTabForegroundColor?: string;
}

const TabSwitch = ({ tabs, activeTab, onTabPress, fitContent = false, activeTabForegroundColor }: TabSwitchProps) => {
  return (
    <View style={tabSwitchStyles.container}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          style={[
            tabSwitchStyles.container.tab,
            fitContent && tabSwitchStyles.container.tab.fitContent,
            activeTab === index && tabSwitchStyles.container.tab.active,
          ]}
          key={index}
          onPress={() => {
            if (typeof onTabPress === "function") {
              onTabPress(index);
            }
          }}
        >
          {tab.icon && <tab.icon size={16} color={activeTab === index ? activeTabForegroundColor ?? app_colors.primary.medium : app_colors.primary.medium} style={{marginRight: 5}} />}
          <Text style={[tabSwitchStyles.container.tab.title, activeTab === index && tabSwitchStyles.container.tab.title.active, activeTab === index && activeTabForegroundColor ? { color: activeTabForegroundColor } : {}]}>{tab.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default TabSwitch;