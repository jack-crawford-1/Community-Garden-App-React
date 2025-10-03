import { connectDB } from "../db/mongodbConnection.js";
import { ObjectId } from "mongodb";
import { Storage } from "@google-cloud/storage";
import { env } from "../config/env.js";

const storage = new Storage({ credentials: env.googleCloudCredentials });
const bucketName = env.bucketName;
const uri = env.uri;
const dbName = env.dbName;
const dbCollection = env.dbCollection;

if (!bucketName || !uri || !dbName || !dbCollection) {
  throw new Error("Missing required environment variables.");
}

export const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const blob = storage.bucket(bucketName).file(req.file.originalname);
    const blobStream = blob.createWriteStream();

    blobStream.on("error", (err) => {
      console.error("Upload error:", err);
      next(err);
    });

    blobStream.on("finish", () => {
      const publicUrl = `https://storage.googleapis.com/${bucketName}/${blob.name}`;
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

export const addGarden = async (req, res, next) => {
  try {
    const db = await connectDB(uri, dbName);
    const col = db.collection(dbCollection);
    const garden = req.body;

    if (!garden.photos || !Array.isArray(garden.photos)) {
      garden.photos = [];
    }

    delete garden._id;

    const result = await col.insertOne(garden);
    res.status(201).json({ insertedId: result.insertedId });
  } catch (err) {
    next(err);
  }
};

export const getGardens = async (req, res, next) => {
  try {
    const db = await connectDB(uri, dbName);
    const col = db.collection(dbCollection);
    const gardens = await col.find().toArray();
    res.json(gardens);
  } catch (err) {
    next(err);
  }
};

export const getGardenById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID format");
    }

    const db = await connectDB(uri, dbName);
    const col = db.collection(dbCollection);

    const garden = await col.findOne({ _id: ObjectId.createFromHexString(id) });
    if (!garden) return res.status(404).send("Garden not found");
    res.json(garden);
  } catch (err) {
    next(err);
  }
};

export const getGardenEvents = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID format");
    }

    const db = await connectDB(uri, dbName);
    const col = db.collection(dbCollection);
    const garden = await col.findOne({ _id: ObjectId.createFromHexString(id) });

    if (!garden) {
      return res.status(404).send("Garden not found");
    }

    res.json({ events: garden.events || [] });
  } catch (err) {
    next(err);
  }
};
