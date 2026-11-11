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

const Journal = () => {
  const { t } = useTranslation("tools/journal")

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
              title="Résumé de vos sessions"
            />
            {/* CARTE DE LA DERNIERE SESSION AJOUTÉE - CARTE POUR INCITER A AJOUTER UNE SESSION SI AUCUNE TROUVÉE */}
            <SessionCard
              label="Dernière session"
              date={new Date(2026, 0, 12)}
              title="La Sinne"
              details="21:10 - 00:45 | 3h35"
              grades={[
                { label: "Seeing", value: 2 },
                { label: "Transparence", value: 5 },
                { label: "Noirceur", value: 3 },
              ]}
            />


            <View style={journalScreenStyles.sessionsContainer.stats}>
              <ValueCard reverse title="Sessions" value="12"/>
              <ValueCard reverse title="Heures observées" value="31" containerStyle={{backgroundColor: app_colors.yellow.light}}/>
            </View>

            <View style={journalScreenStyles.sessionsContainer.stats}>
              <ValueCard reverse title="Seeing moyen" value="3.2/5" containerStyle={{backgroundColor: app_colors.yellow.light}}/>
              <ValueCard reverse title="Lieux visités" value="3"/>
            </View>

            <TouchableOpacity style={journalScreenStyles.sessionsContainer.button} onPress={() => router.push("/tools/journal/sessions/add")}>
              <PlusIcon size={20} color={app_colors.accent.main} />
              <Text style={journalScreenStyles.sessionsContainer.button.text}>Ajouter une session</Text>
            </TouchableOpacity>
          </View>
          
    
          {/* SECTION DÉDIÉE AUX OBSERVATIONS */}
          <View style={journalScreenStyles.observationsContainer}>
            <SectionHeader
              title="Vos observations & succès"
            />

            <ObservationCard
              label="Dernier objet observé"
              title="M31"
              name="Galaxie d'Andromède"
              details="12 jan. - Plateau de Valensole"
            />

            <View style={journalScreenStyles.observationsContainer.stats}>
              <ValueCard square reverse title="Objets observés" value="42" valueStyle={{fontSize: 30, color: app_colors.yellow.main}} titleStyle={{color: app_colors.grey}} containerStyle={{backgroundColor: app_colors.primary.main}}/>
              <ValueCard square reverse title="Messier observés" value="31" valueStyle={{fontSize: 30}}/>
              <ValueCard square reverse title="Objet le plus observé" value="Saturne" valueStyle={{fontSize: 25}} containerStyle={{backgroundColor: app_colors.yellow.light}}/>
            </View>

            <View style={journalScreenStyles.recentSessionsList.lastAchievementCard}>
              <View style={journalScreenStyles.recentSessionsList.lastAchievementCard.header}>
                <View style={journalScreenStyles.recentSessionsList.lastAchievementCard.header.infos}>
                  <View style={journalScreenStyles.recentSessionsList.lastAchievementCard.header.infos.iconContainer}>
                    <Award size={30} color={app_colors.ambre.main}/>
                  </View>
                  <View>
                    <Text style={journalScreenStyles.recentSessionsList.lastAchievementCard.header.infos.subtitle}>Dernier succès - 19 dec.</Text>
                    <Text style={journalScreenStyles.recentSessionsList.lastAchievementCard.header.infos.title}>Observer 10 Messier</Text>
                  </View>
                </View>
              </View>

              <View style={journalScreenStyles.recentSessionsList.lastAchievementCard.content}>
                <View style={journalScreenStyles.recentSessionsList.lastAchievementCard.content.progressContainer}>

                  <Text style={journalScreenStyles.recentSessionsList.lastAchievementCard.content.progressContainer.text}>Prochain palier : Observer 30 Messier</Text>
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
              title="Sessions récentes"
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
