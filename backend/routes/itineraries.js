import express from "express";
import {
  createItinerary,
  updateItinerary,
  deleteItinerary,
  getSingleItinerary,
  getAllItinerary,
  getItineraryBySearch,
  getItineraryCount,
  getFeaturedItinerary
} from "../controllers/itineraryController.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// Create new itinerary
router.post("/", verifyUser,createItinerary);
// Update itinerary
router.put("/:id", verifyAdmin, updateItinerary);
// Delete itinerary
router.delete("/:id", verifyAdmin, deleteItinerary);
// Get single itinerary
router.get("/:id", getSingleItinerary);
// Get all itineraries
router.get("/", getAllItinerary);

 router.get("/search/getItineraryBySearch", getItineraryBySearch);
 router.get("/search/getFeaturedItinerarys", getFeaturedItinerary);
 router.get("/search/getItineraryCount", getItineraryCount);

export default router;
