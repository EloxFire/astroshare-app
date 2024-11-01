import {Ressource} from "../../types/ressources/Ressource";
import {ReactNode} from "react";
import {Text, View} from "react-native";
import {app_colors} from "../../constants";

export const getRessourcesTags = (ressource: Ressource): ReactNode => {

  const chipStyles = {
    backgroundColor: app_colors.white_no_opacity,
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 5,
    color: app_colors.white,
    fontSize: 12,
  }

  const tags = ressource.tags;
  if(!tags) return <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5}}>
    <Text style={chipStyles}>Aucun tag</Text>
  </View>;

  const tagsArray = tags!.split(',');

  const tagsElements = tagsArray.map((tag, index) => {
    return (
      <Text key={index} style={chipStyles}>{tag}</Text>
    )
  })

  return <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5, flexWrap: 'wrap'}}>
    {tagsElements}
  </View>
}