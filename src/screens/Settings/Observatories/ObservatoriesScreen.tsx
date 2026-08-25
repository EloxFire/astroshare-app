import { View } from "react-native"
import { observatoriesScreenStyles } from "./ObservatoriesScreen.styles";
import { ScreenHeader } from "../../../components/ScreenHeader/ScreenHeader";

const ObservatoriesScreen = () => {
  return (
    <View style={observatoriesScreenStyles.screen}>
      <ScreenHeader title="Vos observatoires" main={false} />
      <View style={observatoriesScreenStyles.content}>
        
      </View>
    </View>
  )
}

export default ObservatoriesScreen;