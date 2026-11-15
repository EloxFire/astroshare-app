import { Keyboard, Platform, Text, View } from "react-native";
import { toastStyles } from "./Toast.styles";
import { useEffect, useState } from "react";

function Toast() {

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => setKeyboardHeight(e.endCoordinates.height));
    const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardHeight(0));

    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  return (
    <View style={[toastStyles.toast, { bottom: keyboardHeight > 0 ? keyboardHeight + 20 : 20 }]}>
      <Text>Je suis un toast</Text>
    </View>
  )
}

export default Toast;