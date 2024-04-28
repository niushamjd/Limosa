import Business from "../models/Business";

// Controller function to create a business object
export const createBusiness = async (req, res) => {
    try {
        const newBusiness = new Business(req.body);
        const savedBusiness = await newBusiness.save();
        res.status(201).json({ success: true, message: 'Business created successfully', data: savedBusiness });
    } catch (error) {
        console.error('Error saving business:', error); // Log detailed error
        res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
    }
};

// Controller function to get all business objects