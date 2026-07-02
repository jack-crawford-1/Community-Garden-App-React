import dotenv from "dotenv";
dotenv.config();

function required(name) {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

export const env = {
  port: Number(process.env.PORT) || 3000,
  mongoUri: required("URI"),
  dbName: process.env.DB_NAME || "communityGardens",
  nodeEnv: process.env.NODE_ENV || "development",
};
