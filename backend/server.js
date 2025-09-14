const express = require('express');
const connectDB = require('./db');
const cors = require('cors');

require('dotenv').config(); 

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(cors());
// --> THIS LINE IS VERY IMPORTANT <--
app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/auth', require('./routes/auth'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));