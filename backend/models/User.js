import mongoose from "mongoose";
import crypto from 'crypto';
import itinerarySchema from "./Itinerary.js";

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: false,
    },
    surname: {
      type: String,
      required: false,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    occupation: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
    },
    failedLoginAttempts: {
      type: Number,
      required: true,
      default: 0,
    },
    lockUntil: {
      type: Number,
    },
    
    photo: {
      type: String,
    },
    role: {
      type: String,
      default: "user",
    },
    interests: {
      type: [String],
      default: [],
    },
    pastItineraries: [{
      type: Schema.Types.ObjectId,
      ref: 'Itinerary', // Reference to the Itinerary model
    }],
    groups: {
      type: [{
          groupName: {
              type: String,
          },
          numberOfPeople: {
              type: Number,
          },
          commonInterests: {
              type: [String],
          },
      }],
      default: [],
    },
    friends: {
      type: [Schema.Types.ObjectId],
      ref: 'User',
      default: [],
    },
    resetPasswordToken: {
      type: String,
    },
    resetPasswordExpire: {
      type: Date,
    },
  },
  { timestamps: true }
);

userSchema.methods.getResetPasswordToken = function() {
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token (private key) and save to database
  this.resetPasswordToken = resetToken;

  // Set token expire time (10 minutes from now)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export default mongoose.model("User", userSchema);
