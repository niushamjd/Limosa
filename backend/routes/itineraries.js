import express from "express";
import {
  createItinerary,
  getItineraryById,
  getUSerItineraries,
  deleteItinerary,
  updateItinerary,
  deleteEventsFromItinerary,
  updateItineraryDays
} from "../controllers/itineraryController.js";
import { verifyAdmin, verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// Create new itinerary
router.post("/",createItinerary);
// Get single itinerary
router.get("/:id", getItineraryById);
// Get all itineraries of a user
router.get("/user/:userId", getUSerItineraries);
// Delete single itinerary
router.delete("/:id", deleteItinerary);
// Update single itinerary
router.put("/:id", updateItinerary);
// Delete an event from an itinerary
router.post("/delete-event", (req, res) => {
  deleteEventsFromItinerary(req, res);
});

// Update itinerary days
router.put("/update-days/:itineraryId", updateItineraryDays);






export default router;
