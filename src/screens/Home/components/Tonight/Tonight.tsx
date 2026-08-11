import { View, Text } from "react-native";
import { tonightStyles } from "./Tonight.styles";
import { typography } from "../../../../helpers/variables";

export default function Tonight() {
  return (
    <View style={tonightStyles.container}>
      <View style={tonightStyles.container.header}>
        <Text style={typography.ztNature.cardTitle}>À voir ce soir</Text>
      </View>
    </View>
  )
}