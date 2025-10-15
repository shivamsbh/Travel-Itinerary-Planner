# Vercel Environment Variables Setup

## Required Environment Variables

Set these in your Vercel dashboard under **Settings > Environment Variables**:

### Production Variables:
- **Variable Name:** `REACT_APP_API_BASE_URL`
- **Value:** Your backend server URL (e.g., `https://your-backend.render.com` or `https://your-backend.herokuapp.com`)
- **Environment:** Production

- **Variable Name:** `REACT_APP_ENV`
- **Value:** `production`
- **Environment:** Production

### Preview/Development Variables (Optional):
- **Variable Name:** `REACT_APP_API_BASE_URL`
- **Value:** Your staging backend URL or `http://localhost:5000`
- **Environment:** Preview

## Steps to Set Up:

1. **In Vercel Dashboard:**
   - Go to your project
   - Click **Settings** tab
   - Click **Environment Variables** in sidebar
   - Add each variable with the values above

2. **Backend Server:**
   - Make sure your backend is deployed (Render, Heroku, etc.)
   - Update `REACT_APP_API_BASE_URL` with the actual backend URL
   - Ensure backend has CORS configured for your Vercel domain

3. **Test:**
   - Deploy your frontend
   - Check browser network tab to verify API calls go to correct URL
   - Test a feature that calls the backend

## Current Configuration:
Your app will use:
- **Development:** `http://localhost:3001` (from api.js fallback)
- **Production:** Value from `REACT_APP_API_BASE_URL` env var