const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
    },
    lastName: {
        type: String,
        minLength: 2,
        maxLength: 50,
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email");
            }
        }
    },
    password: {
        type: String,
        required: true,
    },
    age: {
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value) {
            if (!["male", "female", "other"].includes(value)) {
                throw new Error("Gender data is not valid.");
            }
        }
    },
    photoURL: {
        type: String,
        default: 'https://stock.adobe.com/in/images/handsome-smiling-business-man-in-blue-shirt-isolated-on-gray-background/243123463https://as1.ftcdn.net/jpg/02/43/12/34/1000_F_243123463_zTooub557xEWABDLk0jJklDyLSGl2jrr.webp'
    },
    about: {
        type: String,
        default: 'This is default value.'
    },
    skills: {
        type: [String],
    }
}, { timestamps: true })

const User = mongoose.model('User', userSchema);
module.exports = { User };