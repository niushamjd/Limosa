import mongoose from "mongoose";

const { Schema } = mongoose;

const addressSchema = new Schema({
  street: { type: String, required: false },
  city: { type: String, required: false },
  state: { type: String, required: false },
  zipCode: { type: String, required: false },
  country: { type: String, required: false }
});

const contactSchema = new Schema({
  phone: String,
  email: String,
  website: String,
  address: addressSchema
});

const offerSchema = new Schema({
  title: String,
  description: String,
  startDate: Date,
  endDate: Date
});

const eventSchema = new Schema({
  eventName: String,
  eventDescription: String,
  eventDate: Date
});

const businessSchema = new Schema({
  name: { type: String, required: true },
  type: String,
  openingHours: String, // You can make this more complex if needed
  contactDetails: contactSchema,
  specialOffers: [offerSchema],
  events: [eventSchema],
  premium: { type: Boolean, default: false }
}, { timestamps: true }); // Include timestamps to track creation and updates

const Business = mongoose.model("Business", businessSchema);

export default Business;
