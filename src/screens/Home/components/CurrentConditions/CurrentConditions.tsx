import { View, Text } from "react-native";
import { currentConditionsStyles } from "./CurrentConditions.styles";
import { MoonIcon } from "lucide-react-native";

export default function CurrentConditions() {

  const blocs = [
    {
      title: "Doux",
      value: "18°C",
      icon: null,
    },
    {
      title: "Aucun nuage",
      value: "0%",
      icon: null
    },
    {
      title: "Discrète",
      value: "34%",
      icon: <MoonIcon color="white" size={34} />
    }
  ]

  return (
    <View style={currentConditionsStyles.container}>
      <View style={currentConditionsStyles.container.blocs}>
        {blocs.map((bloc, index) => (
          <View key={index} style={[currentConditionsStyles.container.blocs.bloc, index !== blocs.length - 1 && currentConditionsStyles.container.blocs.bloc.withBorder]}>
            {bloc.icon}
            <View style={currentConditionsStyles.container.blocs.bloc.textContainer}>
              <Text style={currentConditionsStyles.container.blocs.bloc.textContainer.value}>{bloc.value}</Text>
              <Text style={currentConditionsStyles.container.blocs.bloc.textContainer.title}>{bloc.title}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  )
}