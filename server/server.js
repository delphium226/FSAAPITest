const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3001;

const FSA_BASE_URL = 'https://data.food.gov.uk/food-alerts';

// Enable CORS for all origins (development)
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Proxy endpoint for food alerts
app.get('/api/alerts', async (req, res) => {
  try {
    // Build query string from request params
    const params = new URLSearchParams();

    // Forward all query parameters
    Object.entries(req.query).forEach(([key, value]) => {
      if (value) {
        params.append(key, value);
      }
    });

    const url = `${FSA_BASE_URL}/id?${params.toString()}`;
    console.log(`Proxying to: ${url}`);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`FSA API responded with status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ error: 'Failed to fetch alerts', message: error.message });
  }
});

// Proxy endpoint for reference data (hazards, allergens, etc.)
app.get('/api/ref/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const url = `${FSA_BASE_URL}/def/${type}`;
    console.log(`Proxying reference data: ${url}`);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`FSA API responded with status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching reference data:', error);
    res.status(500).json({ error: 'Failed to fetch reference data', message: error.message });
  }
});

// Proxy endpoint for alert types
app.get('/api/ref/alert-type', async (req, res) => {
  try {
    const url = `${FSA_BASE_URL}/def/alert-type`;
    console.log(`Proxying alert types: ${url}`);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`FSA API responded with status: ${response.status}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error fetching alert types:', error);
    res.status(500).json({ error: 'Failed to fetch alert types', message: error.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`FSA API Proxy server running on http://localhost:${PORT}`);
});
