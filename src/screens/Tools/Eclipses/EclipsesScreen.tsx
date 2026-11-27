import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { EclipseIcon } from "lucide-react-native";
import { globalStyles } from "../../../helpers/globalStyles";
import { app_colors } from "../../../helpers/variables";
import { useLocation } from "../../../context/LocationContext";
import { ScreenHeader } from "../../../components/layout/ScreenHeader/ScreenHeader";
import SectionHeader from "../../../components/layout/SectionHeader/SectionHeader";
import TabSwitch from "../../../components/inputs/TabSwitch/TabSwitch";
import SwitchInfoCard from "../../../components/cards/SwitchInfoCard/SwitchInfoCard";
import { getLocalSolarEclipse, getLunarEclipses, getSolarEclipses } from "../../../helpers/api/eclipses/eclipses";
import { isLunarEclipseVisibleFrom } from "../../../helpers/eclipses/lunarVisibility";
import { useNextEclipse } from "../../../hooks/useNextEclipse";
import type { LunarEclipse, SolarEclipse } from "../../../types/eclipses/Eclipse";
import NextEclipseCard from "./components/NextEclipseCard/NextEclipseCard";
import EclipseRow from "./components/EclipseRow/EclipseRow";
import { eclipsesScreenStyles } from "./EclipsesScreen.styles";

type TypeFilter = "all" | "solar" | "lunar";
type EclipseListItem = { kind: "solar" | "lunar"; eclipse: SolarEclipse | LunarEclipse; key: string };

const TYPE_FILTERS: TypeFilter[] = ["all", "solar", "lunar"];
const YEAR_COUNT = 4;

const EclipsesScreen = () => {
  const { t } = useTranslation("tools/eclipses");
  const { location } = useLocation();
  const { nextEclipse } = useNextEclipse();

  const currentYear = new Date().getFullYear();
  const yearOptions = useMemo(() => Array.from({ length: YEAR_COUNT }, (_, index) => currentYear + index), [currentYear]);
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const [typeFilterIndex, setTypeFilterIndex] = useState(0);
  const [onlyVisible, setOnlyVisible] = useState(false);

  const [solarEclipses, setSolarEclipses] = useState<SolarEclipse[] | null>(null);
  const [lunarEclipses, setLunarEclipses] = useState<LunarEclipse[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // Clé "solar:2027-08-02" → magnitude locale si visible, `null` si vérifiée mais pas visible,
  // absente si pas encore vérifiée (pas de lieu connu, ou requête encore en vol pour le solaire).
  const [localVisibilityById, setLocalVisibilityById] = useState<Record<string, { magnitude: number } | null>>({});

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    setLocalVisibilityById({});
    (async () => {
      const [solar, lunar] = await Promise.all([getSolarEclipses(selectedYear), getLunarEclipses(selectedYear)]);
      if (cancelled) return;
      setSolarEclipses(solar ?? []);
      setLunarEclipses(lunar ?? []);
      setIsLoading(false);
    })();
    return () => { cancelled = true; };
  }, [selectedYear]);

  // Visibilité solaire : l'API la calcule réellement pour l'observateur donné (vérifié en direct),
  // un appel par éclipse de l'année — peu nombreuses (0 à 2 par an), coût réseau négligeable.
  useEffect(() => {
    if (!location || !solarEclipses || solarEclipses.length === 0) return;
    let cancelled = false;
    (async () => {
      const entries = await Promise.all(solarEclipses.map(async (eclipse) => {
        const local = await getLocalSolarEclipse(eclipse.calendarDate, location.latitude, location.longitude);
        return [`solar:${eclipse.calendarDate}`, local ? { magnitude: local.magnitude } : null] as const;
      }));
      if (cancelled) return;
      setLocalVisibilityById((previous) => ({ ...previous, ...Object.fromEntries(entries) }));
    })();
    return () => { cancelled = true; };
  }, [location?.latitude, location?.longitude, solarEclipses]);

  // Visibilité lunaire : calculée dans l'app (voir lunarVisibility.ts) — l'API renvoie les mêmes
  // circonstances partout, pas la peine d'un appel réseau supplémentaire.
  useEffect(() => {
    if (!location || !lunarEclipses || lunarEclipses.length === 0) return;
    const entries = lunarEclipses.map((eclipse) => {
      const visible = isLunarEclipseVisibleFrom(eclipse, location.latitude, location.longitude);
      return [`lunar:${eclipse.calendarDate}`, visible ? { magnitude: eclipse.magnitude } : null] as const;
    });
    setLocalVisibilityById((previous) => ({ ...previous, ...Object.fromEntries(entries) }));
  }, [location?.latitude, location?.longitude, lunarEclipses]);

  const items: EclipseListItem[] = useMemo(() => {
    const solarItems: EclipseListItem[] = (solarEclipses ?? []).map((eclipse) => ({ kind: "solar", eclipse, key: `solar:${eclipse.calendarDate}` }));
    const lunarItems: EclipseListItem[] = (lunarEclipses ?? []).map((eclipse) => ({ kind: "lunar", eclipse, key: `lunar:${eclipse.calendarDate}` }));
    return [...solarItems, ...lunarItems].sort((a, b) => a.eclipse.calendarDate.localeCompare(b.eclipse.calendarDate));
  }, [solarEclipses, lunarEclipses]);

  const typeFilter = TYPE_FILTERS[typeFilterIndex];
  const filteredItems = items.filter((item) => {
    if (typeFilter !== "all" && item.kind !== typeFilter) return false;
    if (onlyVisible && !localVisibilityById[item.key]) return false;
    return true;
  });

  const handleItemPress = (item: EclipseListItem) => router.push(`/tools/eclipses/${item.key}`);

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("screen.title")} subtitle={t("screen.subtitle")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>
          {nextEclipse && (
            <View style={eclipsesScreenStyles.section}>
              <NextEclipseCard nextEclipse={nextEclipse} onPress={() => router.push(`/tools/eclipses/${nextEclipse.kind}:${nextEclipse.eclipse.calendarDate}`)} />
            </View>
          )}

          <View style={eclipsesScreenStyles.section}>
            <SectionHeader title={t("screen.year")} />
            <TabSwitch
              tabs={yearOptions.map((year) => ({ text: year.toString() }))}
              activeTab={yearOptions.indexOf(selectedYear)}
              onTabPress={(index) => setSelectedYear(yearOptions[index])}
            />
          </View>

          <View style={eclipsesScreenStyles.section}>
            <SectionHeader title={t("screen.type")} />
            <TabSwitch
              tabs={[{ text: t("screen.filters.all") }, { text: t("screen.filters.solar") }, { text: t("screen.filters.lunar") }]}
              activeTab={typeFilterIndex}
              onTabPress={setTypeFilterIndex}
            />
            
            

            {isLoading ? (
              <ActivityIndicator size="large" color={app_colors.accent.main} style={eclipsesScreenStyles.loader} />
            ) : filteredItems.length > 0 ? (
              <View style={eclipsesScreenStyles.list}>
                <SwitchInfoCard
                  icon={EclipseIcon}
                  title={t("screen.visibleOnly.title")}
                  description={t("screen.visibleOnly.description")}
                  isEnabled={onlyVisible}
                  onToggle={() => setOnlyVisible((value) => !value)}
                  variant="light"
                />

                {filteredItems.map((item) => (
                  <EclipseRow
                    key={item.key}
                    kind={item.kind}
                    eclipse={item.eclipse}
                    localVisibility={location ? localVisibilityById[item.key] : undefined}
                    onPress={() => handleItemPress(item)}
                  />
                ))}
              </View>
            ) : (
              <Text style={eclipsesScreenStyles.emptyState}>{t("screen.empty")}</Text>
            )}
          </View>

        </View>
      </ScrollView>
    </View>
  );
};

export default EclipsesScreen;
