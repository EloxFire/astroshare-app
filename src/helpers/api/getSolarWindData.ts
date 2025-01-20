import {KpIndexData} from "../types/KpIndexData";
import {astroshareApi} from "./index";
import {SolarWindData} from "../types/SolarWindData";

export const getSolarWindData = async (): Promise<SolarWindData[]> => {
  const response = await astroshareApi.get("/solarweather/wind");
  return response.data;
}