const mongoose = require('mongoose');

const dbHost = "ocp7.mottm2d.mongodb.net";
const dbAppName = "OCP7";
const dbUsername = "noamocp7user";
const dbPassword = "d4ReplTDH0loEhz9";

const dbUri = `mongodb+srv://${dbUsername}:${dbPassword}@${dbHost}/?retryWrites=true&w=majority&appName=${dbAppName}`;

async function connectToDatabase() {
  try {
    await mongoose.connect(dbUri);
    console.log('Connected successfully to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

module.exports = { connectToDatabase };
