import { useEffect, useState } from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import { Landmark } from "lucide-react-native";
import { globalStyles } from "../../../../helpers/globalStyles";
import { app_colors } from "../../../../helpers/variables";
import { getAgencyById } from "../../../../helpers/api/launches/agencies";
import { getLaunchImageUrl } from "../../../../helpers/spaceLaunches/launchImage";
import { Agency } from "../../../../types/spaceLaunches/Agency";
import { ScreenHeader } from "../../../../components/layout/ScreenHeader/ScreenHeader";
import { ImageHeaderScrollView } from "../../../../components/layout/ImageHeaderScrollView/ImageHeaderScrollView";
import Badge from "../../../../components/Badges/Badge/Badge";
import ListCard from "../../../../components/cards/ListCard/ListCard";
import InfoCard from "../../../../components/cards/InfoCard/InfoCard";
import { agencyDetailsScreenStyles } from "./AgencyDetailsScreen.styles";
import SectionHeader from "../../../../components/layout/SectionHeader/SectionHeader";

const AgencyDetailsScreen = () => {
  const agencyId = useLocalSearchParams().id as string;
  const { t } = useTranslation("tools/spaceLaunches");

  const [agency, setAgency] = useState<Agency | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // `logo` est quasi toujours vide ({}) en pratique (ex: SpaceX) — le logo exploitable est
  // `social_logo`, avec `logo` gardé en repli si jamais une agence l'a rempli à la place.
  const logoUrl = getLaunchImageUrl(agency?.social_logo) ?? getLaunchImageUrl(agency?.logo);
  // `image` est une photo représentative de l'agence (ex: un lancement), pas un logo — utilisée
  // comme hero, comme sur la fiche détail d'un lancement.
  const heroImageUrl = getLaunchImageUrl(agency?.image);

  // Pas dérivable du contexte des lancements (fiche agence complète, pas le résumé embarqué) :
  // appel direct, propre à cet écran.
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      setAgency(await getAgencyById(agencyId));
      setIsLoading(false);
    })();
  }, [agencyId]);

  if (isLoading) {
    return (
      <View style={globalStyles.screen}>
        <ScreenHeader title={t("agency.screenTitle")} main={false} />
        <ActivityIndicator size="large" color={app_colors.accent.main} style={agencyDetailsScreenStyles.loader} />
      </View>
    );
  }

  if (!agency) {
    return (
      <View style={globalStyles.screen}>
        <ScreenHeader title={t("agency.screenTitle")} main={false} />
        <Text style={agencyDetailsScreenStyles.notFound}>{t("errors.notFound")}</Text>
      </View>
    );
  }

  return (
    <View style={globalStyles.screen}>
      <ImageHeaderScrollView
        title={agency.name}
        subtitle={agency.abbrev}
        image={heroImageUrl ? { uri: heroImageUrl } : require("../../../../../assets/images/placeholders/no-picture.png")}
      >
        <View style={[globalStyles.screen.content, { backgroundColor: "transparent" }]}>
          {logoUrl && (
            <Image source={{ uri: logoUrl }} style={agencyDetailsScreenStyles.logo} resizeMode="cover" />
          )}

          <View style={agencyDetailsScreenStyles.tags}>
            {agency.type?.name && (
              <Badge text={agency.type.name} backgroundColor={app_colors.accent.light} foregroundColor={app_colors.primary.main} />
            )}
            {agency.featured && (
              <Badge text={t("agency.featuredBadge")} backgroundColor={app_colors.yellow.light} foregroundColor={app_colors.primary.main} />
            )}
          </View>

          <Text style={agencyDetailsScreenStyles.description}>{agency.description || t("agency.noDescription")}</Text>

          {(agency.country && agency.country.length > 0 || agency.administrator || agency.founding_year) && (
            <ListCard
              items={[
                ...(agency.country && agency.country.length > 0
                  ? [{ title: t("agency.country"), value: agency.country.map((country) => country.name).join(", ") }]
                  : []),
                ...(agency.administrator ? [{ title: t("agency.administrator"), value: agency.administrator }] : []),
                ...(agency.founding_year ? [{ title: t("agency.foundingYear"), value: String(agency.founding_year) }] : []),
              ]}
            />
          )}

          {agency.launchers && (
            <ListCard items={[{ title: t("agency.launchers"), value: agency.launchers }]} />
          )}
          {agency.spacecraft && (
            <ListCard items={[{ title: t("agency.spacecraft"), value: agency.spacecraft }]} />
          )}

          {agency.parent && (
            <View style={{ marginTop: 20 }}>
              <SectionHeader title={t("agency.parentAgency")} />
              <InfoCard
                variant="light"
                icon={Landmark}
                title={agency.parent.name}
                description={agency.parent.abbrev}
                internalLink={`/tools/space-launches/agency/${agency.parent.id}`}
              />
            </View>
          )}
        </View>
      </ImageHeaderScrollView>
    </View>
  );
}

export default AgencyDetailsScreen;
