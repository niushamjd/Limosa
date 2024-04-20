import Itinerary from '../models/Itinerary.js';

// Controller function to create an itinerary object
export const createItinerary = async (req, res) => {
  try {
      console.log('Received data:', req.body); // Log incoming data

      const { userId, itineraryEvents, dateRange, photo, tips } = req.body;
      console.log('Parsed data:', { userId, itineraryEvents, dateRange, photo, tips });

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
