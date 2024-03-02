import Itinerary from "../models/Itinerary.js";

// Create Itinerary
export const createItinerary = async (req, res) => {
  const newItinerary = new Itinerary(req.body);
  console.log(req.body); // Add this line to log the incoming request data

  try {
    res.status(200).json({ success: true, message: "Successfully created a new itinerary", data: savedItinerary });
  } catch (error) {
    res.status(500).json({ success: false, message: "Failed to create a new itinerary", data: error });
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
