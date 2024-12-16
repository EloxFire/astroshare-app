import React from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {sellScreenStyles} from "../../styles/screens/pro/sellScreen";
import {app_colors} from "../../helpers/constants";
import {i18n} from "../../helpers/scripts/i18n";

interface ProOfferCardProps {
  active: boolean
  price: number,
  type: string
  hasDiscount: boolean
  badgeText: string
  description: string
  onClick: () => void
}

export default function ProOfferCard({active, price, type, hasDiscount, badgeText, description, onClick}: ProOfferCardProps) {

  return (
    <TouchableOpacity onPress={() => onClick()} style={[sellScreenStyles.content.offers.offerCard, {borderColor: active ? app_colors.white : app_colors.white_twenty}]}>
      {
        hasDiscount && badgeText !== '' && (
          <Text style={sellScreenStyles.content.offers.offerCard.discountBadge}>{badgeText}</Text>
        )
      }
      <View>
        <Text style={sellScreenStyles.content.offers.offerCard.offerPrice}>{price.toFixed(2)}€</Text>
        <Text style={sellScreenStyles.content.offers.offerCard.offerName}>{type}</Text>
      </View>
      <Text style={[sellScreenStyles.content.offers.offerCard.offerName, {opacity: 1, fontSize: 14}]}>{description}</Text>
    </TouchableOpacity>
  )
}
