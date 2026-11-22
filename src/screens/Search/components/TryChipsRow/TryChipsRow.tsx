import { ScrollView, Text, TouchableOpacity } from "react-native";
import { tryChipsRowStyles } from "./TryChipsRow.styles";

interface TryChipsRowProps {
  chips: string[];
  onPress: (chip: string) => void;
}

const TryChipsRow = ({ chips, onPress }: TryChipsRowProps) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tryChipsRowStyles.content}>
      {
        chips.map((chip) => (
          <TouchableOpacity key={chip} style={tryChipsRowStyles.chip} onPress={() => onPress(chip)}>
            <Text style={tryChipsRowStyles.chip.text}>{chip}</Text>
          </TouchableOpacity>
        ))
      }
    </ScrollView>
  );
};

export default TryChipsRow;
