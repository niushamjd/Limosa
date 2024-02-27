import mongoose from "mongoose";
import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },

    photo: {
      type: String,
    },

    role: {
      type: String,
      default: "user",
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
