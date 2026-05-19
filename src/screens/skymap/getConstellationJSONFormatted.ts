import { constellationsAsterisms } from "../../helpers/scripts/astro/constellationsAsterisms"

export const getConstellationJSONFormatted = async () => {

  // console.log(constellationsAsterisms[0].feature.features[0].properties.centrum);
  

  const constellations = constellationsAsterisms.map((constellation) => {
    // console.log({
    //   name: constellation.name,
    //   abbr: constellation.abbreviation,
    //   aster: constellation.feature.features[0].geometry.coordinates,
    //   boundaries: constellation.feature.features[1].geometry.coordinates,
    //   centrum: constellation.feature.features[0].properties.centrum,
    // });
    
    return {
      name: constellation.name,
      abbr: constellation.abbreviation,
      aster: constellation.feature.features[0].geometry.coordinates,
      boundaries: constellation.feature.features[1].geometry.coordinates,
      centrum: constellation.feature.features[0].properties.centrum,
    }
  })

  // SAVE TO FILE - This is just for development purposes, to get the data in a JSON file that can be used in the app. In production, this data would likely come from an API or be stored locally in a more efficient format.
  // await fetch(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/news/write-constellations`, {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': process.env.EXPO_PUBLIC_ADMIN_KEY,
  //     'Content-Type': 'application/json'
  //   },
  //   body: JSON.stringify({
  //     data: constellations
  //   })
  // });

  console.log("CONSTELLATIONS JSON");
  console.log(JSON.stringify(constellations, null, 2));
  console.log("\n\n\n\n");
  
}