import express from 'express';
import { createBusiness, getAllBusiness } from '../controllers/businessController';

const router = express.Router();

// Create new business
router.post("/", createBusiness);
// Get all businesses
router.get("/", getAllBusiness);