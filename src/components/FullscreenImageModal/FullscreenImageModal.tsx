import { useRef } from "react";
import { Modal, TouchableOpacity, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Minimize2, X } from "lucide-react-native";
import { app_colors } from "../../helpers/variables";
import ZoomableImage, { type ZoomableImageHandle } from "../ZoomableImage/ZoomableImage";
import { fullscreenImageModalStyles } from "./FullscreenImageModal.styles";

interface FullscreenImageModalProps {
  visible: boolean;
  imageUrl?: string;
  onClose: () => void;
}

// react-native-gesture-handler ne traverse pas la hiérarchie native séparée d'un <Modal> RN : il lui
// faut son propre GestureHandlerRootView, en plus de celui à la racine de l'app (app/_layout.tsx) —
// sans ça, les gestes ET les touches "classiques" (TouchableOpacity) de tout le contenu du modal se
// comportent mal.
const FullscreenImageModal = ({ visible, imageUrl, onClose }: FullscreenImageModalProps) => {
  const zoomableImageRef = useRef<ZoomableImageHandle>(null);

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={fullscreenImageModalStyles.container}>
          {
            // Démonté/remonté à chaque fermeture du modal — voir le commentaire de ZoomableImage :
            // ça repart systématiquement de 1x plutôt que de garder le zoom de la dernière ouverture.
            visible && imageUrl && <ZoomableImage ref={zoomableImageRef} uri={imageUrl} />
          }
          {/* Rendus APRÈS ZoomableImage : en React Native, les frères plus tardifs sont peints
              au-dessus et reçoivent les touches en priorité — sinon le GestureDetector plein écran de
              ZoomableImage intercepte ces boutons. */}
          <View style={fullscreenImageModalStyles.topActions} pointerEvents="box-none">
            <TouchableOpacity
              activeOpacity={0.8}
              style={fullscreenImageModalStyles.topActions.button}
              onPress={() => zoomableImageRef.current?.reset()}
            >
              <Minimize2 color={app_colors.white} size={18} />
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.8}
              style={fullscreenImageModalStyles.topActions.button}
              onPress={onClose}
            >
              <X color={app_colors.white} size={22} />
            </TouchableOpacity>
          </View>
        </View>
      </GestureHandlerRootView>
    </Modal>
  );
};

export default FullscreenImageModal;
