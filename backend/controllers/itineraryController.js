import Itinerary from '../models/Itinerary.js';

// Controller function to create an itinerary object
export const createItinerary = async (req, res) => {
  try {

      const { userId, itineraryEvents, dateRange, photo, tips } = req.body;

      const newItinerary = new Itinerary({
          userId,
          itineraryEvents,
          dateRange,
          photo,
          tips
      });

      const savedItinerary = await newItinerary.save();
      res.status(201).json({ success: true, message: 'Itinerary created successfully', data: savedItinerary });
  } catch (error) {
      console.error('Error saving itinerary:', error); // Log detailed error
      res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
};


// Controller function to get itinerary object by ID
export const getItineraryById = async (req, res) => {
    try {
        // Extract itinerary ID from request parameters
        const { id } = req.params;

        // Find the itinerary object by ID
        const itinerary = await Itinerary.findById(id);

        if (!itinerary) {
            return res.status(404).json({ success: false, message: 'Itinerary not found' });
        }

        res.status(200).json({ success: true, message: 'Itinerary found', data: itinerary });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

export const getUSerItineraries = async (req, res) => {
  try {
      const { userId } = req.params;
      const itineraries = await Itinerary.find({ userId });

      res.status(200).json({ success: true, message: 'User itineraries found', data: itineraries });
  } catch (error) {
      res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
  }
}

// Controller function to delete an event from a specific date and period
export const deleteEventFromItinerary = async (req, res) => {
    const { itineraryId, date, period, eventName } = req.body;
    console.log(itineraryId);
    console.log(`Attempting to delete event: ${eventName} on ${date} during ${period}`);
    try {
        const update = {
            $pull: { [`itineraryEvents.${date}.${period}`]: { name: eventName } }
        };
        const itinerary = await Itinerary.findByIdAndUpdate(itineraryId, update, { new: true });
        if (!itinerary) {
            console.log('Itinerary not found with ID:', itineraryId);
            return res.status(404).json({ success: false, message: 'Itinerary not found' });
        }
        console.log('Event deleted, updated itinerary:', itinerary);
        res.status(200).json({ success: true, message: 'Event deleted successfully', data: itinerary });
    } catch (error) {
        console.error('Error deleting event from itinerary:', error);
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};
