import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { Search } from "lucide-react-native";
import { globalStyles } from "../../../helpers/globalStyles";
import { app_colors } from "../../../helpers/variables";
import { ScreenHeader } from "../../../components/layout/ScreenHeader/ScreenHeader";
import TabSwitch from "../../../components/inputs/TabSwitch/TabSwitch";
import { InputWithIcon } from "../../../components/inputs/InputWithIcon/InputWithIcon";
import { useEffect, useState } from "react";
import { useSpaceLaunches } from "../../../context/SpaceLaunchesContext";
import { isTerminalLaunchStatus } from "../../../helpers/spaceLaunches/launchStatus";
import { useDebounce } from "../../../hooks/useDebounce";
import NextLaunchCard from "../../../components/SpaceLaunches/NextLaunchCard/NextLaunchCard";
import LaunchesList from "../../../components/SpaceLaunches/LaunchesList/LaunchesList";
import LaunchesCalendarView from "../../../components/SpaceLaunches/LaunchesCalendarView/LaunchesCalendarView";
import { spaceLaunchesScreenStyles } from "./SpaceLaunchesScreen.styles";
import SectionHeader from "../../../components/layout/SectionHeader/SectionHeader";

const SpaceLaunchesScreen = () => {
  const { t } = useTranslation("tools/spaceLaunches");
  const { launches, isLoading } = useSpaceLaunches();
  const [currentView, setCurrentView] = useState<"list" | "calendar">("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  const handleSearch = useDebounce((query: string) => setDebouncedSearchQuery(query), 300);
  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  const handleTabPress = (tabIndex: number) => {
    setCurrentView(tabIndex === 0 ? "list" : "calendar");
  }

  // Le premier lancement non terminé (Success/Failure/Partial Failure) : la liste reste triée par
  // date, mais peut encore contenir un lancement déjà résolu juste avant le prochain rafraîchissement.
  const nextLaunch = launches?.find((launch) => !isTerminalLaunchStatus(launch.status.abbrev));

  const filteredLaunches = launches?.filter((launch) =>
    launch.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
  );

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader
        title={t("screen.title")}
        main={false}
        subtitle={launches ? t("screen.subtitle", { count: launches.length }) : undefined}
      />

      <ScrollView>
        <View style={globalStyles.content}>
          <InputWithIcon
            icon={Search}
            placeholder={t("screen.searchPlaceholder")}
            value={searchQuery}
            onChangeText={setSearchQuery}
            action={() => handleSearch(searchQuery)}
          />

          {isLoading && !launches && (
            <ActivityIndicator size="large" color={app_colors.accent.main} style={spaceLaunchesScreenStyles.loader} />
          )}

          {nextLaunch && (
            <>
              <SectionHeader title={t("nextLaunch.heading")} />
              <NextLaunchCard launch={nextLaunch} onPress={() => router.push(`/tools/space-launches/${nextLaunch.id}`)} />
            </>
          )}

          {launches && (
            <>
              <TabSwitch
                tabs={[{ text: t("tabs.list") }, { text: t("tabs.calendar") }]}
                activeTabForegroundColor={app_colors.primary.main}
                activeTab={currentView === "list" ? 0 : 1}
                onTabPress={handleTabPress}
              />

              {debouncedSearchQuery && filteredLaunches && filteredLaunches.length === 0 ? (
                <Text style={spaceLaunchesScreenStyles.noResults}>{t("list.noSearchResults")}</Text>
              ) : (
                <>
                  <View style={currentView === "list" ? undefined : { display: "none" }}>
                    <LaunchesList launches={filteredLaunches ?? []} />
                  </View>
                  {currentView === "calendar" && (
                    <LaunchesCalendarView launches={filteredLaunches ?? []} />
                  )}
                </>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

export default SpaceLaunchesScreen;
