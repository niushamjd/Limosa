import mongoose from 'mongoose';
const { Schema } = mongoose;

const coordinatesSchema = new Schema({
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true }
}, { _id: false }); // _id not necessary for this subdocument

const eventSchema = new Schema({
  name: { type: String, required: true },
  activity: { type: String, default: '' }, // default to empty string if not provided
  type: { type: String, required: true },
  location: { type: String },
  coordinates: coordinatesSchema, // Include coordinates schema
  photo: String,
}, { _id: false }); // _id not necessary for this subdocument if desired

const dailyEventsSchema = new Schema({
  morning: [eventSchema],
  afternoon: [eventSchema],
  evening: [eventSchema]
}, { _id: false }); // _id not necessary for this subdocument

const itinerarySchema = new Schema({
  name: { type: String },
  city: { type: String, required: true },
  group: { type: String, required: true },
  budget: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  itineraryEvents: { type: Map, of: dailyEventsSchema },
  dateRange: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },
  photo: String,
  tips: String,
  rate: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('Itinerary', itinerarySchema);
