import express from "express";
import {
  getInterest,
  getAllInterests
} from "../controllers/interestController.js";
const router = express.Router();

// Get all interests
router.get("/", getAllInterests);
// Get single interest
router.get("/:id", getInterest);

export default router;