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
  upvotes: number;
  downvotes: number;
  fixed: boolean;
}

export const CRATER_TYPES = [
  'Pothole',
  'Sinkhole',
  'Crack',
  'Erosion',
  'Collapsed Drain',
] as const;

export const CRATER_POINTS: Record<string, number> = {
  Pothole: 8,
  Sinkhole: 10,
  Crack: 3,
  Erosion: 5,
  'Collapsed Drain': 12,
};
