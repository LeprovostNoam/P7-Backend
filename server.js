const express = require('express');
const cors = require('cors'); 

require("dotenv").config({ path: "./config/.env" });

const { connectToDatabase } = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();


app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth', authRoutes);

let port = process.env.PORT || '4000';
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  connectToDatabase(); 
});
