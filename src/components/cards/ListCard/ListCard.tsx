import { Text, TouchableOpacity, View } from "react-native";
import { listCardStyles } from "./ListCard.styles";
import { ReactNode } from "react";
import { LucideIcon } from "lucide-react-native";
import { app_colors } from "../../../helpers/variables";

interface ListCardProps {
  items: { title: string; value: string | ReactNode; }[]
  additionalContainerStyles?: object;
  buttons?: { title: string; onPress: () => void; icon?: LucideIcon }[]
}

function ListCard({ items, additionalContainerStyles, buttons }: ListCardProps) {
  return (
    <View style={[listCardStyles.card, additionalContainerStyles]}>
      {
        items.map((item, index) => (
          <View key={index} style={[listCardStyles.card.item, index !== items.length - 1 ? listCardStyles.card.item.withBorder : {}]}>
            <View style={listCardStyles.card.item.titleBloc}>
              <Text style={listCardStyles.card.item.titleBloc.title}>{item.title}</Text>
            </View>
            <View style={listCardStyles.card.item.valueBloc}>
              {typeof item.value === "string" ? (
                <Text style={listCardStyles.card.item.valueBloc.value}>{item.value}</Text>
              ) : (
                item.value
              )}
            </View>
          </View>
        ))
      }

      {
        buttons && buttons.length > 0 && (
          <View style={listCardStyles.card.buttons}>
            {
              buttons.slice(0, 2).map((button, index) => (
                <TouchableOpacity key={index} onPress={button.onPress} style={listCardStyles.card.buttons.button}>
                  {button.icon && <button.icon color={app_colors.accent.main} size={14} />}
                  <Text style={listCardStyles.card.buttons.button.text}>{button.title}</Text>
                </TouchableOpacity>
              ))
            }
          </View>
        )
      }
    </View>
  )
}

export default ListCard;