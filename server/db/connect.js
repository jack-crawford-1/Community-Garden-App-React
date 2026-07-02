import mongoose from "mongoose";

export async function connectDB(uri, dbName) {
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB connection error:", err.message);
  });
  await mongoose.connect(uri, { dbName, serverSelectionTimeoutMS: 10_000 });
  console.log(`Connected to MongoDB (db: ${dbName})`);
}

export async function disconnectDB() {
  await mongoose.disconnect();
}
