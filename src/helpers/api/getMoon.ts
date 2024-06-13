import axios from "axios";

export const getMoon = async (lat: number, lon: number) => {

  const params = {
    lat: lat,
    lon: lon,
  }

  console.log(params);
  

  try {
    const moonInfos = await axios.get(`${process.env.EXPO_PUBLIC_ASTROSHARE_API_URL}/moon`, { params: params });    
    return moonInfos.data.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}