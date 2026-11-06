import { Text, TouchableOpacity, View } from "react-native"
import { useTranslation } from "react-i18next"
import { globalStyles } from "../../../../helpers/globalStyles"
import { ScreenHeader } from "../../../../components/ScreenHeader/ScreenHeader"
import { router, useFocusEffect } from "expo-router"
import { useCallback } from "react"
import { StatusBar } from "expo-status-bar"
import { journalScreenStyles } from "./Journal.styles"
import SectionHeader from "../../../../components/SectionHeader/SectionHeader"
import ValueCard from "../../../../components/cards/ValueCard/ValueCard"
import { ArrowRight, ChevronRight, PlusIcon } from "lucide-react-native"
import { app_colors } from "../../../../helpers/variables"

const Journal = () => {
  const { t } = useTranslation("tools/journal")

  useFocusEffect(
    useCallback(() => {
      StatusBar.setStyle("dark");
      return () => StatusBar.setStyle("light");
    }, [])
  );

  return (
    <View style={globalStyles.screen}>
      <ScreenHeader title={t("title")} main={false} />

      <View style={globalStyles.content}>

        <View style={journalScreenStyles.sessionsContainer}>
          <SectionHeader
            title="Résumé de vos sessions"
          />
          {/* CARTE DE LA DERNIERE SESSION AJOUTÉE - CARTE POUR INCITER A AJOUTER UNE SESSION SI AUCUNE TROUVÉE */}
          <View style={journalScreenStyles.sessionsContainer.sessionCard}>
            <View style={journalScreenStyles.sessionsContainer.sessionCard.header}>
              <View style={journalScreenStyles.sessionsContainer.sessionCard.header.date}>
                <Text style={journalScreenStyles.sessionsContainer.sessionCard.header.date.number}>12</Text>
                <Text style={journalScreenStyles.sessionsContainer.sessionCard.header.date.month}>JAN</Text>
              </View>

              <View style={journalScreenStyles.sessionsContainer.sessionCard.header.content}>
                <Text style={journalScreenStyles.sessionsContainer.sessionCard.header.content.subtitle}>Dernière session</Text>
                <Text style={journalScreenStyles.sessionsContainer.sessionCard.header.content.title}>La Sinne</Text>
                <Text style={journalScreenStyles.sessionsContainer.sessionCard.header.content.text}>21:10 - 00:45 | 3h35 </Text>
              </View>
            </View>

            <View style={journalScreenStyles.sessionsContainer.sessionCard.content}>
              <View style={journalScreenStyles.sessionsContainer.sessionCard.content.gradeCard}>
                <Text style={journalScreenStyles.sessionsContainer.sessionCard.content.gradeCard.title}>Seeing</Text>
                
                <View style={journalScreenStyles.sessionsContainer.sessionCard.content.gradeCard.grades}>
                  {
                    [1, 2, 3, 4, 5].map((grade) => {
                      return (
                        <View key={grade} style={[
                          journalScreenStyles.sessionsContainer.sessionCard.content.gradeCard.grades.grade,
                          grade <= 2 ? journalScreenStyles.sessionsContainer.sessionCard.content.gradeCard.grades.grade.active : {}
                        ]}/>
                        
                      )
                    })
                  }
                </View>
              </View>

              <View style={journalScreenStyles.sessionsContainer.sessionCard.content.gradeCard}>
                <Text style={journalScreenStyles.sessionsContainer.sessionCard.content.gradeCard.title}>Transparence</Text>
                
                <View style={journalScreenStyles.sessionsContainer.sessionCard.content.gradeCard.grades}>
                  {
                    [1, 2, 3, 4, 5].map((grade) => {
                      return (
                        <View key={grade} style={[
                          journalScreenStyles.sessionsContainer.sessionCard.content.gradeCard.grades.grade,
                          grade <= 5 ? journalScreenStyles.sessionsContainer.sessionCard.content.gradeCard.grades.grade.active : {}
                        ]}/>
                        
                      )
                    })
                  }
                </View>
              </View>

              <View style={journalScreenStyles.sessionsContainer.sessionCard.content.gradeCard}>
                <Text style={journalScreenStyles.sessionsContainer.sessionCard.content.gradeCard.title}>Noirceur</Text>
                
                <View style={journalScreenStyles.sessionsContainer.sessionCard.content.gradeCard.grades}>
                  {
                    [1, 2, 3, 4, 5].map((grade) => {
                      return (
                        <View key={grade} style={[
                          journalScreenStyles.sessionsContainer.sessionCard.content.gradeCard.grades.grade,
                          grade <= 3 ? journalScreenStyles.sessionsContainer.sessionCard.content.gradeCard.grades.grade.active : {}
                        ]}/>
                        
                      )
                    })
                  }
                </View>
              </View>
            </View>
          </View>


          <View style={journalScreenStyles.sessionsContainer.stats}>
            <ValueCard reverse title="Sessions" value="12"/>
            <ValueCard reverse title="Heures observées" value="31" containerStyle={{backgroundColor: app_colors.yellow.light}}/>
          </View>

          <View style={journalScreenStyles.sessionsContainer.stats}>
            <ValueCard reverse title="Seeing moyen" value="3.2/5" containerStyle={{backgroundColor: app_colors.yellow.light}}/>
            <ValueCard reverse title="Lieux visités" value="3"/>
          </View>


          <TouchableOpacity style={journalScreenStyles.sessionsContainer.addSessionButton} onPress={() => router.push("/tools/journal/sessions/add")}>
            <PlusIcon size={20} color={app_colors.white} />
            <Text style={journalScreenStyles.sessionsContainer.addSessionButton.text}>Ajouter une session</Text>
          </TouchableOpacity>

          <TouchableOpacity style={journalScreenStyles.sessionsContainer.seeAll} onPress={() => router.push("/tools/journal/sessions/list")}>
            <ArrowRight size={20} color={app_colors.accent.main} />
            <Text style={journalScreenStyles.sessionsContainer.seeAll.text}>Voir toutes les sessions</Text>
          </TouchableOpacity>
        </View>
        
  
        {/* SECTION DÉDIÉE AUX OBSERVATIONS */}
        <View style={journalScreenStyles.observationsContainer}>
          <SectionHeader
            title="Résumé de vos observations"
          />

          <View style={[globalStyles.defaultCard, journalScreenStyles.observationsContainer.lastObservationCard]}>
            <View style={journalScreenStyles.observationsContainer.lastObservationCard.illustration}/>

            <View style={journalScreenStyles.observationsContainer.lastObservationCard.content}>
              <Text style={journalScreenStyles.observationsContainer.lastObservationCard.content.subtitle}>Dernier objet observé</Text>
              <View>
                <Text style={journalScreenStyles.observationsContainer.lastObservationCard.content.title}>M31</Text>
                <Text style={journalScreenStyles.observationsContainer.lastObservationCard.content.name}>Galaxie d'Andromède</Text>
              </View>
              <Text style={journalScreenStyles.observationsContainer.lastObservationCard.content.text}>12 jan. - Plateau de Valensole</Text>
            </View>

            <View style={journalScreenStyles.observationsContainer.lastObservationCard.iconContainer}>
              <ChevronRight size={20} color={app_colors.accent.main} />
            </View>
          </View>

          <View style={journalScreenStyles.observationsContainer.stats}>
            <ValueCard square reverse title="Objets observés" value="42" valueStyle={{fontSize: 30, color: app_colors.yellow.main}} titleStyle={{color: app_colors.grey}} containerStyle={{backgroundColor: app_colors.primary.main}}/>
            <ValueCard square reverse title="Messier observés" value="31" valueStyle={{fontSize: 30}}/>
            <ValueCard square reverse title="Objet le plus observé" value="Saturne" valueStyle={{fontSize: 25}} containerStyle={{backgroundColor: app_colors.yellow.light}}/>
          </View>
        </View>

        {/* SECTION DÉDIÉE AUX SUCCÈS ET BADGES */}
        <View style={journalScreenStyles.achievementsContainer}>
          <SectionHeader
            title="Succès & Badges"
          />
        </View>
      </View>
    </View>
  )
}

export default Journal
