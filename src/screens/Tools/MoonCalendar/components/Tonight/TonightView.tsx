import { ActivityIndicator, InteractionManager, Text, View } from "react-native";
import { Image } from "expo-image";
import { useEffect, useMemo, useState } from "react";
import { tonightViewStyles } from "./TonightView.styles";
import { useAppUnits, type FormatDate } from "../../../../../hooks/useAppUnits";
import { useTranslation } from "react-i18next";
import { globalStyles } from "../../../../../helpers/globalStyles";
import { getLunarPhaseLabel, getNextFirstMoonQuarter, getNextFullMoon, getNextLastMoonQuarter } from "../../../../../helpers/astrometry/moon/moonHelpers";
import { getLunarAge, getLunarAngularDiameter, getLunarDistance, getLunarIllumination, getLunarPhase, getNextNewMoon, LUNAR_SYNODIC_MONTH } from "@observerly/astrometry";
import { getMoonIllustration } from "../../../../../helpers/api/moon/moonIllustration";
import { app_colors } from "../../../../../helpers/variables";
import ListCard from "../../../../../components/cards/ListCard/ListCard";
import ValueCard from "../../../../../components/cards/ValueCard/ValueCard";


const TonightView = () => {
  const { t, i18n } = useTranslation("moon");
  const { formatDate } = useAppUnits();
  const [computedMoon, setComputedMoon] = useState<any>(null);
  const [loadingAdditionalData, setLoadingAdditionalData] = useState<boolean>(true);
  const [illustrationUrl, setIllustrationUrl] = useState<string | null>(null);

  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    const now = new Date();
    const nextFullMoon = getNextFullMoon(now);
    const computedMoon = {
      phase: getLunarPhaseLabel(getLunarPhase(now)),
      illumination: getLunarIllumination(now).toFixed(2),
      age: getLunarAge(now).age,
      nextFullMoon,
      nextFirstQuarter: getNextFirstMoonQuarter(now),
      nextLastQuarter: getNextLastMoonQuarter(now),
      cycleProgress: getLunarAge(now).age / LUNAR_SYNODIC_MONTH, // LUNAR_SYNODIC_MONTH
      distance: getLunarDistance(now).toFixed(0),
      diameter: getLunarAngularDiameter(now),
    }

    setComputedMoon(computedMoon);
  }, [])

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setComputedMoon((prev: any) => ({
        ...prev,
        isNewMoonNext: getNextNewMoon(new Date()) < getNextFullMoon(new Date()),
        daysUntilNextPhase: Math.round(Math.min(
          (getNextNewMoon(new Date()).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
          (getNextFullMoon(new Date()).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        )),
        nextNewMoon: getNextNewMoon(new Date())
      }));
      setLoadingAdditionalData(false);
    });
  
    return () => task.cancel(); // évite un setState après démontage si on quitte l'écran vite
  }, []);

  useEffect(() => {
    (async () => {
      const url = await getMoonIllustration(today);
      setIllustrationUrl(url);
    })();
  }, []);

  return (
    <View style={[globalStyles.screen.content, { padding: 0 }]}>
      <View style={tonightViewStyles.currentPhaseContainer}>
        {
          illustrationUrl ? (
            <Image
              source={{ uri: illustrationUrl ?? undefined }}
              style={{ width: 150, height: 150, borderRadius: 75 }}
              cachePolicy="memory-disk"
            />
          ) : (
            <View style={{width: 150, height: 150, display: "flex", alignItems: "center", justifyContent: "center"}}>
              <ActivityIndicator color={app_colors.yellow.light}/>
            </View>
          )
        }
        
        <View style={tonightViewStyles.currentPhaseContainer.infos}>
          <Text style={tonightViewStyles.currentPhaseContainer.infos.subtitle}>{formatDate(today).format("dddd DD MMMM")}</Text>
          <Text style={tonightViewStyles.currentPhaseContainer.infos.phase}>{computedMoon?.phase}</Text>
          <Text style={[tonightViewStyles.currentPhaseContainer.infos.subtitle, { textTransform: "none" as const, marginTop: 10 }]}>
            {t(computedMoon?.isNewMoonNext ? "daysUntil.newMoon" : "daysUntil.fullMoon", { count: computedMoon?.daysUntilNextPhase })}
          </Text>
        </View>
      </View>

      {/* <Text>{illustrationUrl ?? "NA"}</Text> */}

      <View style={tonightViewStyles.lunarCycleProgressContainer}>
        <Text style={tonightViewStyles.lunarCycleProgressContainer.age}>{t("dayProgress", { age: computedMoon?.age?.toFixed(1) ?? "--", total: LUNAR_SYNODIC_MONTH.toFixed(1) })}</Text>
        <View style={tonightViewStyles.lunarCycleProgressContainer.progressBar}>
          <View style={[tonightViewStyles.lunarCycleProgressContainer.progressBar.progress, { width: `${computedMoon?.cycleProgress * 100}%` }]} />
        </View>
      </View>

      <View style={tonightViewStyles.mainInfoBlocs}>
        <ValueCard title={t("stats.age")} value={computedMoon?.age != null ? `${computedMoon?.age.toFixed(1)} j` : "--"} />
        <ValueCard title={t("stats.illumination")} value={computedMoon?.illumination != null ? `${computedMoon?.illumination} %` : "--"} />
        <ValueCard title={t("stats.diameter")} value={computedMoon?.diameter != null ? `${computedMoon?.diameter.toFixed(2)} °` : "--"} />
      </View>

      <ListCard items={[
        { title: t("ephemeris.rise"), value: computedMoon?.age?.toFixed(1) ?? "--" },
        { title: t("ephemeris.set"), value: computedMoon?.illumination ?? "--" },
      ]} />
    </View>
  );
};

export default TonightView;
