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
// update User
export const updateUserGroup = async (req, res) => {
  const id = req.params.id;
  const groupsToUpdate = req.body.groups;  // Get the updated groups array from the request

  try {
      // Update the user's groups array directly with the provided array
      const updatedUser = await User.findByIdAndUpdate(id, {
          $set: { groups: groupsToUpdate }
      }, {
          new: true,
          runValidators: true
      });

      if (!updatedUser) {
          return res.status(404).json({
              success: false,
              message: "User not found"
          });
      }

      res.status(200).json({
          success: true,
          message: "Groups updated successfully",
          data: updatedUser
      });
  } catch (error) {
      console.error("Failed to update user:", error);
      res.status(500).json({
          success: false,
          message: "Failed to update"
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
  const { friendId, action } = req.body;
  const userId = req.params.id;
  
  if (!friendId) {
    return res.status(400).json({
      success: false,
      message: "Friend ID is required",
    });
  }

  if (userId === friendId) {
    return res.status(400).json({
      success: false,
      message: "Cannot perform action on yourself",
    });
  }

  try {
    const user = await User.findById(userId);
    const targetUser = await User.findById(friendId);

    if (!targetUser || !user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (action === 'accept') {
      // Check if the user has already been accepted as a friend
      const alreadyFriend = user.friends.includes(friendId);

      if (!alreadyFriend) {
        // Check if there is a pending friend request
        if (user.friendRequests.includes(friendId)) {
          user.friends.push(friendId); // Add to friends
          user.friendRequests = user.friendRequests.filter(id => id.toString() !== friendId); // Remove from friendRequests
          await user.save();
           // Mutual friendship if not already in friends
           if (!targetUser.friends.includes(userId)) {
            targetUser.friends.push(userId);
           }
          await targetUser.save();
          return res.status(200).json({
            success: true,
            message: "Friend request accepted successfully",
            data: user,
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "No friend request to accept",
          });
        }
      } else {
        return res.status(400).json({
          success: false,
          message: "Already friends",
        });
      }
    } else if (action === 'unfollow') {
      const isAlreadyFriend = user.friends.includes(friendId);
      if (isAlreadyFriend) {
        user.friends = user.friends.filter(id => id.toString() !== friendId); // Remove from friends
        targetUser.friends = targetUser.friends.filter(id => id.toString() !== userId); // Mutual unfriend
        await user.save();
        await targetUser.save();
        return res.status(200).json({
          success: true,
          message: "Friend removed successfully",
          data: user,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Not friends to begin with",
        });
      }
    }
    else if (action === 'follow') {
      //add user Id to friends' frienRequests array
      //check if same user already in friend requests array

      if (targetUser.friendRequests.includes(userId)) {
        return res.status(400).json({
          success: false,
          message: "Friend request already sent",
        });
      } else {
        targetUser.friendRequests.push(userId);
        await targetUser.save();
        return res.status(200).json({
          success: true,
          message: "Friend request sent successfully",
          data: user,
        });
      }

    }
    else {
      return res.status(400).json({
        success: false,
        message: "Invalid action specified",
      });
    }
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

export const getUserFriendRequests = async (req, res) => {
  const userId = req.params.id; // Get the user ID from the request parameters
  try {
    const userWithFriendRequests = await User.findById(userId).populate({
      path: 'friendRequests', // Assuming the User model has a field 'friendRequests'
      select: 'name surname username email photo', // Only fetch needed fields
      // If friendRequests need to populate other fields like interests or groups
      populate: {
        path: 'interests groups', // Assuming interests and groups are references
        select: 'name description' // Fetch the name and description for each
      }
    });

    if (!userWithFriendRequests) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Successfully retrieved friend requests",
      data: userWithFriendRequests.friendRequests // Send the populated friendRequests array
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

export const modifyFriendRequest = async (req, res) => {
  const { action, requestId } = req.body;
  const userId = req.params.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (action === 'remove') {
      // Remove requestId from the user's friendRequests array
      user.friendRequests = user.friendRequests.filter(id => id.toString() !== requestId);
      await user.save();
      res.status(200).json({ message: 'Friend request declined' });
    } else {
      res.status(400).json({ message: 'Invalid action specified' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getUserGroups = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await
    User.findById(userId).populate('groups', 'groupName groupMates commonInterests'); 
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'Groups found', data: user.groups });
  }
  catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
}
