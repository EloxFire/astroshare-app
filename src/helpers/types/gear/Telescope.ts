export type Telescope = {
  id: string;
  name: string;
  type: '' | 'refractor' | 'reflector' | 'catadioptric' | 'other';
  construction: '' | 'newtonian' | 'dobsonian' | 'schmidt-cassegrain' | 'maksutov' | 'other';
  aperture: number;
  diameter: number;
  focalLength: number;
  usage: string[];
  gearType: 'telescope';
  brand?: string;
  model?: string;
  description?: string;
  image_url?: string;
  createdAt?: Date;
  updatedAt?: Date;
}