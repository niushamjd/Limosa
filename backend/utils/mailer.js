import { sesClient } from './aws-config.js';
import { SendEmailCommand } from '@aws-sdk/client-ses';

// Function to send email using the sesClient and SendEmailCommand (v3)
const sendEmail = async (params) => {
  const command = new SendEmailCommand(params);
  return await sesClient.send(command);
};

export { sendEmail };
