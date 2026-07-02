export type GardenContact = {
  email?: string | null;
  phone?: string | null;
  website?: string | null;
  facebook?: string | null;
};

/** Shape of a feature's properties in the /gardens GeoJSON response. */
export type GardenProperties = {
  name: string;
  description: string | null;
  address: string | null;
  suburb: string | null;
  region: string | null;
  contact: GardenContact | null;
  photos: string[];
};

/** Flattened garden used across list, map and drawer UI. */
export type GardenSummary = GardenProperties & {
  id: string;
  lat: number;
  lon: number;
};

/** Full document returned by /gardens/:id. */
export type Garden = {
  _id: string;
  name: string;
  description?: string;
  address?: string;
  suburb?: string;
  region?: string;
  lat: number;
  lon: number;
  contact?: GardenContact;
  photos?: string[];
  source?: string;
  updatedAt?: string;
};
