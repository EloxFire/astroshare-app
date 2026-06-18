export type PlanetariumLoadingStatus = 'pending' | 'active' | 'done' | 'error';

export type PlanetariumLoadingEvent = {
  stepId: string;
  title: string;
  detail: string;
  status: PlanetariumLoadingStatus;
};

export type PlanetariumLoadingReporter = (event: PlanetariumLoadingEvent) => void;
