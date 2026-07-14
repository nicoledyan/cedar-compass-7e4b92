export type Risk = 'unknown' | 'low' | 'moderate' | 'high' | 'very-high';
export type Parking = 'unknown' | 'garage' | 'driveway' | 'street';
export type Hoa = 'unknown' | 'none' | 'small' | 'restrictive';

export interface HomeRecord {
  id: string;
  zillowUrl: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  hoa: Hoa;
  parking: Parking;
  wildfireRisk: Risk;
  floodRisk: Risk;
  mountainViews: number;
  condition: number;
  yard: number;
  naturalLight: number;
  layout: number;
  neighborhoodFeel: number;
  walkability: number;
  safety: number;
  noise: number;
  amenities: number;
  downtownMinutes?: number;
  gardenMinutes?: number;
  blackSheepMinutes?: number;
  oldColoradoCityMinutes?: number;
  redRockMinutes?: number;
  manitouMinutes?: number;
  sunroom: boolean;
  screenedPorch: boolean;
  coveredPorch: boolean;
  showerWindow: boolean;
  listingDescription?: string;
  notes: string;
}

export interface HomeScore {
  overall: number;
  house: number;
  lifestyle: number;
  commute: number;
  risk: number;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  dealBreakers: string[];
}
