import React from 'react'
import { Text, View } from 'react-native'
import { searchResultCardStyles } from '../styles/components/searchResultCard'

interface SearchResultCardProps {
  title: string
}

export default function SearchResultCard({ title }: SearchResultCardProps) {
  return (
    <View style={searchResultCardStyles.card}>
      <Text style={searchResultCardStyles.card.title}>{title}</Text>
    </View>
  )
}
