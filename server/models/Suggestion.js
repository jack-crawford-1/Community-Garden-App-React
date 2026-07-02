import mongoose from "mongoose";

const SuggestionSchema = new mongoose.Schema(
  {
    kind: { type: String, enum: ["new-garden", "correction"], required: true },
    // Set when the suggestion is a correction to an existing garden.
    gardenId: { type: mongoose.Schema.Types.ObjectId, ref: "Garden" },
    gardenName: { type: String, required: true, trim: true, maxlength: 200 },
    address: { type: String, trim: true, maxlength: 300 },
    message: { type: String, required: true, trim: true, maxlength: 2000 },
    submitterEmail: { type: String, trim: true, maxlength: 200 },
    status: { type: String, enum: ["pending", "reviewed"], default: "pending" },
  },
  { timestamps: true },
);

export default mongoose.model("Suggestion", SuggestionSchema);
