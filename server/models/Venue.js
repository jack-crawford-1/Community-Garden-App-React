import mongoose from "mongoose";

const VenueSchema = new mongoose.Schema({
  description: { type: String, required: true },
  address: String,
  lat: Number,
  lon: Number,
  coordinator: String,
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
  isTestGarden: { type: Boolean, default: false },
});

export default mongoose.model("Venue", VenueSchema);
