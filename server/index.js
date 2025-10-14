const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Load travel data
const travelData = require('./data/travelLocations.json');

// In-memory storage for trips and shared itineraries
let trips = {};
let sharedItineraries = {};

// Routes

// Get all states
app.get('/api/states', (req, res) => {
  try {
    const states = Object.keys(travelData);
    res.json(states);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch states' });
  }
});

// Get locations for a specific state
app.get('/api/locations/:state', (req, res) => {
  try {
    const { state } = req.params;
    const locations = travelData[state] || [];
    res.json(locations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch locations' });
  }
});

// Create a new trip
app.post('/api/trips', (req, res) => {
  try {
    const { destination, startDate, endDate, selectedActivities } = req.body;
    
    if (!destination || !startDate || !endDate || !selectedActivities) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const tripId = uuidv4();
    const trip = {
      id: tripId,
      destination,
      startDate,
      endDate,
      selectedActivities,
      createdAt: new Date().toISOString()
    };

    trips[tripId] = trip;
    res.json({ tripId, trip });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

// Generate itinerary for a trip
app.post('/api/trips/:tripId/generate-itinerary', (req, res) => {
  try {
    const { tripId } = req.params;
    const { selectedActivities } = req.body;
    const trip = trips[tripId];

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    // Update trip with selected activities
    trip.selectedActivities = selectedActivities || trip.selectedActivities || [];

    const itinerary = generateItinerary(trip);
    trips[tripId].itinerary = itinerary;

    res.json({ itinerary });
  } catch (error) {
    console.error('Error generating itinerary:', error);
    res.status(500).json({ error: 'Failed to generate itinerary' });
  }
});

// Update itinerary
app.put('/api/trips/:tripId/itinerary', (req, res) => {
  try {
    const { tripId } = req.params;
    const { itinerary } = req.body;

    if (!trips[tripId]) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    trips[tripId].itinerary = itinerary;
    res.json({ success: true, itinerary });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update itinerary' });
  }
});

// Create shareable link
app.post('/api/trips/:tripId/share', (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = trips[tripId];

    if (!trip || !trip.itinerary) {
      return res.status(404).json({ error: 'Trip or itinerary not found' });
    }

    const shareId = uuidv4();
    sharedItineraries[shareId] = {
      id: shareId,
      tripId,
      destination: trip.destination,
      startDate: trip.startDate,
      endDate: trip.endDate,
      itinerary: trip.itinerary,
      sharedAt: new Date().toISOString()
    };

    res.json({ shareId, shareUrl: `/share/${shareId}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create share link' });
  }
});

// Get shared itinerary
app.get('/api/shared/:shareId', (req, res) => {
  try {
    const { shareId } = req.params;
    const sharedItinerary = sharedItineraries[shareId];

    if (!sharedItinerary) {
      return res.status(404).json({ error: 'Shared itinerary not found' });
    }

    res.json(sharedItinerary);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch shared itinerary' });
  }
});

// Get trip details
app.get('/api/trips/:tripId', (req, res) => {
  try {
    const { tripId } = req.params;
    const trip = trips[tripId];

    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trip' });
  }
});

// Itinerary generation algorithm
function generateItinerary(trip) {
  const { startDate, endDate, selectedActivities } = trip;
  
  if (!selectedActivities || selectedActivities.length === 0) {
    console.log('No selected activities found');
    return [];
  }

  console.log('Generating itinerary for', selectedActivities.length, 'activities');
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

  // Sort activities by category and duration for better distribution
  const sortedActivities = [...selectedActivities].sort((a, b) => {
    // Prioritize shorter activities first, then by category
    if (a.duration !== b.duration) {
      return a.duration - b.duration;
    }
    return a.category.localeCompare(b.category);
  });

  const itinerary = [];
  
  for (let i = 0; i < totalDays; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    
    itinerary.push({
      day: i + 1,
      date: currentDate.toISOString().split('T')[0],
      activities: []
    });
  }

  // Distribute activities across days
  let currentDay = 0;
  let dailyTime = 0;
  const maxDailyTime = 8; // 8 hours per day

  sortedActivities.forEach((activity, index) => {
    console.log(`Processing activity ${index + 1}: ${activity.name} (${activity.duration}h)`);
    
    // If current day is full, move to next day
    if (dailyTime + activity.duration > maxDailyTime && currentDay < totalDays - 1) {
      currentDay++;
      dailyTime = 0;
    }

    // Calculate start and end times
    const startHour = Math.floor(9 + dailyTime);
    const startMinute = (dailyTime % 1) * 60;
    const endTime = dailyTime + activity.duration;
    const endHour = Math.floor(9 + endTime);
    const endMinute = (endTime % 1) * 60;

    itinerary[currentDay].activities.push({
      ...activity,
      startTime: `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`,
      endTime: `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`
    });

    dailyTime += activity.duration;
    
    // If we exceed max daily time, reset for next day
    if (dailyTime >= maxDailyTime && currentDay < totalDays - 1) {
      currentDay++;
      dailyTime = 0;
    }
  });

  console.log('Generated itinerary:', itinerary);
  return itinerary;
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});