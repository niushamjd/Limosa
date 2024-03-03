import express from 'express';
import { deleteUser, getAllUser, getSingleUser, updateUser, resetPassword } from '../controllers/userController.js';
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js';

const router = express.Router();

// Existing user routes
router.put("/:id", updateUser);
router.delete("/:id", verifyUser, deleteUser);
router.get("/:id", verifyUser, getSingleUser);
router.get("/", verifyAdmin, getAllUser);

// Route for resetting password
router.put("/resetpassword/:token", resetPassword);

export default router;
