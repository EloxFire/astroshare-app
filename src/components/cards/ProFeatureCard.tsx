import React from 'react'
import {Image, Text, View} from 'react-native'
import {proFeatureCardStyles} from "../../styles/components/cards/proFeatureCard";
import {ProFeature} from "../../helpers/types/ProFeature";

interface ProFeatureCardProps {
  feature: ProFeature
}

export default function ProFeatureCard({feature}: ProFeatureCardProps) {
  return (
    <View style={proFeatureCardStyles.card}>
      <View style={proFeatureCardStyles.card.iconContainer}>
        <Image source={feature.icon} style={proFeatureCardStyles.card.icon}/>
      </View>
      <View style={proFeatureCardStyles.card.textContainer}>
        <Text style={proFeatureCardStyles.card.title}>{feature.name}</Text>
        <Text style={proFeatureCardStyles.card.description}>{feature.description}</Text>
      </View>
    </View>
  )
}
