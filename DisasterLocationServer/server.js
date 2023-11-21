const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

const dataFilePath = path.join(__dirname, 'locations.json');

// Load existing locations
let locations = [];
if (fs.existsSync(dataFilePath)) {
  const data = fs.readFileSync(dataFilePath, 'utf-8');
  locations = JSON.parse(data);
}

// Endpoint to receive location data
app.post('/api/send-location', (req, res) => {
  const { latitude, longitude, message } = req.body;

  if (!latitude || !longitude || !message) {
    return res.status(400).json({ error: 'Invalid location data' });
  }

  const newLocation = { latitude, longitude, message };
  locations.push(newLocation);

  // Save locations to the JSON file
  fs.writeFileSync(dataFilePath, JSON.stringify(locations), 'utf-8');

  console.log('Received location:', newLocation);

  res.status(200).json({ message: 'Location received successfully' });
});

// Endpoint to retrieve all stored locations
app.get('/api/get-locations', (req, res) => {
  res.status(200).json({ locations });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://192.168.254.113:${PORT}`);
});
