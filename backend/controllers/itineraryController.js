import Itinerary from "../models/Itinerary.js";
import { itineraryData, itineraryEventsData } from "./aiResponse.js";
import ItineraryEvent from "../models/ItineraryEvent.js";
// Create Itinerary
export const createItinerary = async (req, res) => {
  const newItinerary = new Itinerary(itineraryData);
  console.log(req.body);
  try {
    const savedItinerary = await newItinerary.save();
    console.log(savedItinerary); // Log the saved itinerary

    // After saving the itinerary, save associated events and collect their IDs
    let eventIds = [];
    for (const eventData of itineraryEventsData) {
      const newEvent = new ItineraryEvent({
        ...eventData,
        itineraryId: savedItinerary._id // Ensure the event is linked to the newly created itinerary
      });
      const savedEvent = await newEvent.save();
      eventIds.push(savedEvent._id);
    }

    // Update the itinerary with event IDs
    savedItinerary.itineraryEvents = eventIds;
    await savedItinerary.save();

    res.status(200).json({ success: true, message: "Successfully created a new itinerary and events", data: { itinerary: savedItinerary, events: eventIds } });
  } catch (error) {
    console.error(error); // Log the error
    res.status(500).json({ success: false, message: "Failed to create a new itinerary and events", data: error });
  }
};

// Update Itinerary
export const updateItinerary = async (req, res) => {
    const id = req.params.id;
    try {
      const updatedItinerary = await Itinerary.findByIdAndUpdate(
        id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json({
        success: true,
        message: "Successfully updated",
        data: updatedItinerary,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to update",
      });
    }
};

// Delete Itinerary
export const deleteItinerary = async (req, res) => {
    const id = req.params.id;
    try {
      await Itinerary.findByIdAndDelete(id);
      res.status(200).json({
        success: true,
        message: "Successfully deleted",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to delete",
      });
    }
};

// Get Single Itinerary
export const getSingleItinerary = async (req, res) => {
    const id = req.params.id;
    try {
      const itinerary = await Itinerary.findById(id);
      res.status(200).json({
        success: true,
        message: "Successful",
        data: itinerary,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: "Not found",
      });
    }
};

// Get All Itineraries
export const getAllItinerary = async (req, res) => {
    const page = parseInt(req.query.page);

    try {
      const itineraries = await Itinerary.find({})
        .skip(page * 8)
        .limit(8);
      res.status(200).json({
        success: true,
        count: itineraries.length,
        message: "Successful",
        data: itineraries,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: "Not found",
      });
    }
};

// get itinerary by search
export const getItineraryBySearch = async (req, res) => {
    const origin = new RegExp(req.query.origin, "i"); // here i is for case insensitive
  
    try {
      const itineraries = await Itinerary.find({
        origin,
      });
      res.status(200).json({
        success: true,
        message: "Successful",
        data: itineraries,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: "Not found",
      });
    }
  };
  
  // get featured itineraries
  export const getFeaturedItinerary = async (req, res) => {
    try {
      const itineraries = await Itinerary.find({ featured: true })
        .limit(8);
      res.status(200).json({
        success: true,
        message: "Successful",
        data: itineraries,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: "Not found",
      });
    }
  };
  
  // get itinerary counts
  export const getItineraryCount = async (req, res) => {
    try {
      const itineraryCount = await Itinerary.estimatedDocumentCount();
  
      res.status(200).json({
        success: true,
        data: itineraryCount,
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: "Failed to fetch",
      });
    }
  };
  
export default {
  createItinerary,
  updateItinerary,
  deleteItinerary,
  getSingleItinerary,
  getAllItinerary,
  getItineraryBySearch,
  getItineraryCount,
  getFeaturedItinerary
};
