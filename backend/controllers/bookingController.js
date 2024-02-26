import Booking from '../models/Booking.js'
import { sendEmail } from '../utils/mailer.js';

export const createBooking = async (req, res) => {
    const newBooking = new Booking(req.body);
    try {
        const savedBooking = await newBooking.save();
        const formattedMessage = `
            A new tour has been booked. Details are as follows:
            Tour Name: ${savedBooking.tourName} 
            Full Name: ${savedBooking.fullName}
            Number of Guests: ${savedBooking.guestSize}
            Phone: ${savedBooking.phone}
            Booking Date: ${new Date(savedBooking.bookAt).toLocaleDateString()}
            Email: ${savedBooking.userEmail || 'N/A'}
        `;

        const params = {
            Destination: {
                ToAddresses: ['prosmarttravel@gmail.com'],
            },
            Message: {
                Body: {
                    Text: { Data: formattedMessage },
                },
                Subject: { Data: 'New Tour Booking' },
            },
            Source: 'prosmarttravel@gmail.com',
        };
    
        try {
            const emailResponse = await sendEmail(params);
            console.log(emailResponse);
            // Send response here after email is successfully sent
            res.status(200).json({ success: true, message: 'Your tour is booked', data: savedBooking });
        } catch (error) {
            console.error("Error sending email: ", error);
            // Send a different response if there's an error sending the email
            res.status(500).json({ success: false, message: 'Error processing your booking.' });
            return; // Make sure to return here to prevent further execution
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
}

    // get single booking
    export const getBooking =async (req,res)=>{
        const  id = req.params.id
        try {
            const book = await Booking.findById(id)
            res.status(200).json({success:true, message:'successful',data:book})
        }
        catch (error) {
            res.status(404).json({success:true, message:'not found'})
        }
    }

        // get all booking
        export const getAllBooking =async (req,res)=>{
            try {
                const books = await Booking.find()
                res.status(200).json({success:true, message:'successful',data:books})
            }
            catch (error) {
                res.status(500).json({success:true, message:'internal server error'})
            }
        }