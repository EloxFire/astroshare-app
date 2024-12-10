import React from 'react'
import {ScrollView, Text, View, TouchableOpacity, FlatList} from 'react-native'
import { globalStyles } from '../../styles/global'
import { sellScreenStyles } from '../../styles/screens/pro/sellScreen'
import {pageTitleStyles} from "../../styles/components/commons/pageTitle";
import {routes} from "../../helpers/routes";
import {Image} from "expo-image";
import {LinearGradient} from "expo-linear-gradient";
import ProFeatureCard from "../../components/cards/ProFeatureCard";
import {ProFeature} from "../../helpers/types/ProFeature";
import ProBadge from "../../components/badges/ProBadge";

export default function SellScreen({ navigation }: any) {

  const hilightFeature: ProFeature[] = [
    {
      name: "Carte du ciel 3D",
      description: "Profitez d'un planétarium 3D complet, directement dans votre poche !",
      image: require('../../../assets/images/tools/skymap.png')
    },
    {
      name: "Prédictions passages ISS",
      description: "Calculez les prochains passage de l'ISS au dessus de votre position",
      image: require('../../../assets/images/tools/isstracker.png')
    },
    {
      name: "Météo solaire avancée",
      description: "Analyser notre étoile avec des données encore plus précises et complètes.",
      image: require('../../../assets/images/tools/sun.png')
    },
    {
      name: "Outils de calculs",
      description: "Calculez le FOV, les tailles apparentes, les transits et bien plus avec nos outils de calculs.",
      image: require('../../../assets/images/tools/isstransit.png')
    },
    {
      name: "Lieux d'observation",
      description: "Gérez et ajouter des lieux d'observation. Effectuez des simulations de visibilité à différents endroits.",
      image: require('../../../assets/images/tools/skymap.png')
    },
    {
      name: "Et bien plus !",
      description: "Astroshare est mis à jour régulièrement avec de nouvelles fonctionnalités.",
      image: require('../../../assets/images/tools/skymap.png')
    },

  ]

  return (
    <View style={[globalStyles.body, {paddingTop: 0}]}>
      <ScrollView>
        <Image style={sellScreenStyles.backgroundImage} source={require('../../../assets/images/tools/ressources.png')}/>
        <LinearGradient
          // Background Linear Gradient
          colors={['rgba(0,0,0,1)', 'transparent']}
          style={sellScreenStyles.backgroundImage.filter}
          locations={[0, 1]}
        />

        <View style={pageTitleStyles.container}>
          <TouchableOpacity onPress={() => navigation.push(routes.home.path)}>
            <Image style={pageTitleStyles.container.icon} source={require('../../../assets/icons/FiChevronDown.png')}/>
          </TouchableOpacity>
        </View>
        <View style={sellScreenStyles.content}>
          <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
            <Text style={sellScreenStyles.content.title}>Astroshare</Text>
            <ProBadge additionalStyles={{transform: [{scale: 2.8}], marginLeft: 30}}/>
          </View>
          <Text style={sellScreenStyles.content.subtitle}>Explorez encore plus loin !</Text>
          <View style={sellScreenStyles.content.offers}>
            <View style={sellScreenStyles.content.offers.offerCard}>
              <View style={sellScreenStyles.content.offers.offerCard.leftContainer}>
                <ProBadge additionalStyles={{transform: [{scale: 2}]}}/>
              </View>
              <View style={sellScreenStyles.content.offers.offerCard.rightContainer}>
                <Text style={sellScreenStyles.content.offers.offerCard.rightContainer.offerPrice}>2.49€</Text>
                <Text style={sellScreenStyles.content.offers.offerCard.rightContainer.offerName}>Abonnement mensuel</Text>
              </View>
            </View>

            <View style={sellScreenStyles.content.offers.offerCard}>
              <View style={sellScreenStyles.content.offers.offerCard.leftContainer}>
                <ProBadge additionalStyles={{transform: [{scale: 2}]}}/>
              </View>
              <View style={sellScreenStyles.content.offers.offerCard.rightContainer}>
                <Text style={sellScreenStyles.content.offers.offerCard.rightContainer.offerPrice}>23.90€</Text>
                <Text style={sellScreenStyles.content.offers.offerCard.rightContainer.offerName}>Abonnement annuel</Text>
              </View>
              <View>
                <Text style={sellScreenStyles.content.offers.offerCard.discountBadge}>économisez -20%</Text>
              </View>
            </View>
          </View>
          <View style={sellScreenStyles.content.features}>
            <Text style={sellScreenStyles.content.features.title}>Des fonctionnalités exclusives :</Text>
            {
              hilightFeature.map((feature, index) => {
                return <ProFeatureCard key={index} feature={feature}/>
              })
            }
          </View>
        </View>
      </ScrollView>
    </View>
  )
}
