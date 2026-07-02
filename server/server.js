import app from "./app.js";
import { env } from "./config/env.js";
import { connectDB, disconnectDB } from "./db/connect.js";

try {
  await connectDB(env.mongoUri, env.dbName);
} catch (err) {
  console.error("Failed to connect to MongoDB:", err.message);
  process.exit(1);
}

const server = app.listen(env.port, "0.0.0.0", () => {
  console.log(`API listening on http://localhost:${env.port}`);
});

async function shutdown(signal) {
  console.log(`${signal} received — shutting down`);
  server.close(async () => {
    await disconnectDB();
    process.exit(0);
  });
  // Force-exit if connections refuse to drain.
  setTimeout(() => process.exit(1), 10_000).unref();
}

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));
