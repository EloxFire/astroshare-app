import React, { useState } from 'react'
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native'
import PageTitle from '../components/commons/PageTitle'
import { globalStyles } from '../styles/global'
import { app_colors } from '../helpers/constants'
import { tutorialStyles } from '../styles/screens/tutorial'
import { tutorialScreens } from '../helpers/scripts/tutorial/tutorialScreens'
import { routes } from '../helpers/routes'

export default function TutorialScreen({ navigation }: any) {

  const [currentStep, setCurrentStep] = useState(0)

  const onPressNext = () => {
    if (currentStep === tutorialScreens.length - 1) {
      navigation.navigate(routes.home.path)
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const onPressPrevious = () => {
    if (currentStep === 0) {
      navigation.navigate(routes.home.path)
    } else {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <View style={globalStyles.body}>
      <PageTitle
        navigation={navigation}
        title="Guide de démarrage"
        subtitle="// Comment fonctionne l'application ?"
      />
      <View style={globalStyles.screens.separator} />
      <View style={tutorialStyles.content}>
        <Text style={{ color: 'white' }}>TEST</Text>
        <View style={tutorialStyles.content.bottomBar}>
          <TouchableOpacity onPress={onPressPrevious}>
            <Text style={{ color: app_colors.white }}>{currentStep === 0 ? 'Retour' : 'Précédent'}</Text>
          </TouchableOpacity>
          <View style={tutorialStyles.content.bottomBar.dots}>
            {
              tutorialScreens.map((_, index: number) => {
                return (
                  <View key={`dot-bar-${index}`} style={[tutorialStyles.content.bottomBar.dots.dot, { backgroundColor: index === currentStep ? app_colors.white : app_colors.white_twenty }]} />
                )
              })
            }
          </View>
          <TouchableOpacity onPress={onPressNext}>
            <Text style={{ color: app_colors.white }}>{currentStep === tutorialScreens.length - 1 ? 'Terminer' : 'Suivant'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  )
}
