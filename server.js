const express = require('express');
const cors = require('cors'); 

const { connectToDatabase } = require('./config/db');
const authRoutes = require('./routes/auth');

const app = express();
const port = 4000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  connectToDatabase(); 
});
