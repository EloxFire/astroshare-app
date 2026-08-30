import { Text, TouchableOpacity, View } from "react-native";
import { globalStyles } from "../../../helpers/globalStyles";
import { ScreenHeader } from "../../../components/ScreenHeader/ScreenHeader";
import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { useUserDataStore } from "../../../store/userData.store";
import SwitchButton from "../../../components/SwitchButton/SwitchButton";
import { ChevronRight, Clock, Ruler, Thermometer } from "lucide-react-native";
import { app_colors } from "../../../helpers/variables";
import { unitsScreenStyles } from "./UnitsScreen.styles";

const UnitsScreen = () => {
  const { t } = useTranslation("settings");
  const router = useRouter();

  // Chaque unité n'a que 2 valeurs possibles : un SwitchButton suffit (pas besoin
  // d'une liste à choix multiple comme pour la langue).
  const timeUnit = useUserDataStore((state) => state.units.time);
  const timezone = useUserDataStore((state) => state.units.timezone);
  const distanceUnit = useUserDataStore((state) => state.units.distance);
  const temperatureUnit = useUserDataStore((state) => state.units.temperature);
  const setTimeUnit = useUserDataStore((state) => state.setTimeUnit);
  const setDistanceUnit = useUserDataStore((state) => state.setDistanceUnit);
  const setTemperatureUnit = useUserDataStore((state) => state.setTemperatureUnit);

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("units.title")} main={false} />
      <View style={globalStyles.content}>
        <View style={unitsScreenStyles.card}>

          <View style={[unitsScreenStyles.row, unitsScreenStyles.row.withBorder]}>
            <View style={unitsScreenStyles.row.content}>
              <Clock size={20} color={app_colors.accent.main} />
              <View style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <Text style={unitsScreenStyles.row.content.title}>{t("units.time.title")}</Text>
                <Text style={unitsScreenStyles.row.content.description}>{t("units.time.description")}</Text>
              </View>
            </View>
            <SwitchButton
              isEnabled={timeUnit === "utc"}
              onToggle={() => setTimeUnit(timeUnit === "utc" ? "local" : "utc")}
            />
          </View>

          {/* Ne sert que si "Heure UTC" est désactivé (voir useAppUnits.formatDate) — reste
              affiché tout le temps pour rester simple, plutôt que d'apparaître/disparaître. */}
          <TouchableOpacity
            style={[unitsScreenStyles.row, unitsScreenStyles.row.withBorder]}
            onPress={() => router.push("/settings/units/timezone")}
          >
            <View style={unitsScreenStyles.row.content}>
              <View style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <Text style={unitsScreenStyles.row.content.title}>{t("units.timezone.title")}</Text>
                <Text style={unitsScreenStyles.row.content.description}>
                  {timezone ?? t("units.timezone.automatic")}
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={app_colors.primary.medium} />
          </TouchableOpacity>

          <View style={[unitsScreenStyles.row, unitsScreenStyles.row.withBorder]}>
            <View style={unitsScreenStyles.row.content}>
              <Ruler size={20} color={app_colors.accent.main} />
              <View style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <Text style={unitsScreenStyles.row.content.title}>{t("units.distance.title")}</Text>
                <Text style={unitsScreenStyles.row.content.description}>{t("units.distance.description")}</Text>
              </View>
            </View>
            <SwitchButton
              isEnabled={distanceUnit === "mi"}
              onToggle={() => setDistanceUnit(distanceUnit === "mi" ? "km" : "mi")}
            />
          </View>

          <View style={unitsScreenStyles.row}>
            <View style={unitsScreenStyles.row.content}>
              <Thermometer size={20} color={app_colors.accent.main} />
              <View style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <Text style={unitsScreenStyles.row.content.title}>{t("units.temperature.title")}</Text>
                <Text style={unitsScreenStyles.row.content.description}>{t("units.temperature.description")}</Text>
              </View>
            </View>
            <SwitchButton
              isEnabled={temperatureUnit === "fahrenheit"}
              onToggle={() => setTemperatureUnit(temperatureUnit === "fahrenheit" ? "celsius" : "fahrenheit")}
            />
          </View>

        </View>
      </View>
    </View>
  );
};

export default UnitsScreen;
