export interface Crater {
  id: string;
  lat: number;
  lng: number;
  type: string;
  datetime: string;
  user: string;
  verified: boolean;
  notes: string;
  points: number;
}

export const CRATER_TYPES = [
  'Pothole',
  'Sinkhole',
  'Crack',
  'Erosion',
  'Collapsed Drain',
] as const;
