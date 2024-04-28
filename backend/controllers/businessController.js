import Business from '../models/Business.js';
// Controller function to create a business object
export const createBusiness = async (req, res) => {
    try {
        // Check if a business with the same name already exists
        const existingBusiness = await Business.findOne({ name: req.body.name });
        if (existingBusiness) {
            return res.status(400).json({ success: false, message: 'A business with the same name already exists' });
        }

        // If no existing business found, create a new one
        const newBusiness = new Business(req.body);
        const savedBusiness = await newBusiness.save();
        res.status(201).json({ success: true, message: 'Business created successfully', data: savedBusiness });
    } catch (error) {
        console.error('Error saving business:', error); // Log detailed error
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};


// Controller function to get all business objects
export const getAllBusiness = async (req, res) => {
    try {
        const businesses = await Business.find();
        res.status(200).json({ success: true, message: 'Businesses found', data: businesses });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};
