import { connect } from "mongoose";
import User from "../models/User.js";
import bcrypt from 'bcryptjs';

// Function to reset password
// Function to reset password
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;
  try {
    // Find user by resetPasswordToken and check if token has expired
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });
    console.log("User found:", user); // Add this log statement

    if (!user) {
      console.log("Invalid or expired token");
      return res.status(400).json({ message: "Invalid or expired password reset token" });
    }
    
    // Hash the new password
    const salt = await bcrypt.genSaltSync(10);
    const hash = await bcrypt.hashSync(newPassword, salt);

    // Update user's password and clear resetPasswordToken and resetPasswordExpire
    user.password = hash;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    console.log("Password reset successful"); // Add this log statement
    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error) {
    console.error("Error resetting password:", error); // Add this log statement
    res.status(500).json({ message: "Error resetting password" });
  }
};


export const createUser = async (req, res) => {
  const newUser = new User(req.body);
  try {
    const savedUser = await newUser.save();
    res.status(200).json({
      success: true,
      message: "Succesfully created a new User",
      data: savedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create a new User",
      data: error,
    });
  }
};
// update User
export const updateUser = async (req, res) => {
  const id = req.params.id;
  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: "Succesfully updated",
      data: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update",
    });
  }
};
// delete User
export const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Succesfully deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete",
    });
  }
};
// getSingle User
export const getAllExceptSingleUser = async (req, res) => {
  const currentUserId = req.params._id; 

  try {
    // Find all users except the current user
    const users = await User.find({ _id: { $ne: currentUserId } });
    res.status(200).json({
      success: true,
      message: "Successful",
      data: users,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "Not found",
      error: error.message
    });
  }
};
// getAll Users
export const getAllUser = async (req, res) => {

  try {
    const users = await User.find({})
    res.status(200).json({
      success: true,
      message: "Succesfull",
      data: users,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "not found",
    });
  }
};
export const connectUser = async (req, res) => {
  const { friendId } = req.body; // ID of the friend to add
  const userId = req.params.id; // ID of the user making the request

  if (!friendId) {
    return res.status(400).json({
      success: false,
      message: "Friend ID is required",
    });
  }

  // Check if the user is trying to add themselves as a friend
  if (userId === friendId) {
    return res.status(400).json({
      success: false,
      message: "Cannot add yourself as a friend",
    });
  }

  try {
    // Retrieve the user to ensure they exist and to check the friends list
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the friend ID is already in the user's friends list
    if (user.friends.includes(friendId)) {
      return res.status(400).json({
        success: false,
        message: "Friend already added",
      });
    }

    // Add the friend's ID to the user's friends array
    user.friends.push(friendId);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Friend added successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


// Assuming User schema has 'friends' as references to other User documents
export const getUserFriends = async (req, res) => {
  const userId = req.params.id;
  try {
    const userWithFriends = await User.findById(userId).populate({
      path: 'friends',
      // Selecting additional fields to include in the result
      select: 'name surname username email photo interests pastItineraries groups',
      populate: {
        path: 'interests groups', // Assuming interests and groups are references
      }
    });

    if (!userWithFriends) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Successfully retrieved friends",
      data: userWithFriends.friends
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

