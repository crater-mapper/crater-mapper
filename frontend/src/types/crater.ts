export interface Crater {
  id: number;
  user_id: number;
  reporter_username: string;
  latitude: number;
  longitude: number;
  size_category: 'small' | 'medium' | 'large';
  description: string | null;
  points: number;
  verified: boolean;
  fixed: boolean;
  confirmation_count: number;
  created_at: string;
  updated_at?: string | null;
}

export const SIZE_CATEGORIES = ['small', 'medium', 'large'] as const;

export const SIZE_POINTS: Record<string, number> = {
  small: 3,
  medium: 8,
  large: 12,
};
