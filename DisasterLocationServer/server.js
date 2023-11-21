const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Parse JSON
app.use(bodyParser.json());

// Store received location data
let locations = [];

// Endpoint to receive location data
app.post('/api/send-location', (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res.status(400).json({ error: 'Invalid location data' });
  }

  const newLocation = { latitude, longitude };
  locations.push(newLocation);

  console.log('Received location:', newLocation);

  res.status(200).json({ message: 'Location received successfully' });
});

// Endpoint to retrieve all stored locations
app.get('/api/get-locations', (req, res) => {
  res.status(200).json({ locations });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
