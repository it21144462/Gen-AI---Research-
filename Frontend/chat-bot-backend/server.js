const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();
const port = 3001;

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log('Request Body:', req.body);
  next();
});

// Start writing endpoint
app.post('/api/start_writing', async (req, res) => {
  try {
    console.log('Received start writing request');
    const response = await axios.get('http://127.0.0.1:5000/api/start_writing', {
      timeout: 5000
    });

    if (!response.data || !response.data.topic) {
      return res.status(500).json({ error: 'Invalid response from writing API' });
    }

    res.json({ topic: response.data.topic });
  } catch (error) {
    console.error('Error in start_writing endpoint:', error);
    res.status(500).json({
      error: 'Error processing request',
      details: error.message
    });
  }
});

// Get feedback endpoint
app.post('/api/get_feedback_on_writing', async (req, res) => {
  const { paragraph } = req.body;
  console.log('Received writing feedback request:', { paragraph });

  if (!paragraph || typeof paragraph !== 'string') {
    return res.status(400).json({ 
      error: 'Invalid input. Paragraph is required and must be a string.' 
    });
  }

  try {
    const response = await axios.post('http://127.0.0.1:5000/api/get_feedback_on_writing', {
      paragraph
    }, {
      timeout: 5000
    });

    if (!response.data || !response.data.feedback) {
      return res.status(500).json({ error: 'Invalid response from feedback API' });
    }

    res.json({ feedback: response.data.feedback });
  } catch (error) {
    console.error('Error in get_feedback_on_writing endpoint:', error);
    res.status(500).json({
      error: 'Error processing request',
      details: error.message
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:3001`);
});