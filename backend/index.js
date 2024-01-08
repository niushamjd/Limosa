const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/User");
const ItineraryModel = require("./models/Itinerary");
const aws = require("aws-sdk");

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb+srv://limosaprojects:UmutHoca@limosainstance0.ccyvaqc.mongodb.net/?retryWrites=true&w=majority")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("Could not connect to MongoDB", err));

  app.post("/login", (req, res) => {
    const { email, password } = req.body;
  
    UserModel.findOne({ email: email })
      .then((user) => {
        if (user && password === user.password) {
          sendEmail(email, user.name); // Send email after successful login
          res.json({ status: "ok" });
        } else {
          res.json({ status: "error", error: "Invalid login credentials" });
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({ status: "error", error: "Internal Server Error" });
      });
  });

app.post("/signup", (req, res) => {
  UserModel.create(req.body)
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json(err));
});



app.listen(3001, () => {
  console.log("Server is running...");
});
app.post("/itinerary", (req, res) => {
    ItineraryModel.create(req.body)
        .then(itinerary => res.json(itinerary))
        .catch(err => res.status(400).json(err));
});

const SES_CONFIG ={
  accessKeyId: "AKIA6ODU6LS2DGDPXLEJ"   , 
  secretAccessKey: "v+vAkxw+/rFc612+kbaJDzb81Ojzh4mal/5KcWRp", 
  region: 'eu-north-1'  // AWS region for your SES (EU Stockholm)
};

const AWS_SES=new aws.SES(SES_CONFIG);

const sendEmail = async (recipientEmail, name) => {
  let params = {
    Source: "limosaprojects@gmail.com",
    Destination: {
      ToAddresses: [recipientEmail]
    },
    ReplyToAddresses: ["limosaprojects@gmail.com"],
    Message: {
      Body: {
        Html: {
          Charset: 'UTF-8',
          Data: `<html><body><h1>Hi ${name},</h1><p>Welcome to Limosa!</p></body></html>`
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'Welcome to Limosa!'
      }
    }
  };
  try {
    await AWS_SES.sendEmail(params).promise();
    console.log(`Email sent to ${recipientEmail}`);
  } catch (error) {
    console.log(error);
  }
};