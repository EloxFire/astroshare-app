import { View, Pressable, Text } from "react-native";
import type { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { app_colors } from "../../helpers/colors";

const TAB_BAR_HEIGHT = 65;

export const TabBar = ({ state, descriptors, navigation, insets }: BottomTabBarProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        height: TAB_BAR_HEIGHT + insets.bottom,
        paddingBottom: insets.bottom,
        backgroundColor: app_colors.primary,
      }}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const focused = state.index === index;
        const color = focused
          ? options.tabBarActiveTintColor ?? app_colors.accent
          : options.tabBarInactiveTintColor ?? app_colors.white;
        const label = typeof options.tabBarLabel === "string" ? options.tabBarLabel : route.name;

        const onPress = () => {
          const event = navigation.emit({ type: "tabPress", target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        return (
          <Pressable
            key={route.key}
            onPress={onPress}
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            {options.tabBarIcon?.({ focused, color, size: 24 })}
            <Text style={{ fontSize: 12, marginTop: 4, color }}>{label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
};
