import mongoose from "mongoose";

const transferSchema = new mongoose.Schema(
  {
    title: {
      type: String,
     
      unique: true,
    },
    origin: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    price: {
        type: Number,
        required: true,
      },
      passengers: {
        type: Number,
        required: true,
      },
  
      featured: {
        type: Boolean,
        default: false,
      },
    photo: {
      type: String,
      required: true,
    },
    departureDate: {
      type: String,
      required: true,
    },


  },
  { timestamps: true }
);

export default mongoose.model("Transfer", transferSchema);
