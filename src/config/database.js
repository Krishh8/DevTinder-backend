const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://khenikrish08:iXDCqftflvQyQ9bw@cluster0.owjzrbn.mongodb.net/devTinder"
    )
}

module.exports = { connectDB };

