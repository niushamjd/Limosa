import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";
import itineraryRoute from "./routes/itineraries.js";

import userRoute from "./routes/users.js";
import authRoute from "./routes/auth.js";
import reviewRoute from "./routes/reviews.js";
import bookingRoute from "./routes/bookings.js";
import transferBookingRoute from "./routes/transferBookings.js"; // The route file for transfer bookings
import interestRoute from "./routes/interests.js";
import businessRoute from "./routes/business.js";


dotenv.config();
const app = express();
const port = process.env.PORT || 8000;


const corsOptions = {
    origin: true,
    credentials: true,
};

// Use CORS with the options you've defined
app.use(cors(corsOptions));

// Connect to MongoDB
mongoose.set('strictQuery', false);
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("MongoDB connected");
      //  fillInitialInterests();
    } catch (error) {
        console.log(error.message);
    }
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use("/api/v1/auth",authRoute);
app.use('/api/v1/new-itinerary',itineraryRoute);
app.use('/api/v1/transfer-booking', transferBookingRoute); // Using the transfer booking routes

app.use('/api/v1/users',userRoute);
app.use('/api/v1/review',reviewRoute);
app.use('/api/v1/booking',bookingRoute);
app.use('/api/v1/interests',interestRoute);
app.use('/api/v1/itinerary',itineraryRoute);
app.use('/api/v1/business',businessRoute);
app.use(express.static('public'));



app.listen(port, () =>{
connect();
console.log(`Server is running on port ${port}`)});


