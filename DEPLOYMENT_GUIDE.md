# 🚀 Backend-Frontend Connection & Production Deployment Guide

## 📋 **How Backend & Frontend Are Connected**

### **Current Architecture**

```
┌─────────────────┐       ┌─────────────────┐
│   React App     │       │   Express API   │
│   Port: 3000    │────── │   Port: 5000    │
│   Frontend      │       │   Backend       │
└─────────────────┘       └─────────────────┘
```

### **Development Connection**
- **Frontend**: `http://localhost:3000`
- **Backend**: `http://localhost:5000`
- **API Calls**: All `/api/*` requests go to backend
- **Configuration**: Environment variables in `.env` files

### **API Endpoints Used**
```javascript
GET    /api/states                          // Get all states
GET    /api/locations/:state               // Get locations for state
POST   /api/trips                         // Create new trip
GET    /api/trips/:tripId                 // Get trip details
POST   /api/trips/:tripId/generate-itinerary  // Generate schedule
PUT    /api/trips/:tripId/itinerary       // Update itinerary
POST   /api/trips/:tripId/share          // Create share link
GET    /api/shared/:shareId              // Get shared itinerary
```

## 🛠️ **Environment Variables Setup**

### **1. Development (.env)**
```env
REACT_APP_API_BASE_URL=http://localhost:5000
REACT_APP_ENV=development
```

### **2. Production (.env.production)**
```env
REACT_APP_API_BASE_URL=https://your-backend-domain.com
REACT_APP_ENV=production
```

### **3. Backend Environment Variables**
Create `server/.env`:
```env
# Server Configuration
PORT=5000
NODE_ENV=production

# CORS Origins (for production)
CORS_ORIGIN=https://your-frontend-domain.com

# Database (if you add one later)
# DATABASE_URL=your-database-url

# Security
# JWT_SECRET=your-jwt-secret
```

## 🌐 **Production Deployment Options**

### **Option 1: Separate Deployment (Recommended)**

#### **Frontend Deployment (Netlify/Vercel)**
1. **Build the React app**:
   ```bash
   cd client
   npm run build
   ```

2. **Deploy to Netlify**:
   - Connect GitHub repository
   - Set build command: `cd client && npm run build`
   - Set publish directory: `client/build`
   - Set environment variables:
     ```
     REACT_APP_API_BASE_URL=https://your-backend.herokuapp.com
     REACT_APP_ENV=production
     ```

3. **Deploy to Vercel**:
   ```bash
   cd client
   # Deploy to your chosen platform (e.g., npm run build for static hosting)
   ```

#### **Backend Deployment (Heroku/Railway)**
1. **Deploy to Heroku**:
   ```bash
   # In root directory
   heroku create your-travel-api
   git subtree push --prefix server heroku main
   ```

2. **Deploy to Railway**:
   - Connect GitHub repository
   - Set root directory: `server`
   - Add environment variables

### **Option 2: Single Server Deployment**

Update your backend to serve the React build:

```javascript
// Add to server/index.js
const path = require('path');

// Serve static files from React build
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}
```

## 🔧 **Production Setup Steps**

### **1. Update Backend for Production**
```javascript
// server/index.js
const cors = require('cors');

const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CORS_ORIGIN || 'https://your-frontend-domain.com'
    : 'http://localhost:3000',
  credentials: true,
};

app.use(cors(corsOptions));
```

### **2. Update Frontend API Configuration**
Already done! Your `client/src/config/api.js` handles environment switching.

### **3. Build Scripts for Production**
Add to root `package.json`:
```json
{
  "scripts": {
    "build": "cd client && npm run build",
    "build:server": "cd server && npm install",
    "deploy": "npm run build && npm run build:server",
    "start:prod": "cd server && npm start"
  }
}
```

## 📱 **Popular Deployment Platforms**

### **Frontend Options**
| Platform | Free Tier | Custom Domain | Environment Variables |
|----------|-----------|---------------|---------------------|
| **Netlify** | ✅ Yes | ✅ Yes | ✅ Yes |
| **Vercel** | ✅ Yes | ✅ Yes | ✅ Yes |
| **GitHub Pages** | ✅ Yes | ✅ Yes | ❌ No |

### **Backend Options**
| Platform | Free Tier | Database | Environment Variables |
|----------|-----------|----------|---------------------|
| **Heroku** | ✅ Yes (Limited) | ✅ PostgreSQL | ✅ Yes |
| **Railway** | ✅ Yes | ✅ PostgreSQL | ✅ Yes |
| **Render** | ✅ Yes | ✅ PostgreSQL | ✅ Yes |

## 🚀 **Quick Production Setup**

### **Step 1: Choose Your URLs**
```env
# Frontend: https://travel-planner.netlify.app
# Backend:  https://travel-api.herokuapp.com
```

### **Step 2: Update Environment Variables**
**Frontend (.env.production)**:
```env
REACT_APP_API_BASE_URL=https://travel-api.herokuapp.com
REACT_APP_ENV=production
```

**Backend (.env)**:
```env
PORT=5000
NODE_ENV=production
CORS_ORIGIN=https://travel-planner.netlify.app
```

### **Step 3: Deploy Backend First**
```bash
# Deploy to Heroku
cd server
heroku create travel-api
git init
git add .
git commit -m "Deploy backend"
heroku git:remote -a travel-api
git push heroku main
```

### **Step 4: Deploy Frontend**
```bash
# Deploy to Netlify
cd client
npm run build
# Upload build folder to Netlify or connect GitHub
```

## 🔍 **Testing the Connection**

### **Development Test**
```bash
# Terminal 1 - Start backend
npm run server

# Terminal 2 - Start frontend  
npm run client

# Test: http://localhost:3000
```

### **Production Test**
```bash
# Check API endpoint
curl https://your-backend.herokuapp.com/api/states

# Check frontend
open https://your-frontend.netlify.app
```

## ⚠️ **Common Issues & Solutions**

### **CORS Errors**
```javascript
// server/index.js - Update CORS settings
const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://your-frontend-domain.com'
  ],
  credentials: true,
};
```

### **Environment Variables Not Loading**
- Ensure variables start with `REACT_APP_`
- Restart development server after adding variables
- Check browser Network tab for correct API URLs

### **Build Failures**
```bash
# Clear cache and reinstall
cd client
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📝 **Example Production URLs**

After deployment, your app will work like this:

```
Frontend: https://travel-planner.netlify.app
Backend:  https://travel-api.herokuapp.com

API Calls:
https://travel-api.herokuapp.com/api/states
https://travel-api.herokuapp.com/api/locations/Maharashtra
https://travel-api.herokuapp.com/api/trips
```

Your React app will automatically use the production API URL when deployed! 🎉