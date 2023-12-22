const mongoose = require('mongoose');
require('dotenv').config();

// Replace the connection string with your actual database connection URI from the environment variables
const dbURI = process.env.URL;

async function connectDB() {
  try {
    //console.log('Connecting to MongoDB Atlas:', dbURI);
await mongoose.connect(dbURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
    console.log('Connected to MongoDB Atlas');
  } catch (error) {
    console.error('Error connecting to MongoDB Atlas:', error.message);
    process.exit(1);
  }
};

const db = mongoose.connection

// Event handlers for database connection
db.on('connected', () => {
  console.log("Connected to the database");
});

db.on('error', (err) => {
  console.error(`Database connection error: ${err}`);
  // In a production environment, you may consider more advanced error handling and application shutdown.
});

db.on('disconnected', () => {
  console.log('Database connection disconnected');
  // In a production environment, you might want to implement automatic reconnection logic here.
});

module.exports = {db, connectDB};
