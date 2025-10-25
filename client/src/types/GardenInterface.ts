export interface Garden {
  _id?: string;
  id: string | number;
  lastUpdated?: Date | string;
  description: string;
  address: string;
  coordinator: string;
  lat: number;
  lon: number;
  openingHours?: OpeningHours;
  established?: string;
  volunteersWelcome?: boolean;
  facilities?: string[];
  events?: GardenEvent[];
  accessibility?: string[];
  environment?: Environment;
  contact?: Contact;
  photos?: string[];
  rules?: string[];
  membershipRequired?: boolean;
  phone?: string;
  insurance?: string;
  partnerships?: string[];
  wasteManagement?: string[];
  name?: string;
  email?: string;
}

export interface GardenEvent {
  date: string;
  details: string;
}

export interface Contact {
  email?: string;
  phone?: string;
  website?: string;
  social?: Social;
}

export interface Social {
  facebook?: string;
  other?: string;
  other2?: string;
}

export interface Environment {
  gardenSizeSqm?: number;
  numberOfBeds?: number;
  produceType?: string[];
  waterSource?: string[];
  soilType?: string[];
  irrigationSystem?: string;
  compostingFacilities?: string[];
  mulchingPractices?: string[];
  organicCertification?: string;
  pollinatorSupport?: string[];
  waterConservation?: string[];
  fertiliserUse?: string[];
  seasonalPlantingCalendar?: Record<string, string>;
}

export interface OpeningHours {
  Monday: [string, string];
  Tuesday: [string, string];
  Wednesday: [string, string];
  Thursday: [string, string];
  Friday: [string, string];
  Saturday: [string, string];
  Sunday: [string, string];
  Holidays: [string, string];
  [key: string]: [string, string];
}
