import { ScrollView, Text, View } from "react-native"
import { useCallback, useEffect } from "react"
import { useTranslation } from "react-i18next"
import { router, useFocusEffect, useLocalSearchParams } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Camera, Eye, Layers, MapPin, Pencil, Trash2 } from "lucide-react-native"
import { globalStyles } from "../../../../../helpers/globalStyles"
import { formatCompactDuration, formatLocationLabel } from "../../../../../helpers/format"
import { countObservedObjectsWith, getCatalogObjectSubtitle, getCatalogObjectTitle, getSessionMinutes } from "../../../../../helpers/journal/sessions"
import { getSetupPieceCount } from "../../../../../helpers/gear/setups"
import { useAppUnits } from "../../../../../hooks/useAppUnits"
import { useUserDataStore } from "../../../../../store/userData.store"
import { ScreenHeader } from "../../../../../components/layout/ScreenHeader/ScreenHeader"
import SectionHeader from "../../../../../components/layout/SectionHeader/SectionHeader"
import SessionCard from "../../../../../components/cards/SessionCard/SessionCard"
import ValueCard from "../../../../../components/cards/ValueCard/ValueCard"
import IconButtonCard from "../../../../../components/cards/IconButtonCard/IconButtonCard"
import ObjectCardLite from "../../../../../components/cards/ObjectCardLite/ObjectCardLite"
import LocationMapCard from "../../../../../components/cards/LocationMapCard/LocationMapCard"
import Button from "../../../../../components/buttons/Button/Button"
import { sessionDetailsStyles } from "./SessionDetails.styles"

const SessionDetails = () => {
  const { t } = useTranslation("tools/journal/sessions/details")
  // Dates et heures via useAppUnits : respecte le réglage UTC / fuseau de l'utilisateur.
  const { formatDate } = useAppUnits()

  const sessionId = useLocalSearchParams().id as string
  const sessions = useUserDataStore(state => state.statistics.astronomySessions)
  const observatories = useUserDataStore(state => state.observatories)
  const setups = useUserDataStore(state => state.gear.setups)
  const removeAstronomySession = useUserDataStore(state => state.removeAstronomySession)

  const session = sessions.find(item => item.id === sessionId)

  // Pas de reset au blur : voir le commentaire équivalent dans Journal.tsx (course avec le focus de
  // l'écran suivant).
  useFocusEffect(
    useCallback(() => {
      StatusBar.setStyle("dark")
    }, [])
  )

  // Pas de navigation dans le corps du rendu (même principe que les fiches du matériel) : après la
  // suppression, ou avec un id inconnu, `session` passe à undefined et cet effet quitte l'écran une
  // fois le rendu terminé. Retour à l'écran d'origine (Journal, fiche d'un setup), ou au Journal si
  // la fiche a été ouverte sans historique (lien direct).
  useEffect(() => {
    if (!session) {
      if (router.canGoBack()) router.back()
      else router.replace("/tools/journal")
    }
  }, [session])

  if (!session) return null

  const startDate = formatDate(session.startTime)
  const endDate = formatDate(session.endTime)
  const scheduleDetails = `${startDate.format("HH:mm")} - ${endDate.format("HH:mm")} | ${formatCompactDuration(getSessionMinutes(session))}`

  // Lieu : la session en garde une copie (voir AddSession), lisible même si l'observatoire a été
  // modifié ou supprimé depuis. La fiche de l'observatoire n'est proposée que s'il existe encore.
  const observatoryStillExists = session.observatoryId !== null && observatories.some(observatory => observatory.id === session.observatoryId)

  // `?? []` : même garde que getTotalObservedObjects, pour une session enregistrée avant l'ajout du
  // champ observedObjects.
  const observedObjects = session.observedObjects ?? []
  const sessionSetups = session.setups ?? []

  const handleDelete = () => {
    removeAstronomySession(session.id)
  }

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("title")} main={false} />

      <ScrollView>
        <View style={globalStyles.content}>

          <View style={sessionDetailsStyles.summary}>
            {/* Date complète en surtitre : la pastille de la carte n'affiche que le jour et le mois. */}
            <SessionCard
              label={startDate.format("dddd D MMMM YYYY")}
              date={new Date(session.startTime)}
              title={formatLocationLabel(session.location, t("unknownLocation"))}
              details={scheduleDetails}
              // Une note absente (null : non renseignée dans le formulaire) s'affiche comme 0.
              grades={[
                { label: t("grades.seeing"), value: session.grades.seeing ?? 0 },
                { label: t("grades.transparency"), value: session.grades.transparency ?? 0 },
                { label: t("grades.darkness"), value: session.grades.darkness ?? 0 },
              ]}
            />

            <View style={sessionDetailsStyles.summary.stats}>
              <ValueCard
                square
                reverse
                title={t("stats.observedObjects")}
                value={observedObjects.length.toString()}
                containerStyle={sessionDetailsStyles.summary.stats.highlightCard}
                titleStyle={sessionDetailsStyles.summary.stats.highlightTitle}
                valueStyle={sessionDetailsStyles.summary.stats.highlightValue}
              />
              <ValueCard
                square
                reverse
                title={t("stats.photographed")}
                value={countObservedObjectsWith(observedObjects, "photographed").toString()}
                valueStyle={sessionDetailsStyles.summary.stats.value}
              />
              <ValueCard
                square
                reverse
                title={t("stats.sketched")}
                value={countObservedObjectsWith(observedObjects, "sketched").toString()}
                containerStyle={sessionDetailsStyles.summary.stats.lightCard}
                valueStyle={sessionDetailsStyles.summary.stats.value}
              />
            </View>
          </View>

          <View style={sessionDetailsStyles.section}>
            <SectionHeader
              title={t("venue.title")}
              button={observatoryStillExists ? {
                label: t("venue.seeObservatory"),
                icon: MapPin,
                onPress: () => router.push(`/settings/observatories/${session.observatoryId}`),
              } : undefined}
            />

            <LocationMapCard
              latitude={session.location.latitude}
              longitude={session.location.longitude}
              elevation={session.location.elevation}
            />
          </View>

          <View style={sessionDetailsStyles.section}>
            <SectionHeader title={t("observedObjects.title")} />

            {
              observedObjects.length === 0 ? (
                <View style={sessionDetailsStyles.section.noItems}>
                  <Text style={sessionDetailsStyles.section.noItems.text}>{t("observedObjects.empty")}</Text>
                </View>
              ) : (
                <View style={sessionDetailsStyles.section.objectsList}>
                  {
                    // Lecture seule : les pastilles indiquent ce qui a été fait de l'objet (sans
                    // onPress, elles ne se basculent pas) et il n'y a pas de bouton de suppression.
                    observedObjects.map((entry, index) => (
                      <ObjectCardLite
                        key={entry.object.id}
                        title={getCatalogObjectTitle(entry.object)}
                        subtitle={getCatalogObjectSubtitle(entry.object, t)}
                        withBorder={index !== observedObjects.length - 1}
                        toggles={[
                          { icon: Eye, active: entry.observedAtEyepiece, accessibilityLabel: t("observedObjects.toggles.observedAtEyepiece") },
                          { icon: Camera, active: entry.photographed, accessibilityLabel: t("observedObjects.toggles.photographed") },
                          { icon: Pencil, active: entry.sketched, accessibilityLabel: t("observedObjects.toggles.sketched") },
                        ]}
                      />
                    ))
                  }
                </View>
              )
            }
          </View>

          <View style={sessionDetailsStyles.section}>
            <SectionHeader title={t("gear.title")} />

            {
              sessionSetups.length === 0 ? (
                <View style={sessionDetailsStyles.section.noItems}>
                  <Text style={sessionDetailsStyles.section.noItems.text}>{t("gear.empty")}</Text>
                </View>
              ) : (
                <View style={sessionDetailsStyles.section.list}>
                  {
                    // Setups tels qu'ils étaient au moment de la session (copie enregistrée avec
                    // elle). Leur fiche n'est proposée que s'ils existent encore dans le matériel.
                    sessionSetups.map(setup => {
                      const setupStillExists = setups.some(item => item.id === setup.id)

                      return (
                        <IconButtonCard
                          key={setup.id}
                          icon={Layers}
                          title={setup.name}
                          subtitle={t("gear.pieceCount", { count: getSetupPieceCount(setup) })}
                          onPress={setupStillExists ? () => router.push(`/tools/journal/gear/setups/${setup.id}`) : undefined}
                        />
                      )
                    })
                  }
                </View>
              )
            }
          </View>

          <View style={sessionDetailsStyles.notesCard}>
            <Text style={sessionDetailsStyles.notesCard.title}>{t("notes.title")}</Text>
            <Text style={sessionDetailsStyles.notesCard.text}>{session.notes || t("notes.empty")}</Text>
          </View>

          <View style={sessionDetailsStyles.actions}>
            <Button label={t("deleteButton")} icon={Trash2} variant="danger" onPress={handleDelete} />
            <Text style={sessionDetailsStyles.actions.deleteWarning}>{t("deleteWarning")}</Text>
          </View>

        </View>
      </ScrollView>
    </View>
  )
}

export default SessionDetails
