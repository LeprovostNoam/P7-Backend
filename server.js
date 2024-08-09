const express = require('express');
const cors = require('cors'); 

require("dotenv").config({ path: "./config/.env" });

const { connectToDatabase } = require('./config/db');
const authRoutes = require('./routes/auth');
const booksRoutes = require("./routes/books");

const app = express();


app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use("/api/books", booksRoutes);

app.use((error, req, res, next) => {
	console.error("Error", error);
	return res.status(500).json({ error: "Internal Server Error" });
});

let port = process.env.PORT || '4000';
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  connectToDatabase(); 
});
