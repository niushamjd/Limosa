import Itinerary from "../models/Itinerary.js";
import { itineraryData, itineraryEventsData } from "./aiResponse.js";
import ItineraryEvent from "../models/ItineraryEvent.js";
// Create Itinerary
export const createItinerary = async (req, res) => {
  // Assuming itineraryData comes from your aiResponse.js or similar
  const newItinerary = new Itinerary(itineraryData);
  try {
    const savedItinerary = await newItinerary.save();

    // Save associated events and collect detailed data
    let eventsDetails = [];
    for (const eventData of itineraryEventsData) {
      const newEvent = new ItineraryEvent({
        ...eventData,
        itineraryId: savedItinerary._id
      });
      const savedEvent = await newEvent.save();
      eventsDetails.push(savedEvent); // Push the whole event document instead of just the ID
    }

   // After saving the events, update the itinerary with the event IDs
await Itinerary.findByIdAndUpdate(savedItinerary._id, {
  $set: { itineraryEvents: eventsDetails.map(event => event._id) }
});

// Fetch the updated itinerary to include in the response
const updatedItinerary = await Itinerary.findById(savedItinerary._id).populate('itineraryEvents');

res.status(200).json({
  success: true, 
  message: "Successfully created a new itinerary and events", 
  data: {
    itinerary: updatedItinerary,
    events: eventsDetails
  }
});

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create a new itinerary and events", data: error });
  }
};


export const getDummyItinerary = async (req, res) => {
  try {
    // Directly return the dummy data imported from aiResponse.js
    res.status(200).json({
      success: true,
      message: "Dummy data fetched successfully",
      data: { itinerary: itineraryData, events: itineraryEventsData }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch dummy data", data: error });
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
