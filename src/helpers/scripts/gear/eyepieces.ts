import { Eyepiece } from "../../types/gear/Eyepiece";

export const addEyepiece = async (userId: string, eyepiece: Eyepiece): Promise<void> => {
  console.log(`[Gear Management] Adding eyepiece for user ${userId}:`, eyepiece);
}