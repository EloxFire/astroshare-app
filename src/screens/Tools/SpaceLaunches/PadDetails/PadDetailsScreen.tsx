import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Globe, Landmark } from "lucide-react-native";
import { globalStyles } from "../../../../helpers/globalStyles";
import { app_colors } from "../../../../helpers/variables";
import { getPadById } from "../../../../helpers/api/launches/pads";
import { Pad } from "../../../../types/spaceLaunches/Pad";
import { ScreenHeader } from "../../../../components/layout/ScreenHeader/ScreenHeader";
import Badge from "../../../../components/Badges/Badge/Badge";
import ListCard from "../../../../components/cards/ListCard/ListCard";
import InfoCard from "../../../../components/cards/InfoCard/InfoCard";
import LocationMapCard from "../../../../components/cards/LocationMapCard/LocationMapCard";
import { padDetailsScreenStyles } from "./PadDetailsScreen.styles";
import SectionHeader from "../../../../components/layout/SectionHeader/SectionHeader";

const PadDetailsScreen = () => {
  const padId = useLocalSearchParams().id as string;
  const { t } = useTranslation("tools/spaceLaunches");

  const [pad, setPad] = useState<Pad | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Pas dérivable du contexte des lancements (fiche pas de tir complète, pas le résumé embarqué) :
  // appel direct, propre à cet écran.
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setPad(await getPadById(padId));
      setIsLoading(false);
    })();
  }, [padId]);

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={pad?.name ?? t("pad.screenTitle")} main={false} />
      <ScrollView>
        <View style={globalStyles.content}>
          {isLoading && <ActivityIndicator size="large" color={app_colors.accent.main} style={padDetailsScreenStyles.loader} />}

          {!isLoading && !pad && <Text style={padDetailsScreenStyles.notFound}>{t("errors.notFound")}</Text>}

          {pad && (
            <>
              {pad.active != null && (
                <View style={padDetailsScreenStyles.tags}>
                  <Badge
                    text={t(pad.active ? "pad.status.active" : "pad.status.inactive")}
                    backgroundColor={pad.active ? app_colors.accent.light : app_colors.red.light}
                    foregroundColor={pad.active ? app_colors.primary.main : app_colors.red.main}
                  />
                </View>
              )}

              {pad.latitude != null && pad.longitude != null ? (
                <LocationMapCard latitude={pad.latitude} longitude={pad.longitude} terrain="satellite" type="view" />
              ) : (
                pad.location?.name && (
                  <ListCard items={[{ title: pad.name, value: pad.location.country ? `${pad.location.name} · ${pad.location.country}` : pad.location.name }]} />
                )
              )}

              {(pad.total_launch_count != null ||
                pad.successful_launches != null ||
                pad.failed_launches != null ||
                pad.pending_launches != null ||
                pad.consecutive_successful_launches != null ||
                pad.founding_year) && (
                <View style={{marginTop: 20}}>
                  <SectionHeader title={t("pad.stats.heading")} />
                  <ListCard
                    items={[
                      ...(pad.total_launch_count != null ? [{ title: t("pad.stats.total"), value: String(pad.total_launch_count) }] : []),
                      ...(pad.successful_launches != null ? [{ title: t("pad.stats.successful"), value: String(pad.successful_launches) }] : []),
                      ...(pad.failed_launches != null ? [{ title: t("pad.stats.failed"), value: String(pad.failed_launches) }] : []),
                      ...(pad.pending_launches != null ? [{ title: t("pad.stats.pending"), value: String(pad.pending_launches) }] : []),
                      ...(pad.consecutive_successful_launches != null
                        ? [{ title: t("pad.stats.consecutiveSuccess"), value: String(pad.consecutive_successful_launches) }]
                        : []),
                      ...(pad.founding_year ? [{ title: t("pad.foundingYear"), value: pad.founding_year }] : []),
                    ]}
                  />
                </View>
              )}

              {pad.launchers && (
                <ListCard items={[{ title: t("pad.launchers"), value: pad.launchers }]} />
              )}
              {pad.spacecraft && (
                <ListCard items={[{ title: t("pad.spacecraft"), value: pad.spacecraft }]} />
              )}

              {pad.agencies && pad.agencies.length > 0 && (
                <View style={padDetailsScreenStyles.section}>
                  <Text style={globalStyles.categoryTitle}>{t("pad.agencies")}</Text>
                  {pad.agencies.map((agency) => (
                    <InfoCard
                      key={agency.id}
                      variant="light"
                      icon={Landmark}
                      title={agency.name}
                      description={agency.abbrev}
                      internalLink={`/tools/space-launches/agency/${agency.id}`}
                    />
                  ))}
                </View>
              )}

              {(pad.info_url || pad.wiki_url) && (
                <View style={padDetailsScreenStyles.section}>
                  {pad.info_url && (
                    <InfoCard variant="light" icon={Globe} title={t("pad.links.info")} link={pad.info_url} />
                  )}
                  {pad.wiki_url && (
                    <InfoCard variant="light" icon={Globe} title={t("pad.links.wiki")} link={pad.wiki_url} />
                  )}
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

export default PadDetailsScreen;
