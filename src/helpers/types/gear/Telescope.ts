export type Telescope = {
  name: string;
  type: string;
  aperture: number;
  focalLength: number;
  brand?: string;
  model?: string;
  description?: string;
  usage?: string[];
  image_url?: string;
  createdAt?: Date;
  updatedAt?: Date;
}