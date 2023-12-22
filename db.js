const mongoose = require('mongoose')

require('dotenv').config();

const URL = process.env.URL 
const dbConnection = () => {
    try {
        mongoose.connect(URL);
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log("Error Connecting in DB", error)
    }
}

module.exports = dbConnection