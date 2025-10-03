import { MongoClient } from "mongodb";
import chalk from "chalk";

let client;

async function connectDB(uri, dbName = process.env.DB_NAME) {
  if (client) {
    return client.db(dbName);
  }
  try {
    client = new MongoClient(uri, {
      tls: true,
    });
    await client.connect();
    console.log(`                      `);
    console.log(chalk.white.bgRgb(13, 98, 235)(` Connected to MongoDB `));
    return client.db(dbName);
  } catch (err) {
    console.error("Error connecting to MongoDB", err);
    throw err;
  }
}

async function closeDB() {
  if (client) {
    await client.close();
    client = null;
    console.log("MongoDB connection closed");
  }
}

export { connectDB, closeDB };
