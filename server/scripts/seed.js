import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../db/mongodbConnection.js";
import Venue from "../models/Venue.js";
import { env } from "../config/env.js";

dotenv.config();

const createGardens = async (count = 10) => {
  try {
    const gardens = [];

    // Bounding box corners
    const topLeft = { lat: -41.24485846259369, lon: 174.6867423480237 };
    const bottomRight = { lat: -41.34360527976141, lon: 174.7767455374757 };

    // Derived ranges
    const latMin = bottomRight.lat;
    const latMax = topLeft.lat;
    const lonMin = topLeft.lon;
    const lonMax = bottomRight.lon;

    for (let i = 0; i < count; i++) {
      const lat = latMin + Math.random() * (latMax - latMin);
      const lon = lonMin + Math.random() * (lonMax - lonMin);

      gardens.push({
        description: `Test Garden ${i + 1}`,
        address: `${i + 1} Test St, Wellington`,
        lat,
        lon,
        isTestGarden: true,
      });
    }

    await Venue.insertMany(gardens);
    console.log(`Created ${count} gardens within Wellington bounds.`);
  } catch (error) {
    console.error("Error creating gardens:", error);
  }
};

const deleteGardens = async () => {
  try {
    const result = await Venue.deleteMany({ isTestGarden: true });
    console.log(`Deleted ${result.deletedCount} gardens.`);
  } catch (error) {
    console.error("Error deleting gardens:", error);
  }
};

const run = async () => {
  await connectDB(env.uri);

  const command = process.argv[2];
  const count = process.argv[3] ? parseInt(process.argv[3], 10) : 10;

  if (command === "create") {
    await createGardens(count);
  } else if (command === "delete") {
    await deleteGardens();
  } else {
    console.log("Usage: node scripts/seed.js <create|delete> [count]");
  }

  mongoose.connection.close();
};

run();
