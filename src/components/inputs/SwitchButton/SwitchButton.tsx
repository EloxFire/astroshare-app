import { TouchableOpacity, View } from "react-native";
import { switchButtonStyles } from "./SwitchButton.styles";

const SwitchButton = ({ isEnabled, onToggle }: { isEnabled: boolean; onToggle: () => void }) => {
  return (
    <TouchableOpacity
      style={[
        switchButtonStyles.switchContainer,
        isEnabled ? switchButtonStyles.enabled : switchButtonStyles.disabled,
      ]}
      onPress={onToggle}
    >
      <View
        style={[
          switchButtonStyles.switchCircle,
          isEnabled ? switchButtonStyles.circleEnabled : switchButtonStyles.circleDisabled,
        ]}
      />
    </TouchableOpacity>
  );
};

export default SwitchButton;