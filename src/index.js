const express = require('express');
const dotenv = require('dotenv');
require('dotenv').config();
dotenv.config(); // loads .env variables

const app = express();
app.use(express.json()); // allows us to read JSON request bodies

// Import user routes
const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// Health check route
app.get('/', (req, res) => {
  res.json({ message: 'Week 2 API is running!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});