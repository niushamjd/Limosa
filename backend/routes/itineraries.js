import express from "express";
import {
  createItinerary,
  getItineraryById,
  getUSerItineraries,
  deleteEventsFromItinerary  // Import the new function
} from "../controllers/itineraryController.js";

const router = express.Router();

// Create new itinerary
router.post("/", createItinerary);
// Get single itinerary
router.get("/:id", getItineraryById);
// Get all itineraries of a user
router.get("/user/:userId", getUSerItineraries);
// Delete an event from an itinerary
router.post("/delete-event", (req, res) => {
  console.log("Delete event route hit");
  deleteEventsFromItinerary(req, res);
});

export default router;
