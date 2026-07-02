import React from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import {sellScreenStyles} from "../../styles/screens/pro/sellScreen";
import {app_colors} from "../../helpers/constants";
import {i18n} from "../../helpers/scripts/i18n";

interface ProOfferCardProps {
  name: string;
  price: string;
  type: 'monthly' | 'yearly' | 'lifetime';
  active: boolean;
  highlight?: string;
  onClick: () => void
}

export default function ProOfferCard({name, price, highlight, type, active, onClick}: ProOfferCardProps) {

  const typesTranslations: Record<string, string> = {
    'monthly': i18n.t('pro.sellScreen.offers.cards.priceMonthly'),
    'yearly': i18n.t('pro.sellScreen.offers.cards.priceYearly'),
    'lifetime': i18n.t('pro.sellScreen.offers.cards.priceLifetime'),
  }

  return (
    <TouchableOpacity onPress={onClick} style={[sellScreenStyles.content.offers.offerCard, {borderColor: active ? app_colors.yellow : app_colors.white_twenty}]}>
      <View style={{flex: 1, flexShrink: 1, flexDirection: 'row', alignItems: 'center', gap: 10, paddingRight: 10}}>
        <View style={[sellScreenStyles.content.offers.offerCard.selected, {borderColor: active ? app_colors.yellow : app_colors.white_forty, backgroundColor: active ? app_colors.yellow : 'transparent'}]}/>
        <Text style={sellScreenStyles.content.offers.offerCard.title} numberOfLines={1}>{name}</Text>
        {
          highlight && (
            <Text style={sellScreenStyles.content.offers.offerCard.highlight} numberOfLines={1}>{highlight}</Text>
          )
        }
      </View>
      <Text style={sellScreenStyles.content.offers.offerCard.price} numberOfLines={1}>{price} {typesTranslations[type]}</Text>
    </TouchableOpacity>
  )
}
