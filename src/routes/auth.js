const express = require("express");
const { validateSignUpData } = require("../utils/validation");
const { User } = require("../models/user");
const bcrypt = require('bcrypt')
require('dotenv').config()


const authRouter = express.Router();

authRouter.post('/signup', async (req, res) => {
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
        res.status(400).send("Error saving user " + error.message)
    }
})

authRouter.post('/login', async (req, res) => {
    try {
        const { emailId, password } = req.body;
        const user = await User.findOne({ emailId: emailId })
        if (!user) {
            throw new Error("Invalid Credentials.")
        }
        const isPasswordValid = await user.validatePassword(password)

        if (isPasswordValid) {
            const token = await user.getJWT();
            res.cookie('token', token, { expires: new Date(Date.now() + 8 * 3600000) })
            res.send("Login successfully.")
        }
        else {
            throw new Error("Invalid Credentials.")
        }

    } catch (error) {
        res.status(400).send("Error saving user" + error.message)
    }
})

module.exports = { authRouter }