const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const UserModel = require("./models/User");
const ItineraryModel = require("./models/Itinerary");

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
      if (user) {
        if (password === user.password) {
          res.json({ status: "ok" });
        } else {
          res.json({ status: "error", error: "Invalid password" });
        }
      } else {
        res.json({ status: "error", error: "User does not exist" });
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