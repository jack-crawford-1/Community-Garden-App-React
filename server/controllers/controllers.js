import { connectDB } from "../db/mongodbConnection.js";
import { ObjectId } from "mongodb";
import { Storage } from "@google-cloud/storage";
import { env } from "../config/env.js";

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import Garden from "../models/Garden.js";
import Venue from "../models/Venue.js";

import mongoose from "mongoose";

const storage = new Storage({ credentials: env.googleCloudCredentials });
const bucketName = env.bucketName;
const uri = env.uri;
const dbName = env.dbName;
const dbCollection = env.dbCollection;

if (!bucketName || !uri || !dbName || !dbCollection) {
  throw new Error("Missing required environment variables.");
}

export const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// export const uploadImage = async (req, res, next) => {
//   try {
//     if (!req.file) {
//       return res.status(400).send("No file uploaded");
//     }

//     const blob = storage.bucket(bucketName).file(req.file.originalname);
//     const blobStream = blob.createWriteStream();

//     blobStream.on("error", (err) => {
//       console.error("Upload error:", err);
//       next(err);
//     });

//     blobStream.on("finish", () => {
//       const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
//       res.status(200).json({ url: publicUrl });
//     });

//     blobStream.end(req.file.buffer);
//   } catch (err) {
//     next(err);
//   }
// };

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).send("No file uploaded");

    const filename = `${Date.now()}-${req.file.originalname}`;
    const blob = storage.bucket(bucketName).file(filename);
    const blobStream = blob.createWriteStream();

    blobStream.on("error", next);
    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
      res.status(200).json({ url: publicUrl });
    });

    blobStream.end(req.file.buffer);
  } catch (err) {
    next(err);
  }
};

export const getSignedUrl = async (req, res, next) => {
  try {
    const { filename } = req.params;
    const options = {
      version: "v4",
      action: "read",
      expires: Date.now() + 15 * 60 * 1000,
    };

    const [url] = await storage
      .bucket(bucketName)
      .file(filename)
      .getSignedUrl(options);
    res.json({ url });
  } catch (err) {
    next(err);
  }
};

// export const addGarden = async (req, res, next) => {
//   try {
//     const db = await connectDB(uri, dbName);
//     const col = db.collection(dbCollection);
//     const garden = req.body;

//     if (!garden.photos || !Array.isArray(garden.photos)) {
//       garden.photos = [];
//     }

//     delete garden._id;

//     const result = await col.insertOne(garden);
//     res.status(201).json({ insertedId: result.insertedId });
//   } catch (err) {
//     next(err);
//   }
// };

export const addGarden = async (req, res) => {
  try {
    // const { description, address, lat, lon } = req.body;
    // const newGarden = await Garden.create({ description, address, lat, lon });
    const { description, address, lat, lon } = req.body;
    const newGarden = await Venue.create({ description, address, lat, lon });

    res.status(201).json(newGarden);
  } catch (err) {
    console.error("Error adding garden", err);
    res.status(500).json({ message: "Error adding garden" });
  }
};
// export const getGardens = async (req, res, next) => {
//   try {
//     const db = await connectDB(uri, dbName);
//     const col = db.collection(dbCollection);
//     const gardens = await col.find().toArray();
//     res.json(gardens);
//   } catch (err) {
//     next(err);
//   }
// };

export const getGardens = async (req, res) => {
  try {
    const venues = await Venue.find();

    const geojson = {
      type: "FeatureCollection",
      features: venues.map((venue) => ({
        type: "Feature",
        id: venue._id.toString(),
        properties: {
          name: venue.name,
          description: venue.description,
          coordinator: venue.coordinator,
          address: venue.address,
          contact: venue.contact,
          photos: venue.photos,
          events: venue.events,
          rules: venue.rules,
          facilities: venue.facilities,
          accessibility: venue.accessibility,
        },
        geometry: {
          type: "Point",
          coordinates: [venue.lon, venue.lat],
        },
      })),
    };

    res.json(geojson);
  } catch (err) {
    console.error("Error fetching venues:", err);
    res.status(500).json({ message: "Error fetching venues" });
  }
};

// export const getGardenById = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     if (!ObjectId.isValid(id)) {
//       return res.status(400).send("Invalid ID format");
//     }

//     const db = await connectDB(uri, dbName);
//     const col = db.collection(dbCollection);

//     const garden = await col.findOne({ _id: ObjectId.createFromHexString(id) });
//     if (!garden) return res.status(404).send("Garden not found");
//     res.json(garden);
//   } catch (err) {
//     next(err);
//   }
// };

export const getGardenById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const garden = await Venue.findById(id);
    if (!garden) return res.status(404).send("Garden not found");
    res.json(garden);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// export const getGardenEvents = async (req, res, next) => {
//   try {
//     const { id } = req.params;

//     if (!ObjectId.isValid(id)) {
//       return res.status(400).send("Invalid ID format");
//     }

//     const db = await connectDB(uri, dbName);
//     const col = db.collection(dbCollection);
//     const garden = await col.findOne({ _id: ObjectId.createFromHexString(id) });

//     if (!garden) {
//       return res.status(404).send("Garden not found");
//     }

//     res.json({ events: garden.events || [] });
//   } catch (err) {
//     next(err);
//   }
// };

export const getGardenEvents = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const garden = await Venue.findById(id).select("events");
    if (!garden) return res.status(404).send("Garden not found");
    res.json({ events: garden.events || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
