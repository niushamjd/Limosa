import express from 'express';
import { deleteUser, getAllUser, getAllExceptSingleUser, updateUser, connectUser, getUserFriends} from '../controllers/userController.js';
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




export default router;
