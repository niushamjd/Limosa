const mongoose = require('mongoose');

const itinerarySchema = new mongoose.Schema({
    destination: String,
    dateRange: Array,
    peopleGroup: String,
    budget: String,
});

const ItineraryModel = mongoose.model('itineraries', itinerarySchema);

module.exports = ItineraryModel;
