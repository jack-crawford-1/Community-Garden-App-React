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

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("image"), uploadImage);
router.get("/image/:filename", getSignedUrl);
router.get("/gardens", getGardens);
router.get("/gardens/:id", getGardenById);
router.post("/gardens", addGarden);
router.get("/gardens/:id/events", getGardenEvents);

export default router;
