import { Modal, Pressable, Text, View } from "react-native";
import Button from "../../buttons/Button/Button";
import { confirmModalStyles } from "./ConfirmModal.styles";

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  // true : bouton de confirmation rouge (variant="danger" de Button) — pour une action destructive
  // irréversible (ex: suppression). false/absent : bouton accent.main, confirmation ordinaire.
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

/**
 * Modale de confirmation centrée, même langage visuel que InfoTooltip (seule modale centrée
 * existante dans l'app) : remplace Alert.alert natif par une carte habillée aux couleurs de l'app.
 * Composant générique (titre/message/libellés libres), pas lié à un écran en particulier.
 */
const ConfirmModal = ({ visible, title, message, confirmLabel, cancelLabel, destructive = false, onConfirm, onCancel }: ConfirmModalProps) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Pressable style={confirmModalStyles.backdrop} onPress={onCancel}>
        <Pressable style={confirmModalStyles.card} onPress={(event) => event.stopPropagation()}>
          <Text style={confirmModalStyles.card.title}>{title}</Text>
          <Text style={confirmModalStyles.card.message}>{message}</Text>

          <View style={confirmModalStyles.card.actions}>
            <Button label={confirmLabel} variant={destructive ? "danger" : "color"} onPress={onConfirm} />
            <Button label={cancelLabel} variant="info" onPress={onCancel} />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ConfirmModal;
