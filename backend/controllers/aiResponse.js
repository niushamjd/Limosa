// aiResponse.js
import mongoose from 'mongoose';

// Updated dummy data for Itinerary without specifying _id
const itineraryData = {
    title: "My Dream Vacation",
    userId: new mongoose.Types.ObjectId(), // Ensure this matches your schema's userId field
    description: "Exploring the wonders of Italy.",
    startDate: new Date(2024, 3, 15),
    endDate: new Date(2024, 3, 25),
    events: [] // This will be filled with event IDs later
};

// Dummy data for Itinerary Events, no changes required here unless you manually set _id
const itineraryEventsData = [
  {
    eventName: "Arrival in Rome",
    location: "Rome, Italy",
    timeRange: { start: new Date(2024, 3, 15, 10, 0), end: new Date(2024, 3, 15, 11, 0) },
    photo: "url-to-rome-photo.jpg",
    description: "Landing at Fiumicino and heading to the hotel.",
    date: new Date(2024, 3, 15),
    tips: "Remember to exchange some euros at the airport."
  },
  {
    eventName: "Visit to the Colosseum",
    location: "Rome, Italy",
    timeRange: { start: new Date(2024, 3, 16, 9, 0), end: new Date(2024, 3, 16, 12, 0) },
    photo: "url-to-colosseum-photo.jpg",
    description: "Exploring ancient Roman history.",
    date: new Date(2024, 3, 16),
    tips: "Buy tickets in advance to skip the line."
  }
];

// No need to manually set _id for events, MongoDB will generate them
// Export the modified data
export { itineraryData, itineraryEventsData };