import { Text, View } from "react-native";
import { listCardStyles } from "./ListCard.styles";

interface ListCardProps {
  items: { title: string; value: string; }[]
}

function ListCard({ items }: ListCardProps) {
  return (
    <View style={listCardStyles.card}>
      {
        items.map((item, index) => (
          <View key={index} style={[listCardStyles.card.item, index !== items.length - 1 ? listCardStyles.card.item.withBorder : {}]}>
            <View style={{ flex: 1 }}>
              <Text style={listCardStyles.card.item.title}>{item.title}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={listCardStyles.card.item.value}>{item.value}</Text>
            </View>
          </View>
        ))
      }
    </View>
  )
}

export default ListCard;