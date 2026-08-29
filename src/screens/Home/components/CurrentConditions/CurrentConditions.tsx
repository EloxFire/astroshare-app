import { View, Text } from "react-native";
import { currentConditionsStyles } from "./CurrentConditions.styles";
import { MoonIcon } from "lucide-react-native";
import { useMoon } from "../../../../hooks/useMoon";
import { useTranslation } from "react-i18next";

export default function CurrentConditions() {
  const { t } = useTranslation();
  const moon = useMoon(new Date());

  const blocs = [
    {
      title: t("home.conditions.temperature"),
      value: "18°C",
      icon: null,
    },
    {
      title: t("home.conditions.cloudCover"),
      value: "0%",
      icon: null
    },
    {
      title: t("home.conditions.moonIllumination"),
      value: moon.getLunarIllumination().toFixed(0) + "%",
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