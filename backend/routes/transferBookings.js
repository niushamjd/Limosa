import express from 'express';
import { verifyAdmin, verifyUser } from '../utils/verifyToken.js'; 
import {
    createTransferBooking,
    getTransferBooking,
    getAllTransferBooking,

  } from '../controllers/bookingTransferController.js';
const router = express.Router();

router.post('/',createTransferBooking);
router.get('/:id', verifyUser, getTransferBooking);

// GET request to retrieve all transfer bookings
router.get('/', verifyUser, getAllTransferBooking);

export default router;