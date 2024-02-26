
import dotenv from "dotenv";
dotenv.config();
// Import necessary AWS SDK components
import { SESClient } from "@aws-sdk/client-ses";

// Define your SES configuration here
const SES_CONFIG = {
   region: process.env.AWS_REGION,
   credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
   },
};

// Create an SES client instance with the configuration
const sesClient = new SESClient({
   region: process.env.AWS_REGION,
   credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
   },
});

export { sesClient, SES_CONFIG };



