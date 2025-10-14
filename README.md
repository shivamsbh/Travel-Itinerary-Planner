# Travel Itinerary Planner

A modern web application that helps travelers organize multi-day trips with intelligent scheduling. Built with React and Express.js, this application solves the common problem of manually organizing activities into sensible daily plans.

## 🌟 Features

### Core Functionality
- **Trip Creation**: Set destination, travel dates, and preferences
- **Activity Browser**: Explore activities across 29 Indian states with detailed information
- **Smart Scheduling**: AI-powered algorithm distributes activities optimally across trip days
- **Manual Customization**: Drag-and-drop interface to modify generated schedules
- **Share Functionality**: Generate read-only links for travel companions

### Key Highlights
- ✅ **3-day trip planning** - Perfect for weekend getaways
- ✅ **Activity import** - Browse from curated database of 300+ locations
- ✅ **Schedule generation** - Intelligent distribution considering time and geography
- ✅ **Easy editing** - Move activities between days with simple controls
- ✅ **Shareable links** - No-login sharing with travel companions

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd travel-itinerary-planner
   ```

2. **Install dependencies for both frontend and backend**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - React frontend on `http://localhost:3000`

4. **Open your browser**
   ```
   Navigate to http://localhost:3000
   ```

## 🏗️ Project Structure

```
travel-itinerary-planner/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Header.js
│   │   │   ├── TripPlanner.js
│   │   │   ├── TripForm.js
│   │   │   ├── ActivitySelector.js
│   │   │   ├── ItineraryGenerator.js
│   │   │   ├── ItineraryEditor.js
│   │   │   └── SharedItinerary.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
├── server/                 # Express.js backend
│   ├── data/
│   │   └── travelLocations.json  # Activity database
│   ├── index.js           # Main server file
│   └── package.json
├── package.json           # Root package.json
└── README.md
```

## 🎯 How to Use

### 1. Create Your Trip
- Select your destination state from the dropdown
- Choose specific location within the state
- Set your travel start and end dates
- Add optional notes about preferences

### 2. Select Activities
- Browse through available activities for your destination
- Filter by category (monument, nature, spiritual, beach, etc.)
- Select activities using checkboxes
- View activity details including duration and best visiting time

### 3. Generate Schedule
- Review your trip summary and selected activities
- Click "Generate Smart Schedule" for AI-powered itinerary
- Algorithm considers:
  - Activity duration and optimal timing
  - Geographical proximity
  - Daily time limits (8 hours per day)

### 4. Customize Your Itinerary
- Move activities between days using arrow buttons
- Remove unwanted activities with the ✕ button
- Times automatically recalculate when changes are made
- Save your modifications

### 5. Share with Friends
- Create a shareable link for your finalized itinerary
- Share read-only access with travel companions
- No login required for viewers
- Print-friendly format available

## 🗺️ Available Destinations

The application includes curated activities across **5 major Indian states**:

- **Maharashtra** (15 locations) - Mumbai, Pune, Aurangabad
- **Rajasthan** (15 locations) - Jaipur, Udaipur, Jodhpur
- **Kerala** (15 locations) - Munnar, Alleppey, Kochi
- **Goa** (15 locations) - Beaches, Portuguese heritage
- **Tamil Nadu** (15 locations) - Chennai, Ooty, temples

Each location includes:
- **Category classification** (monument, nature, spiritual, beach, wildlife, etc.)
- **Duration estimates** (1-8 hours)
- **Best visiting times** (morning, evening, full day)
- **Detailed descriptions**

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **React Router** - Client-side routing
- **CSS3** - Responsive styling with grid and flexbox
- **Modern ES6+** - Clean, maintainable JavaScript

### Backend
- **Express.js** - Lightweight web framework
- **Node.js** - Server runtime
- **JSON Storage** - Simple file-based data management
- **CORS** - Cross-origin resource sharing
- **UUID** - Unique identifier generation

### Key Libraries
- `react-router-dom` - Routing for React
- `cors` - Cross-origin requests
- `uuid` - Unique ID generation
- `nodemon` - Development server auto-restart
- `concurrently` - Run multiple scripts

## 🔧 API Endpoints

### Trip Management
- `GET /api/states` - Fetch available states
- `GET /api/locations/:state` - Get activities for a state
- `POST /api/trips` - Create new trip
- `GET /api/trips/:tripId` - Get trip details
- `PUT /api/trips/:tripId/itinerary` - Update itinerary

### Itinerary Operations
- `POST /api/trips/:tripId/generate-itinerary` - Generate smart schedule
- `POST /api/trips/:tripId/share` - Create shareable link
- `GET /api/shared/:shareId` - Access shared itinerary

## 🎨 Design Philosophy

### User Experience
- **Progressive workflow** - Step-by-step guided process
- **Visual feedback** - Clear progress indicators and status messages
- **Mobile responsive** - Works seamlessly on all devices
- **Intuitive controls** - Drag-and-drop and button-based editing

### Performance
- **Fast loading** - Optimized component structure
- **Efficient rendering** - React best practices
- **Minimal API calls** - Smart data fetching and caching
- **Lightweight** - No heavy external dependencies

## 🧪 Testing the Application

### Manual Testing Checklist
1. ✅ Create a 3-day trip to any destination
2. ✅ Browse and select multiple activities
3. ✅ Generate intelligent schedule
4. ✅ Edit at least one day (move/remove activities)
5. ✅ Create and open shareable link
6. ✅ Verify read-only access for shared links

### Sample Test Scenarios
- **Weekend Trip**: 3-day Goa beach vacation
- **Cultural Tour**: Rajasthan heritage sites
- **Nature Escape**: Kerala backwaters and hill stations
- **Mixed Activities**: Maharashtra monuments and nature

## 🚀 Development Scripts

```bash
# Install all dependencies
npm run install-all

# Start both frontend and backend in development mode
npm run dev

# Start only backend server
npm run server

# Start only frontend client
npm run client

# Build production version
npm run build
```

## 🔮 Future Enhancements

### Phase 2 Features
- **User Authentication** - Save and manage multiple trips
- **Enhanced Algorithm** - Weather, traffic, and crowd considerations
- **Social Features** - Trip reviews and recommendations
- **Mobile App** - Native iOS and Android applications
- **Advanced Filters** - Budget, accessibility, family-friendly options

### Technical Improvements
- **Database Migration** - Move from JSON to PostgreSQL/MongoDB
- **Caching Layer** - Redis for improved performance
- **Real-time Updates** - WebSocket for collaborative planning
- **API Integration** - Google Maps, weather, and booking services

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Travel Data**: Curated from various tourism boards and travel guides
- **UI Inspiration**: Modern travel and booking platforms
- **Algorithm Design**: Inspired by route optimization and scheduling problems

---

**Built with ❤️ for travelers who want to spend more time exploring and less time planning!**