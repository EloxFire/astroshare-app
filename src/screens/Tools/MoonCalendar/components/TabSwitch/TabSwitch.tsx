import { Text, TouchableOpacity, View } from "react-native"
import { tabSwitchStyles } from "./TabSwitch.styles";


interface TabSwitchProps {
  tabs: string[];
  activeTab?: number;
  onTabPress?: (index: number) => void;
}

const TabSwitch = ({ tabs, activeTab, onTabPress }: TabSwitchProps) => {
  return (
    <View style={tabSwitchStyles.container}>
      {tabs.map((tab, index) => (
        <TouchableOpacity
          style={[
            tabSwitchStyles.container.tab,
            activeTab === index && tabSwitchStyles.container.tab.active,
          ]}
          key={index}
          onPress={() => {
            if (typeof onTabPress === "function") {
              onTabPress(index);
            }
          }}
        >
          <Text style={[tabSwitchStyles.container.tab.title, activeTab === index && tabSwitchStyles.container.tab.title.active]}>{tab}</Text>
        </TouchableOpacity>
      ))}
    </View>
  )
}

export default TabSwitch;