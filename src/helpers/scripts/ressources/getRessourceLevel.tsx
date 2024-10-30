import {Image, Text, View} from "react-native";
import {Ressource} from "../../types/ressources/Ressource";
import {ReactNode} from "react";

export const getRessourceLevel = (ressource: Ressource): {element: ReactNode, label: string} => {

  if(typeof ressource.level !== 'number') {
    return {
      element: <Text>{ressource.level}</Text>,
      label: ressource.level
    }
  }

  let level = ressource.level;
  let stars: ReactNode[] = [];
  let fullStars = Math.floor(level);
  let halfStar = level - fullStars;
  let emptyStars = 5 - fullStars - (halfStar > 0 ? 1 : 0);

  const starStyle = {
    width: 15,
    height: 15,
  }

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Image style={starStyle} key={`full-star-${i}`} source={require('../../../../assets/icons/FiStar.png')}/>);
  }
  for (let i = 0; i < halfStar; i++) {
    stars.push(<Image style={starStyle} key={`half-star-${i}`} source={require('../../../../assets/icons/FiHalfStar.png')}/>);
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Image style={starStyle} key={`empty-star-${i}`} source={require('../../../../assets/icons/FiStarEmpty.png')}/>);
  }

  let levelLabel: string;
  if (level <= 2) {
    levelLabel = "Débutant";
  } else if (level <= 3.5) {
    levelLabel = "Intermédiaire";
  } else {
    levelLabel = "Confirmé";
  }

  const object = {
    element: <View style={{display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 5}}>
      {stars}
    </View>,
    label: levelLabel
  }

  return object;
}