export type Mount = {
  id: string; // uuid
  brand: string | null;
  model: string | null;
  type: "altazimuth" | "equatorial" | "dobsonian" | "other";
  motorized: boolean;
}