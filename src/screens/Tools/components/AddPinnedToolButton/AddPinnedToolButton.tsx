import { TouchableOpacity, View } from "react-native";
import { Plus } from "lucide-react-native";
import { app_colors } from "../../../../helpers/variables";
import { addPinnedToolButtonStyles } from "./AddPinnedToolButton.styles";

export default function AddPinnedToolButton() {

  const handleAddPinnedTool = () => {
    console.log("Add pinned tool button pressed");
  }

  return (
    <TouchableOpacity style={addPinnedToolButtonStyles.button} onPress={handleAddPinnedTool}>
      <View style={addPinnedToolButtonStyles.button.square}>
        <Plus color={app_colors.primary.main} />
      </View>
    </TouchableOpacity>
  )
}