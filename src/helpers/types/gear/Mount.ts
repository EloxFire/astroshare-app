export type Mount = {
  id: string;
  name: string;
  type: '' | 'equatorial' | 'azimuthal' | 'altazimuthal' | 'other';
  gearType: 'mount';
  payloadCapacity?: number; // in kg
  gotoSystem?: boolean;
  pcControl?: boolean;
  brand?: string;
  model?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}