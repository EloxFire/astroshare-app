import { Text, View } from "react-native"
import { DataChip } from "../../types/chips";
import { chipsContainerStyles } from "./ChipsContainer.styles";

interface ChipsContainerProps {
  // Max 3 chips array
  chips: [DataChip, DataChip, DataChip] | [DataChip, DataChip] | [DataChip];
}

const ChipsContainer = ({ chips }: ChipsContainerProps) => {
  return (
    <View style={chipsContainerStyles.container}>
      {chips.map((chip, index) => (
        <View key={index} style={chipsContainerStyles.container.chip}>
          <Text style={chipsContainerStyles.container.chip.title}>{chip.title}</Text>
          <Text style={chipsContainerStyles.container.chip.value}>{chip.value}</Text>
        </View>
      ))}
    </View>
  )
}

export default ChipsContainer;