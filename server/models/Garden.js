import mongoose from "mongoose";

const GardenSchema = new mongoose.Schema({
  description: { type: String, required: true },
  address: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  coordinator: { type: String },
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
  events: [
    {
      date: String,
      details: String,
    },
  ],
  photos: [String],
  rules: [String],
  partnerships: [String],
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
});

export default mongoose.model("Garden", GardenSchema);
