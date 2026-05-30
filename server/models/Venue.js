import mongoose from "mongoose";

const VenueSchema = new mongoose.Schema({
  // Short display name (1-3 words) shown as the page title.
  name: String,
  // Longer blurb shown in the Overview section.
  description: { type: String, required: true },
  address: String,
  lat: Number,
  lon: Number,
  coordinator: String,
  established: String,
  lastUpdated: String,
  volunteersWelcome: Boolean,
  membershipRequired: Boolean,
  insurance: String,
  contact: {
    email: String,
    phone: String,
    website: String,
    social: {
      facebook: String,
      other: String,
      other2: String,
    },
  },
  facilities: [String],
  accessibility: [String],
  wasteManagement: [String],
  events: [
    {
      date: String,
      details: String,
    },
  ],
  photos: [String],
  rules: [String],
  partnerships: [String],
  openingHours: {
    Monday: [String],
    Tuesday: [String],
    Wednesday: [String],
    Thursday: [String],
    Friday: [String],
    Saturday: [String],
    Sunday: [String],
    Holidays: [String],
  },
  environment: {
    gardenSizeSqm: Number,
    numberOfBeds: Number,
    produceType: [String],
    waterConservation: [String],
    soilType: [String],
    pollinatorSupport: [String],
    fertiliserUse: [String],
    seasonalPlantingCalendar: {
      Summer: String,
      Autumn: String,
      Winter: String,
      Spring: String,
    },
    organicCertification: String,
    waterSource: [String],
    irrigationSystem: String,
    compostingFacilities: [String],
    mulchingPractices: [String],
  },
  isTestGarden: { type: Boolean, default: false },
});

export default mongoose.model("Venue", VenueSchema);
