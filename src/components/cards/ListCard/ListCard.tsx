import { Text, View } from "react-native";
import { listCardStyles } from "./ListCard.styles";
import { ReactNode } from "react";

interface ListCardProps {
  items: { title: string; value: string | ReactNode; }[]
  additionalContainerStyles?: object;
}

function ListCard({ items, additionalContainerStyles }: ListCardProps) {
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
    </View>
  )
}

export default ListCard;