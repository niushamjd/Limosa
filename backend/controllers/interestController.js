import mongoose from 'mongoose';
import Interest from '../models/Interest.js';

// Function to fill the database with initial interests
const fillInitialInterests = async () => {
  try {
    // Array of initial interests data
    const initialInterests = [
      { interestName: 'Culture', interestPhoto: 'cultureImage.jpg' },
      { interestName: 'Adventure', interestPhoto: 'adventureImage.jpg' },
      { interestName: 'Foodie', interestPhoto: 'foodieImage.jpg' },
      { interestName: 'Art', interestPhoto: 'artImage.jpg' },
      { interestName: 'Relaxation-lover', interestPhoto: 'relaxImage.jpg' },
      { interestName: 'Fun', interestPhoto: 'funImage.jpg' },
      { interestName: 'Nature', interestPhoto: 'natureImage.jpg' },
      { interestName: 'Shopping', interestPhoto: 'shopImage.jpg' },
    ];

    // Insert the initial interests into the database
    await Interest.insertMany(initialInterests);

    console.log('Initial interests inserted successfully');
  } catch (error) {
    console.error('Error inserting initial interests:', error);
  }
};

const getInterest = async (req, res) => {
    const id = req.params.id;
    try {
        const interest = await Interest.findById(id);
        res.status(200).json({ success: true, message: 'successful', data: interest });
    } catch (error) {
        res.status(404).json({ success: true, message: 'not found' });
    }
    }

// Function to get all interests
    const getAllInterests = async (req, res) => {
        try {
            const interests = await Interest.find({})
            res.status(200).json({ success: true, message: 'successful', data: interests });
        } catch (error) {
            res.status(500).json({ success: true, message: 'internal server error' });
        }
    }

export { fillInitialInterests, getInterest, getAllInterests };
