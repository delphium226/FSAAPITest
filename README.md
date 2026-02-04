# FSA Food Alerts Test Harness

A user-friendly frontend to query the Food Standards Scotland (FSA) Primary Alerts API, featuring cascading filters and a premium UI design.

Project connected to [https://github.com/delphium226/FSAAPITest](https://github.com/delphium226/FSAAPITest).

## Features

- **Cascading Filters**: Country, Alert Type, Hazard Category, and dynamic Allergen filter
- **Scotland-Focused**: Defaults to showing Scottish food alerts
- **Premium UI**: Modern card-based design with responsive layout
- **Pagination**: Load more functionality for browsing large result sets
- **CORS Proxy**: Express server proxies requests to avoid browser CORS issues

## Project Structure

```
FSAAPITest/
├── server/                 # Express.js proxy server
│   ├── package.json
│   └── server.js
└── client/                 # Vite + React frontend
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── index.css
        ├── App.jsx
        └── components/
            ├── SearchForm.jsx
            └── ResultsDisplay.jsx
```

## Prerequisites

- Node.js (v18 or higher recommended)
- npm

## Installation

```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

## Running the Application

You need to run both the server and client:

**Terminal 1 - Start the proxy server:**
```bash
cd server
npm start
```
Server runs on http://localhost:3001

**Terminal 2 - Start the React dev server:**
```bash
cd client
npm run dev
```
Client runs on http://localhost:5173

## API Endpoints (Proxy)

| Endpoint | Proxies To | Description |
|----------|------------|-------------|
| `/api/alerts` | `data.food.gov.uk/food-alerts/id` | Food alerts with filters |
| `/api/ref/:type` | `data.food.gov.uk/food-alerts/def/:type` | Reference data (allergens, hazards) |
| `/api/health` | - | Health check |

## Filter Options

- **Country**: Scotland (default), England, Wales, Northern Ireland, or All
- **Alert Type**: Allergy Alert, Product Recall (PRIN), Food Alert for Action (FAFA)
- **Hazard Category**: Microbiological, Chemical, Foreign Body, Allergens, Labelling
- **Allergen**: Dynamic dropdown (appears when Allergy Alert is selected)

## Technologies

- **Frontend**: React 18, Vite
- **Backend**: Express.js, node-fetch
- **Styling**: Custom CSS (no frameworks)
- **API**: Food Standards Agency Open Data API
