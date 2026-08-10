import { Text, View } from "react-native";
import { journalScreenStyles } from "./JournalScreen.styles";

export const JournalScreen = () => {
  return (
    <View style={journalScreenStyles.screen}>
      <View style={journalScreenStyles.content}>
        <Text>Journal Screen</Text>
      </View>
    </View>
  );
};
