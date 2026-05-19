export type Camera = {
  id: string;
  name: string;
  type: '' | 'dslr' | 'dedicated' | 'mobile' | 'other';
  sensorSize: {
    width: number;
    height: number;
  },
  resolution: {
    width: number;
    height: number;
  },
  pixelSize: number;
  gearType: 'camera';
  brand?: string;
  model?: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}