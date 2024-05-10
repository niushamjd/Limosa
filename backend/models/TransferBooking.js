import mongoose from 'mongoose';

const transferBookingSchema = new mongoose.Schema({
  transferFrom: {
    type: String,
    required: true
  },
  transferTo: {
    type: String,
    required: true
  },
  flightNumber: String,
  passengerNames: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  fullName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  transferDate: {
    type: String,
    required: true
  },
  transferTime:{
    type:String
  },
  note: {type:String},
  userId: {
    type: String,
  }
}, { timestamps: true });

export default mongoose.model("TransferBooking", transferBookingSchema);

