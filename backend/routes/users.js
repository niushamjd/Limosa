import express from 'express';
import { deleteUser, getAllUser,updateUserGroup, getUserById, getAllExceptSingleUser, updateUser, connectUser, getUserFriends, getGroupMembers, getUserFriendRequests,modifyFriendRequest, getUserGroups} from '../controllers/userController.js';
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';
import { connect } from 'mongoose';

const router = express.Router();

// Existing user routes
router.put("/:id", updateUser);
router.delete("/:id", verifyUser, deleteUser);
router.get("/:id", getAllExceptSingleUser);
router.get("/", getAllUser);
router.put("/:id/connect", connectUser);
router.get("/:id/friends", getUserFriends);
router.get("/:id/friend-requests", getUserFriendRequests);
router.put("/:id/friend-requests", modifyFriendRequest);
router.get("/:id/groups", getUserGroups);
router.put("/:id/groups", updateUserGroup);
//get group members based on group name
router.get("/:id/groups/:groupName", getGroupMembers);
//get a single user
router.get("/single/:id", getUserById);

router.get("/:id/interests", async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.status(200).json({ message: 'Interests found', data: user.interests });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  });
  


export default router;
