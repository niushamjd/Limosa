
import express from 'express';
import { login, register, forgotPassword, resetPassword} from '../controllers/authController.js';
import { googleLogin } from '../controllers/authController.js';
const router = express.Router();

router.post("/register", register)
router.post("/login", login)
router.post('/forgot-password', forgotPassword);
// Route for resetting password
router.put("/resetpassword/:token", resetPassword);
router.post('/google-login', googleLogin);
export default router;