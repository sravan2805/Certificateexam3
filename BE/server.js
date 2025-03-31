import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'; // Import CORS middleware
import connectToMongoDB from './src/config/dbConnection.js';
import userRoutes from './src/Routes/userRoutes.js';
import projectRoutes from './src/Routes/projectRoutes.js';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Define CORS options
const corsOptions = {
  origin: 'http://localhost:5173', // Only allow requests from this origin
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
  credentials: true // Allow cookies to be sent with the request
};

// Apply CORS middleware with options
app.use(cors(corsOptions));

// Middleware to parse JSON requests
app.use(express.json());

// API routes
app.use('/api', userRoutes);
app.use('/api', projectRoutes);

// Start the server and connect to MongoDB
app.listen(PORT, async () => {
  try {
    await connectToMongoDB(); // Ensure MongoDB is connected before starting the server
    console.log(`✅ Server running on port ${PORT}`);
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error.message);
  }
});

export default app;
