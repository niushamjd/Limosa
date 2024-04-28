import express from 'express';
import { createBusiness, getAllBusiness } from '../controllers/businessController.js';

const router = express.Router();

// Create new business
router.post("/", createBusiness);

// Get all businesses
router.get("/", getAllBusiness);

export default router;
