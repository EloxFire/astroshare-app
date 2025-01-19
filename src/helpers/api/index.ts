import axios from "axios";

export const astroshareApi = axios.create({
  baseURL: process.env.EXPO_PUBLIC_ASTROSHARE_API_URL,
})