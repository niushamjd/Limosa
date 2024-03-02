import mongoose from 'mongoose';
const { Schema } = mongoose;

const itinerarySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  itineraryId: { type: Schema.Types.ObjectId, default: () => new mongoose.Types.ObjectId(), index: { unique: true } },
  itineraryEvents: [{ type: Schema.Types.ObjectId, ref: 'ItineraryEvent' }],
  dateRange: { start: Date, end: Date },
  photo: String,
}, { timestamps: true });

export default mongoose.model('Itinerary', itinerarySchema);
