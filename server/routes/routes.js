import {
  addGarden,
  getGardens,
  getGardenById,
  uploadImage,
  getSignedUrl,
  getGardenEvents,
} from "../controllers/controllers.js";
import express from "express";
import multer from "multer";
import { authMiddleware } from "../middleware/auth.js";
import { registerUser, loginUser } from "../controllers/controllers.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/register", registerUser);
router.post("/login", loginUser);

// router.post("/upload", upload.single("image"), uploadImage);
router.post("/upload", authMiddleware, upload.single("image"), uploadImage);
router.get("/image/:filename", getSignedUrl);

router.get("/gardens", getGardens);
router.get("/gardens/:id", getGardenById);
router.get("/gardens/:id/events", getGardenEvents);

// router.post("/gardens", addGarden);
router.post("/gardens", authMiddleware, addGarden);

export default router;
