import express from "express";
import {
  createItinerary,
  getItineraryById
} from "../controllers/itineraryController.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// Create new itinerary
router.post("/",createItinerary);
// Get single itinerary
router.get("/:id", getItineraryById);




export default router;
