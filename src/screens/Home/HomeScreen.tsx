import { ActivityIndicator, StatusBar, Text, View } from "react-native";
import { ScreenHeader } from "../../components/ScreenHeader/ScreenHeader";
import { globalStyles } from "../../helpers/globalStyles";
import CurrentConditions from "./components/CurrentConditions/CurrentConditions";
import Tonight from "./components/Tonight/Tonight";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "../../context/GpsContext";

export const HomeScreen = () => {
  const { t } = useTranslation();

  const {loading, error, location} = useLocation();

  useEffect(() => {
      StatusBar.setBarStyle("light-content")
    }, [])

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("home.greeting")} />
      <View style={globalStyles.screen.content}>
        <CurrentConditions />
        <Tonight />

        {/* <Text>{JSON.stringify({ error, loading })}</Text> */}

        {/*  POSITION GPS */}
        <View>
          <Text>GPS : </Text>
          {loading && (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        )}

        {error && (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text>{error}</Text>
          </View>
        )}

        {location && !error && !loading && (
          <View>
            <Text>Latitude: {location.latitude}</Text>
            <Text>Longitude: {location.longitude}</Text>
          </View>
        )}
        </View>

        


      </View>
    </View>
  );
};
