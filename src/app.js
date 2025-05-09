const express = require("express");
const { connectDB } = require("./config/database")
const app = express();
const { User } = require("./models/user")

const { validateSignUpData } = require('./utils/validation')
const bcrypt = require('bcrypt')
app.use(express.json());

app.post('/signup', async (req, res) => {
    try {
        validateSignUpData(req)
        const { firstName, lastName, emailId, password } = req.body;
        const passwordHash = await bcrypt.hash(password, 10)
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash
        });

        await user.save();
        res.send("User Added Successfully.")
    } catch (error) {
        res.status(400).send("Error saving user" + error.message)
    }
})

app.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("Invalid Credentials.")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (isPasswordValid) {


            res.send("Login successfully.")
        }
        else {
            throw new Error("Invalid Credentials.")
        }

    } catch (error) {
        res.status(400).send("Error saving user" + error.message)
    }
})

app.get('/user', async (req, res) => {
    const email = req.body.email;

    try {
        const users = await User.find({ emailId: email })
        if (users.length === 0) {
            res.status(404).send("user not found")
        } else {
            res.send(users)
        }
    } catch (error) {
        res.status(400).send("Something get wrong")
    }
})

app.get('/feed', async (req, res) => {
    try {
        const users = await User.find({})
        if (users.length === 0) {
            res.status(404).send("users not found")
        } else {
            res.send(users)
        }
    } catch (error) {
        res.status(400).send("Something get wrong")
    }
})

app.delete('/user', async (req, res) => {
    const userId = req.body.userId;
    try {
        const user = await User.findByIdAndDelete(userId)
        res.send("User deleted successfully.")
    } catch (error) {
        res.status(400).send("Something get wrong")
    }
})

app.patch('/user/:userId', async (req, res) => {
    const data = req.body;
    const userId = req.params?.userId;
    // const emailId = req.body.emailId;

    try {
        const ALLOWED_UPDATES = ['skills', 'age', 'about', 'photoURL', 'gender']

        const isUpdatedAllowed = Object.keys(data).every((k) => ALLOWED_UPDATES.includes(k));

        if (!isUpdatedAllowed) {
            throw new Error("Update not allowed.")
        }
        if (data?.skills?.length > 10) {
            throw new Error("Update not allowed.")
        }
        const user = await User.findByIdAndUpdate(userId, data, {
            runValidators: true
        })
        // const user = await User.findOneAndUpdate({ emailId: emailId }, data, {
        //     runValidators: true
        // })
        res.send("User updated successfully.")
    } catch (error) {
        res.status(400).send("Something get wrong" + error.message)
    }
})











connectDB()
    .then(() => {
        console.log("Database connection established..");
        app.listen(3000, () => {
            console.log('Listening............')
        });
    })
    .catch((err) => {
        console.error("Database cannot be connect.");
    })



