export type Eyepiece = {
  id: string;
  name: string;
  focalLength: number;
  apparentFieldOfView: number;
  gearType: 'eyepiece';
  brand?: string;
  model?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}