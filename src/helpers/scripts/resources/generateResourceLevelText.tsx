import { ReactNode } from "react";
import { Image, View } from "react-native";

export const generateResourceLevelText = (level: number): ReactNode => {
  // Build an array of star icons (full/half/empty) to display a 5 star rating
  const maxLevel = 5;
  const fullStars = Math.floor(level);
  const halfStar = level % 1 >= 0.5 ? 1 : 0;
  const emptyStars = maxLevel - fullStars - halfStar;

  const stars: ReactNode[] = [];

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <Image
        key={`full-${i}`}
        style={{ width: 14, height: 14 }}
        source={require("../../../../assets/icons/FiStar.png")}
      />
    );
  }

  if (halfStar) {
    stars.push(
      <Image
        key="half"
        style={{ width: 14, height: 14 }}
        source={require("../../../../assets/icons/FiHalfStar.png")}
      />
    );
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <Image
        key={`empty-${i}`}
        style={{ width: 14, height: 14 }}
        source={require("../../../../assets/icons/FiStarEmpty.png")}
      />
    );
  }

  return <View style={{ flexDirection: "row", gap: 2 }}>
    {stars}
  </View>;
};
