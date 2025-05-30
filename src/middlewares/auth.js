const jwt = require("jsonwebtoken")
require('dotenv').config()
const { User } = require("../models/user")

const userAuth = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            throw new Error("token is not valid.")
        }
        const decodedObj = await jwt.verify(token, process.env.JWT_SECRET_KEY);
        const { _id } = decodedObj;
        const user = await User.findById(_id);
        if (!user) {
            throw new Error("Not valid user.")
        }

        req.user = user;
        next()
    } catch (error) {
        res.status(400).send("Error : " + error.message)
    }
}

module.exports = { userAuth }