import { ScrollView, Text, TouchableOpacity, View } from "react-native"
import { useTranslation } from "react-i18next"
import { globalStyles } from "../../../../helpers/globalStyles"
import { ScreenHeader } from "../../../../components/ScreenHeader/ScreenHeader"
import { router, useFocusEffect } from "expo-router"
import { useCallback } from "react"
import { StatusBar } from "expo-status-bar"
import { journalScreenStyles } from "./Journal.styles"
import SectionHeader from "../../../../components/SectionHeader/SectionHeader"
import ValueCard from "../../../../components/cards/ValueCard/ValueCard"
import { ArrowRight, Award, ChartColumn, CircleStar, Medal, MedalIcon, PlusIcon, Telescope } from "lucide-react-native"
import IconButtonCard from "../../../../components/cards/IconButtonCard/IconButtonCard"
import ObservationCard from "../../../../components/cards/ObservationCard/ObservationCard"
import SessionCard from "../../../../components/cards/SessionCard/SessionCard"
import { app_colors } from "../../../../helpers/variables"
import { useUserDataStore } from "../../../../store/userData.store"
import { formatCompactDuration, formatLocationLabel } from "../../../../helpers/format"
import { useAppUnits } from "../../../../hooks/useAppUnits"
import { AstronomySession } from "../../../../types/statistics/AstronomySession"

// Les timestamps d'une session sont en millisecondes (voir AstronomySession), alors que
// formatCompactDuration attend des minutes. formatDuration, lui, attend des secondes : lui passer
// directement l'écart en ms gonflait chaque durée d'un facteur 1000.
const getSessionMinutes = (session: AstronomySession): number => (session.endTime - session.startTime) / 60_000

const Journal = () => {
  const { t } = useTranslation("tools/journal")
  // Horaires via useAppUnits plutôt que Date.getHours() : respecte le réglage UTC / fuseau de
  // l'utilisateur, et "HH:mm" garde les zéros (21:05, pas 21:5).
  const { formatDate } = useAppUnits()

  const userSessions = useUserDataStore((state) => state.statistics.astronomySessions)
  const lastSession = userSessions.length > 0 ? userSessions[userSessions.length - 1] : null
  const lastSessionDetails = lastSession
    ? `${formatDate(lastSession.startTime).format("HH:mm")} - ${formatDate(lastSession.endTime).format("HH:mm")} | ${formatCompactDuration(getSessionMinutes(lastSession))}`
    : "21:10 - 00:45 | 3h35"
  // Somme des minutes exactes, arrondie une seule fois à l'affichage (pas d'erreur d'arrondi cumulée).
  const totalObservedMinutes = userSessions.reduce((acc, session) => acc + getSessionMinutes(session), 0)

  // Pas de reset au blur : chaque écran fixe déjà sa propre couleur à son propre focus (y compris
  // au retour sur celui-ci). Un reset ici entrerait en course avec l'effet de focus de l'écran
  // suivant — sur stack navigator, le blur de cet écran ne se déclenche qu'après la fin de
  // l'animation de transition, donc après coup il écraserait la couleur déjà posée par le suivant.
  useFocusEffect(
    useCallback(() => {
      StatusBar.setStyle("dark");
    }, [])
  );

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("title")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>

          <View style={journalScreenStyles.sessionsContainer}>
            <SectionHeader
              title={t("sessionsSummary.title")}
            />
            {/* CARTE DE LA DERNIERE SESSION AJOUTÉE - CARTE POUR INCITER A AJOUTER UNE SESSION SI AUCUNE TROUVÉE */}
            <SessionCard
              label={t("sessionsSummary.lastSession")}
              date={lastSession ? new Date(lastSession.startTime) : new Date(2026, 0, 12)}
              // formatLocationLabel plutôt que location.name : pour un observatoire, name n'est que le
              // nom géocodé du lieu (hérité de GpsLocation), le nom choisi par l'utilisateur est display_name.
              title={lastSession ? formatLocationLabel(lastSession.location, t("sessionsSummary.unknownLocation")) : "La Sinne"}
              details={lastSessionDetails}
              // Une note absente (null : non renseignée dans le formulaire) s'affiche comme 0.
              grades={[
                { label: t("sessionsSummary.grades.seeing"), value: lastSession?.grades.seeing ?? 0 },
                { label: t("sessionsSummary.grades.transparency"), value: lastSession?.grades.transparency ?? 0 },
                { label: t("sessionsSummary.grades.darkness"), value: lastSession?.grades.darkness ?? 0 },
              ]}
            />


            <View style={journalScreenStyles.sessionsContainer.stats}>
              <ValueCard reverse title={t("sessionsSummary.stats.sessions")} value={userSessions.length.toString()}/>
              <ValueCard reverse title={t("sessionsSummary.stats.observedHours")} value={formatCompactDuration(totalObservedMinutes)} containerStyle={{backgroundColor: app_colors.yellow.light}}/>
            </View>

            <View style={journalScreenStyles.sessionsContainer.stats}>
              <ValueCard reverse title={t("sessionsSummary.stats.averageSeeing")} value="3.2/5" containerStyle={{backgroundColor: app_colors.yellow.light}}/>
              <ValueCard reverse title={t("sessionsSummary.stats.visitedPlaces")} value="3"/>
            </View>

            <TouchableOpacity style={journalScreenStyles.sessionsContainer.button} onPress={() => router.push("/tools/journal/sessions/add")}>
              <PlusIcon size={20} color={app_colors.accent.main} />
              <Text style={journalScreenStyles.sessionsContainer.button.text}>{t("sessionsSummary.addSession")}</Text>
            </TouchableOpacity>
          </View>


          {/* SECTION DÉDIÉE AUX OBSERVATIONS */}
          <View style={journalScreenStyles.observationsContainer}>
            <SectionHeader
              title={t("observationsSummary.title")}
            />

            <ObservationCard
              label={t("observationsSummary.lastObservedObject")}
              title="M31"
              name="Galaxie d'Andromède"
              details="12 jan. - Plateau de Valensole"
            />

            <View style={journalScreenStyles.observationsContainer.stats}>
              <ValueCard square reverse title={t("observationsSummary.stats.observedObjects")} value="42" valueStyle={{fontSize: 30, color: app_colors.yellow.main}} titleStyle={{color: app_colors.grey}} containerStyle={{backgroundColor: app_colors.primary.main}}/>
              <ValueCard square reverse title={t("observationsSummary.stats.messierObserved")} value="31" valueStyle={{fontSize: 30}}/>
              <ValueCard square reverse title={t("observationsSummary.stats.mostObservedObject")} value="Saturne" valueStyle={{fontSize: 25}} containerStyle={{backgroundColor: app_colors.yellow.light}}/>
            </View>

            <View style={journalScreenStyles.recentSessionsList.lastAchievementCard}>
              <View style={journalScreenStyles.recentSessionsList.lastAchievementCard.header}>
                <View style={journalScreenStyles.recentSessionsList.lastAchievementCard.header.infos}>
                  <View style={journalScreenStyles.recentSessionsList.lastAchievementCard.header.infos.iconContainer}>
                    <Award size={30} color={app_colors.ambre.main}/>
                  </View>
                  <View>
                    <Text style={journalScreenStyles.recentSessionsList.lastAchievementCard.header.infos.subtitle}>{t("observationsSummary.lastAchievement", { date: "19 déc." })}</Text>
                    <Text style={journalScreenStyles.recentSessionsList.lastAchievementCard.header.infos.title}>Observer 10 Messier</Text>
                  </View>
                </View>
              </View>

              <View style={journalScreenStyles.recentSessionsList.lastAchievementCard.content}>
                <View style={journalScreenStyles.recentSessionsList.lastAchievementCard.content.progressContainer}>

                  <Text style={journalScreenStyles.recentSessionsList.lastAchievementCard.content.progressContainer.text}>{t("observationsSummary.nextTier", { name: "Observer 30 Messier" })}</Text>
                  <View style={journalScreenStyles.recentSessionsList.lastAchievementCard.content.progressContainer.bar}>
                    <View style={journalScreenStyles.recentSessionsList.lastAchievementCard.content.progressContainer.bar.fill}/>
                  </View>
                </View>
              </View>
            </View>

            <View style={journalScreenStyles.observationsContainer.shortcuts}>
              <IconButtonCard
                fill
                icon={ChartColumn}
                title={t("shortcuts.statistics.title")}
                subtitle={t("shortcuts.statistics.subtitle")}
                onPress={() => router.push("/tools/journal/statistics")}
              />
              {/* Nombres factices, comme les autres valeurs de l'écran pour l'instant : à brancher sur le matériel enregistré. */}
              <IconButtonCard
                fill
                icon={Telescope}
                badgeBackgroundColor={app_colors.yellow.light}
                title={t("shortcuts.gear.title")}
                subtitle={`${t("shortcuts.gear.sheets", { count: 8 })} · ${t("shortcuts.gear.setups", { count: 2 })}`}
                onPress={() => router.push("/tools/journal/gear")}
              />
            </View>
          </View>

          {/* SECTION DÉDIÉE AUX SUCCÈS ET BADGES */}
          <View style={journalScreenStyles.recentSessionsList}>
            <SectionHeader
              title={t("recentSessions.title")}
            />

            <View style={journalScreenStyles.recentSessionsList.list}>
              {/* TODO : List last 3 sessions from user store */}
              <IconButtonCard
                fill
                date={new Date("2024-01-12")}
                title={"La Sinne"}
                subtitle={"3h 35 - EQ5 Goto"}
                onPress={() => router.push("/tools/journal/statistics")}
              />
              <IconButtonCard
                fill
                date={new Date("2024-01-10")}
                title={"Plateau de Valensole"}
                subtitle={"2h 15 - Dobson 300"}
                onPress={() => router.push("/tools/journal/statistics")}
              />
              <IconButtonCard
                fill
                date={new Date("2024-01-08")}
                title={"Col de la Cayolle"}
                subtitle={"4h 05 - EQ6 Goto"}
                onPress={() => router.push("/tools/journal/statistics")}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      
    </View>
  )
}

export default Journal
