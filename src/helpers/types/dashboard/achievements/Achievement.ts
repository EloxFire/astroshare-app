export interface Achievement {
  id: string;
  title: string;
  description: string;
  achieved: boolean;
  current?: number;
  target?: number;
}