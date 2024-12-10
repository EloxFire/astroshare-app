import React from 'react'
import {ImageBackground, Text, View} from 'react-native'
import {proFeatureCardStyles} from "../../styles/components/cards/proFeatureCard";
import {ProFeature} from "../../helpers/types/ProFeature";
import ProBadge from "../badges/ProBadge";

interface ProFeatureCardProps {
  feature: ProFeature
}

export default function ProFeatureCard({feature}: ProFeatureCardProps) {

  return (
    <ImageBackground source={feature.image} blurRadius={5} style={proFeatureCardStyles.card} imageStyle={proFeatureCardStyles.card.image}>
      <View style={proFeatureCardStyles.card.filter}/>
      <ProBadge additionalStyles={{position: "absolute", right: 15, top: 10}}/>
      <Text style={proFeatureCardStyles.card.title}>{feature.name}</Text>
      <Text style={proFeatureCardStyles.card.description}>{feature.description}</Text>
    </ImageBackground>
  )
}
