interface MessierItemCardProps {
  item: {
    id: string
    name: string
    type: string
    imageUrl: string
  }
  observed: boolean
  photographed: boolean
  sketched: boolean
  onPress?: () => void
}

export const MessierItemCard = ({ item, observed, photographed, sketched, onPress }: MessierItemCardProps) => {

}