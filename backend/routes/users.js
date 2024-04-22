import express from 'express';
import { deleteUser, getAllUser,updateUserGroup, getAllExceptSingleUser, updateUser, connectUser, getUserFriends, getUserFriendRequests,modifyFriendRequest, getUserGroups} from '../controllers/userController.js';
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




export default router;
