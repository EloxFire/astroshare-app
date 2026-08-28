export type Observatory = {
  id: string; //uuid
  name: string;
  tag?: string;
  latitude: number;
  longitude: number;
  bortle?: number; // 1-9 (echelle de Bortle)
  elevation?: number; // en mètres (pour observerly)
}