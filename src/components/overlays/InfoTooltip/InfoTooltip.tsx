import { useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { Info, X } from "lucide-react-native";
import { app_colors } from "../../../helpers/variables";
import { infoTooltipStyles } from "./InfoTooltip.styles";

interface InfoTooltipProps {
  title: string;
  description: string;
  iconSize?: number;
  iconColor?: string;
}

// Icône "i" qui ouvre une modale flottante centrée (titre + description), pour expliquer une
// carte sans occuper de place dedans en permanence. Généralise les icônes Info déjà posées sans
// action dans SpaceWeatherScreen.tsx.
const InfoTooltip = ({ title, description, iconSize = 20, iconColor = app_colors.primary.medium }: InfoTooltipProps) => {
  const [visible, setVisible] = useState(false);

  // TODO : Ajouter un prop pour ajouter un lien afin de rediriger vers une page du futur glossaire par exemple

  return (
    <>
      <TouchableOpacity onPress={() => setVisible(true)} hitSlop={10}>
        <Info color={iconColor} size={iconSize} />
      </TouchableOpacity>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={infoTooltipStyles.backdrop} onPress={() => setVisible(false)}>
          <Pressable style={infoTooltipStyles.card} onPress={(event) => event.stopPropagation()}>
            <View style={infoTooltipStyles.card.header}>
              <Text style={infoTooltipStyles.card.header.title}>{title}</Text>
              <TouchableOpacity onPress={() => setVisible(false)} hitSlop={10}>
                <X size={18} color={app_colors.primary.medium} />
              </TouchableOpacity>
            </View>
            <Text style={infoTooltipStyles.card.description}>{description}</Text>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

export default InfoTooltip;
