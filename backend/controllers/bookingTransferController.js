import TransferBooking from '../models/TransferBooking.js' // Assuming you have a separate model for Transfer Bookings
import aws from 'aws-sdk';
const SES_CONFIG = {
    accessKeyId:" AKIAZL6AEHK5TKCA2BDI", // Ensure you have these values in your environment variables
    secretAccessKey: "6avasF3NN7IbCfFmirRjXu1N8ZWNyHFvW5OkC13K",
    region: 'us-east-1', // Replace with your AWS SES region
  };

  
  const AWS_SES=new aws.SES(SES_CONFIG);
  
  const sendEmail = async (recipientEmail, subject, htmlContent) => {
    let params = {
        Source: "limosaprojects@gmail.com",
        Destination: {
            ToAddresses: ["limosaprojects@gmail.com"]
        },
        ReplyToAddresses: ["limosaprojects@gmail.com"],
        Message: {
            Body: {
                Html: {
                    Charset: 'UTF-8',
                    Data: htmlContent
                }
            },
            Subject: {
                Charset: 'UTF-8',
                Data: subject
            }
        }
    };
    try {
        await AWS_SES.sendEmail(params).promise();
        console.log(`Email sent to ${recipientEmail}`);
    } catch (error) {
        console.error(error);
    }
};
  export const createTransferBooking = async (req, res) => {
    const newTransferBooking = new TransferBooking(req.body);
    
    try {
        const savedTransferBooking = await newTransferBooking.save();
        console.log(savedTransferBooking);

        // Email content
        const formattedMessage = `
            <html><body>
            <h1>New Transfer Booking</h1>
            <p>A new transfer has been booked. Details are as follows:</p>
            <ul>
                <li>Transfer From: ${savedTransferBooking.transferFrom}</li>
                <li>Transfer To: ${savedTransferBooking.transferTo}</li>
                <li>Full Name: ${savedTransferBooking.fullName}</li>
                <li>Flight Number: ${savedTransferBooking.flightNumber}</li>
                <li>Names of Passengers: ${savedTransferBooking.passengerNames}</li>
                <li>Phone: ${savedTransferBooking.phone}</li>
                <li>Email: ${savedTransferBooking.userEmail || 'N/A'}</li>
                <li>Pickup Date: ${new Date(savedTransferBooking.transferDate).toLocaleDateString()}</li>
            </ul>
            </body></html>`;

        // Sending the email
        await sendEmail(savedTransferBooking.userEmail, 'New Transfer Booking', formattedMessage);

        res.status(200).json({ success: true, message: 'Your transfer is booked', data: savedTransferBooking });
    } catch (error) {
        console.error("Error processing booking: ", error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};


    // get single booking
    export const getTransferBooking =async (req,res)=>{
        const  id = req.params.id
        try {
            const book = await TransferBooking.findById(id)
            res.status(200).json({success:true, message:'successful',data:book})
        }
        catch (error) {
            res.status(404).json({success:true, message:'not found'})
        }
    }

        // get all booking
        export const getAllTransferBooking =async (req,res)=>{
            try {
                const books = await TransferBooking.find()
                res.status(200).json({success:true, message:'successful',data:books})
            }
            catch (error) {
                res.status(500).json({success:true, message:'internal server error'})
            }
        }

 