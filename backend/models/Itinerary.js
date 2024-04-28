import mongoose from 'mongoose';
const { Schema } = mongoose;

const eventSchema = new Schema({
  name: { type: String, required: true },
  activity: { type: String, default: '' }, // default to empty string if not provided
  type: { type: String, required: true },
  location: { type: String },
  photo: String,
});

const dailyEventsSchema = new Schema({
  morning: [eventSchema],
  afternoon: [eventSchema],
  evening: [eventSchema]
}, { _id: false }); // _id not necessary for this subdocument

const itinerarySchema = new Schema({
  name: { type: String },
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  itineraryEvents: { type: Map, of: dailyEventsSchema },
  dateRange: {
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  },
  photo: String,
  tips: String
}, { timestamps: true });

export default mongoose.model('Itinerary', itinerarySchema);
