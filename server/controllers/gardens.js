import mongoose from "mongoose";
import Garden from "../models/Garden.js";
import { gardensToGeoJSON } from "../lib/geojson.js";

export async function listGardens(req, res, next) {
  try {
    const filter = {};
    if (typeof req.query.region === "string" && req.query.region.trim()) {
      filter.region = new RegExp(`^${escapeRegex(req.query.region.trim())}$`, "i");
    }
    const gardens = await Garden.find(filter).lean();
    res.json(gardensToGeoJSON(gardens));
  } catch (err) {
    next(err);
  }
}

export async function getGardenById(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid garden id" });
    }
    const garden = await Garden.findById(id).lean();
    if (!garden) return res.status(404).json({ message: "Garden not found" });
    res.json(garden);
  } catch (err) {
    next(err);
  }
}

function escapeRegex(input) {
  return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
