export type Camera = {
  id: string;
  name: string;
  type: '' | 'DSLR' | 'DEDICATED' | 'MOBILE';
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