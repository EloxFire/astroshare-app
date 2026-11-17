import { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import { Plus, Satellite } from "lucide-react-native";
import { globalStyles } from "../../../helpers/globalStyles";
import { app_colors } from "../../../helpers/variables";
import { useAuth } from "../../../context/AuthContext";
import { useLocation } from "../../../context/LocationContext";
import { useAppUnits } from "../../../hooks/useAppUnits";
import { useUserDataStore } from "../../../store/userData.store";
import { isProUser } from "../../../helpers/auth/subscription";
import { ScreenHeader } from "../../../components/layout/ScreenHeader/ScreenHeader";
import SectionHeader from "../../../components/layout/SectionHeader/SectionHeader";
import { sectionHeaderStyles } from "../../../components/layout/SectionHeader/SectionHeader.styles";
import Badge from "../../../components/Badges/Badge/Badge";
import IconButtonCard from "../../../components/cards/IconButtonCard/IconButtonCard";
import LockedFeatureCard from "../../../components/cards/LockedFeatureCard/LockedFeatureCard";
import SatelliteStationCard from "../../../components/Satellites/SatelliteStationCard/SatelliteStationCard";
import FeaturedSatelliteCard from "../../../components/Satellites/FeaturedSatelliteCard/FeaturedSatelliteCard";
import LocationBanner from "./components/LocationBanner/LocationBanner";
import AddSatelliteModal from "./components/AddSatelliteModal/AddSatelliteModal";
import { FEATURED_SATELLITES, FEATURED_STATIONS } from "../../../helpers/satellites/featured";
import { getNoradSatellite, getNoradSatellitesByIds } from "../../../helpers/api/satellites/norad";
import { getSatellitePasses, getSatelliteTle } from "../../../helpers/api/satellites/tracking";
import { parseTle, getSubPoint } from "../../../helpers/satellites/propagation";
import { isOperationalStatus, resolveObjectTypeKey, resolveOpsStatusKey } from "../../../helpers/satellites/labels";
import { formatPassDayLabel } from "../../../helpers/satellites/passLabel";
import type { NoradSatellite } from "../../../types/satellites/NoradSatellite";
import { satellitesScreenStyles } from "./SatellitesScreen.styles";

type StationEntry = {
  key: string;
  catalog: NoradSatellite | null;
  altitudeLabel: string | null;
  nextPassLabel: string | null;
};

const SatellitesScreen = () => {
  const { t } = useTranslation("tools/satelliteTracker");
  const { authUser } = useAuth();
  const { location } = useLocation();
  const { formatDate, formatDistanceKm } = useAppUnits();

  const trackedSatelliteIds = useUserDataStore((state) => state.trackedSatellites);
  const userIsPro = isProUser(authUser);

  const [stations, setStations] = useState<StationEntry[] | null>(null);
  const [featured, setFeatured] = useState<NoradSatellite[] | null>(null);
  const [trackedCatalog, setTrackedCatalog] = useState<NoradSatellite[] | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Stations spatiales : catalogue + position live (TLE propagé localement, voir propagation.ts)
  // + prochain passage visible — chargés une fois à l'ouverture de l'écran (pas de minuteur ici,
  // contrairement à la fiche détail : cette liste n'a pas besoin d'une altitude qui défile seconde
  // par seconde, seulement d'un instantané).
  useEffect(() => {
    if (!location) return;

    (async () => {
      const entries = await Promise.all(
        FEATURED_STATIONS.map(async ({ key, query }): Promise<StationEntry> => {
          const [catalog, tle, passes] = await Promise.all([
            getNoradSatellite(query),
            getSatelliteTle({ name: query }),
            getSatellitePasses({ identifier: { name: query }, latitude: location.latitude, longitude: location.longitude, altitude: location.elevation ?? 0 }),
          ]);

          const satrec = tle ? parseTle(tle.tle) : null;
          const subPoint = satrec ? getSubPoint(satrec, new Date()) : null;
          const nextPass = passes?.passes?.[0];

          return {
            key,
            catalog,
            altitudeLabel: subPoint ? formatDistanceKm(subPoint.altitude) : null,
            nextPassLabel: nextPass
              ? `${formatPassDayLabel(new Date(nextPass.startUTC * 1000), formatDate, t)} · ${Math.round(nextPass.maxEl)}°`
              : null,
          };
        })
      );
      setStations(entries);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- formatDate/formatDistanceKm/t changent de closure à chaque render (voir AltitudeChart) ; ne dépend en pratique que de location.
  }, [location?.latitude, location?.longitude]);

  // "À suivre aussi" : juste la fiche catalogue (pas de position live), un seul appel groupé n'est
  // pas possible ici puisqu'on part de noms (pas d'IDs connus à l'avance) — voir featured.ts.
  useEffect(() => {
    (async () => {
      const results = await Promise.all(FEATURED_SATELLITES.map(({ query }) => getNoradSatellite(query)));
      setFeatured(results.filter((result): result is NoradSatellite => result !== null));
    })();
  }, []);

  // "Mes satellites" : un seul appel groupé, puisque ces IDs NORAD sont connus (saisis par
  // l'utilisateur) — voir AddSatelliteModal.
  useEffect(() => {
    if (!userIsPro || trackedSatelliteIds.length === 0) {
      setTrackedCatalog([]);
      return;
    }
    (async () => {
      const results = await getNoradSatellitesByIds(trackedSatelliteIds);
      setTrackedCatalog(results ?? []);
    })();
  }, [userIsPro, trackedSatelliteIds]);

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("screen.title")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>
          <LocationBanner />

          {!stations && (
            <ActivityIndicator size="large" color={app_colors.accent.main} style={satellitesScreenStyles.loader} />
          )}

          {stations && (
            <View>
              <SectionHeader title={t("screen.stations")} />
              <View style={satellitesScreenStyles.stationsList}>
                {stations.map((station) => (
                  <SatelliteStationCard
                    key={station.key}
                    title={station.catalog?.object_name ?? t(`featured.${station.key}`)}
                    subtitle={station.catalog ? `${station.catalog.object_name} · NORAD ${station.catalog.norad_id}` : "--"}
                    altitudeLabel={station.altitudeLabel}
                    liveLabel={t("screen.live")}
                    nextPassLabel={station.nextPassLabel}
                    onPress={station.catalog ? () => router.push(`/tools/satellite-tracker/${station.catalog!.norad_id}`) : undefined}
                  />
                ))}
              </View>
            </View>
          )}

          {featured && featured.length > 0 && (
            <View>
              <SectionHeader title={t("screen.others")} />
              <View style={satellitesScreenStyles.featuredGrid}>
                {featured.map((satellite) => (
                  <FeaturedSatelliteCard
                    key={satellite.norad_id}
                    title={satellite.object_name}
                    subtitle={t(`objectType.${resolveObjectTypeKey(satellite.object_type.label)}`)}
                    noradId={satellite.norad_id}
                    statusLabel={t(`opsStatus.${resolveOpsStatusKey(satellite.ops_status.label)}`)}
                    statusColor={
                      isOperationalStatus(satellite.ops_status.label)
                        ? { background: app_colors.green.light, foreground: app_colors.green.main }
                        : { background: app_colors.red.light, foreground: app_colors.red.main }
                    }
                    onPress={() => router.push(`/tools/satellite-tracker/${satellite.norad_id}`)}
                  />
                ))}
              </View>
            </View>
          )}

          <View>
            <View style={sectionHeaderStyles.header}>
              <Text style={sectionHeaderStyles.header.title}>{t("screen.mine")}</Text>
              <View style={sectionHeaderStyles.header.separator} />
              <Badge text="PRO" backgroundColor={app_colors.yellow.main} foregroundColor={app_colors.primary.main} />
            </View>

            {!userIsPro ? (
              <LockedFeatureCard
                title={t("screen.locked.title")}
                description={t("screen.locked.description")}
                ctaLabel={t("screen.locked.cta")}
                // Pas encore d'écran PRO/abonnement dans l'app (voir le TODO équivalent dans
                // SpaceWeatherScreen) : le bouton n'a pas encore de destination.
                onPressCta={() => {}}
              />
            ) : (
              <View style={satellitesScreenStyles.trackedList}>
                {trackedCatalog?.map((satellite) => (
                  <IconButtonCard
                    key={satellite.norad_id}
                    icon={Satellite}
                    title={satellite.object_name}
                    subtitle={`#${satellite.norad_id} · ${t(`objectType.${resolveObjectTypeKey(satellite.object_type.label)}`)} · ${t(`opsStatus.${resolveOpsStatusKey(satellite.ops_status.label)}`)}`}
                    onPress={() => router.push(`/tools/satellite-tracker/${satellite.norad_id}`)}
                  />
                ))}

                <TouchableOpacity style={satellitesScreenStyles.addButton} onPress={() => setIsAddModalOpen(true)}>
                  <Plus size={16} color={app_colors.accent.main} />
                  <Text style={satellitesScreenStyles.addButton.text}>{t("screen.addByNoradId")}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {isAddModalOpen && <AddSatelliteModal onClose={() => setIsAddModalOpen(false)} />}
    </View>
  );
};

export default SatellitesScreen;
