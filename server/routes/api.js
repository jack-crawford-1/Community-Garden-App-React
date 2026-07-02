import express from "express";
import rateLimit from "express-rate-limit";
import { listGardens, getGardenById } from "../controllers/gardens.js";
import { createSuggestion } from "../controllers/suggestions.js";

const router = express.Router();

// Suggestions are the only public write path — throttle them hard.
const suggestionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: { message: "Too many suggestions from this address — try again later." },
});

router.get("/gardens", listGardens);
router.get("/gardens/:id", getGardenById);
router.post("/suggestions", suggestionLimiter, createSuggestion);

export default router;
