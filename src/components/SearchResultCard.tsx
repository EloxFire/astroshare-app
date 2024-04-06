import React, { useEffect, useState } from 'react'
import { Image, Text, View } from 'react-native'
import { searchResultCardStyles } from '../styles/components/searchResultCard'
import { DSO } from '../helpers/types/DSO'
import { getObjectName } from '../helpers/scripts/astro/getObjectName'

interface SearchResultCardProps {
  object: DSO
}

export default function SearchResultCard({ object }: SearchResultCardProps) {

  return (
    <View style={searchResultCardStyles.card}>
      <View style={searchResultCardStyles.card.header}>
        <Text style={searchResultCardStyles.card.header.title}>{getObjectName(object, 'all', true).toUpperCase()}</Text>
        <Image source={{uri: `../../assets/icons/astro/${object.type.toUpperCase()}.png`}} />
      </View>
    </View>
  )
}
