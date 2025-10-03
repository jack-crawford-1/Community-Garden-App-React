import dotenv from "dotenv";
dotenv.config();

const keyJson = Buffer.from(
  process.env.GOOGLE_CLOUD_KEY_JSON_BASE64 || "",
  "base64"
).toString("utf-8");

export const env = {
  uri: process.env.URI,
  dbName: process.env.DB_NAME,
  dbCollection: process.env.DB_COLLECTION,
  bucketName: process.env.BUCKET_NAME,
  googleCloudCredentials: JSON.parse(keyJson),
};
