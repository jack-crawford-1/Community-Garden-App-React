import mongoose from "mongoose";

const GardenSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    address: { type: String, trim: true },
    suburb: { type: String, trim: true },
    region: { type: String, default: "Wellington", index: true },
    lat: { type: Number, required: true, min: -90, max: 90 },
    lon: { type: Number, required: true, min: -180, max: 180 },
    contact: {
      email: { type: String, trim: true },
      phone: { type: String, trim: true },
      website: { type: String, trim: true },
      facebook: { type: String, trim: true },
    },
    photos: [String],
    // Provenance of the record, e.g. "WCC GIS — Community/Facilities/MapServer/3".
    // sourceId is the upstream OBJECTID, used for idempotent re-syncs.
    source: { type: String },
    sourceId: { type: Number },
  },
  { timestamps: true, collection: "venues" },
);

GardenSchema.index({ source: 1, sourceId: 1 }, { unique: true, sparse: true });

export default mongoose.model("Garden", GardenSchema);
