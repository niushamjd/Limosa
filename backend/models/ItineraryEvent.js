import mongoose from 'mongoose';
const { Schema } = mongoose;

const itineraryEventSchema = new Schema({
  itineraryId: { type: Schema.Types.ObjectId, ref: 'Itinerary', required: true },
  itineraryEventId: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId(), index: { unique: true } },
  eventName: String,
  location: String, // Location changed to String type
  timeRange: { start: Date, end: Date },
  photo: String,
  description: String,
  date: Date,
  tips: String,
}, { timestamps: true });

export default mongoose.model('ItineraryEvent', itineraryEventSchema);
