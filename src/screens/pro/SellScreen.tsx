import React, {useState} from 'react'
import {ScrollView, Text, View, TouchableOpacity, StatusBar} from 'react-native'
import { globalStyles } from '../../styles/global'
import { sellScreenStyles } from '../../styles/screens/pro/sellScreen'
import {pageTitleStyles} from "../../styles/components/commons/pageTitle";
import {routes} from "../../helpers/routes";
import {Image} from "expo-image";
import {LinearGradient} from "expo-linear-gradient";
import ProFeatureCard from "../../components/cards/ProFeatureCard";
import {ProFeature} from "../../helpers/types/ProFeature";
import ProBadge from "../../components/badges/ProBadge";
import ProOfferCard from "../../components/cards/ProOfferCard";
import {i18n} from "../../helpers/scripts/i18n";

export default function SellScreen({ navigation }: any) {

  const [activeOffer, setActiveOffer] = useState<'monthly' | 'yearly'>('yearly')

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
    <View style={[globalStyles.body, {paddingTop: 0, paddingHorizontal: 0}]}>
      <ScrollView contentContainerStyle={{paddingHorizontal: 10, paddingTop: StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 20}}>
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
          <Text style={sellScreenStyles.content.subtitle}>{i18n.t('pro.sellScreen.subtitle')}</Text>
          <View style={sellScreenStyles.content.offers}>
            <ProOfferCard
              onClick={() => setActiveOffer('monthly')}
              active={activeOffer === "monthly"}
              price={2.49}
              type={i18n.t('pro.sellScreen.offers.monthly')}
              hasDiscount={false}
              badgeText={''}
              description={i18n.t('pro.sellScreen.offers.monthlyDescription')}
            />
            <ProOfferCard
              onClick={() => setActiveOffer('yearly')}
              active={activeOffer === "yearly"}
              price={23.90}
              type={i18n.t('pro.sellScreen.offers.yearly')}
              hasDiscount={true}
              badgeText={i18n.t('pro.sellScreen.offers.discount')}
              description={i18n.t('pro.sellScreen.offers.yearlyDescription')}
            />
          </View>
          <TouchableOpacity style={sellScreenStyles.content.offers.button}>
            <Text style={sellScreenStyles.content.offers.button.text}>{i18n.t('pro.sellScreen.offers.proceedToPayment')}</Text>
          </TouchableOpacity>
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
