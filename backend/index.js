const express = require("express")
const mongoose = require( 'mongoose')
const cors = require("cors")
const UserModel = require("./models/User")

const app = express ()
app.use(express.json())
app.use(cors())
mongoose.connect("mongodb://127.0.0.1:27017/user")

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    UserModel.findOne({ email: email })
        .then(user => {
            if (user) {
                if (password === user.password) {
                    res.json({ status: 'ok' });
                } else {
                    res.json({ status: 'error', error: 'Invalid password' });
                }
            } else {
                res.json({ status: 'error', error: 'User does not exist' });
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ status: 'error', error: 'Internal Server Error' });
        });
});

app.post('/signup', (req, res) => {
    UserModel.create(req.body)
    .then(users => res.json(users))
    .catch(err => res.status(400).json(err))
}
)   

app.listen(3001, () => {
    console.log("Server is running...")
}
)