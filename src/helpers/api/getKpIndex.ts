import {KpIndexData} from "../types/KpIndexData";
import {astroshareApi} from "./index";

export const getKpIndex = async (): Promise<KpIndexData[]> => {
  const response = await astroshareApi.get("/solarweather/kpi");
  return response.data;
}