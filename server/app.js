import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import apiRouter from "./routes/api.js";
import { env } from "./config/env.js";

const app = express();

// Behind Railway's proxy — needed so rate limiting sees real client IPs.
app.set("trust proxy", 1);

app.use(helmet());
// Public read-only directory data; CORS is intentionally open.
app.use(cors());
app.use(express.json({ limit: "16kb" }));
if (env.nodeEnv !== "test") app.use(morgan("tiny"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);

app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api", apiRouter);
// Legacy paths used by the previous client — remove once the new client is deployed.
app.use("/", apiRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
