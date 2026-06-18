export type ObservatoryAmenities = {
  parking: boolean;
  electricity: boolean;
  sleeping: boolean;
  shelter: boolean;
};

export type Observatory = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  altitude: number | null;
  notes: string;
  amenities: ObservatoryAmenities;
  createdAt: string;
  updatedAt: string;
};
