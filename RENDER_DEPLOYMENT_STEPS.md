# Render Deployment Fix

## 🚨 Current Issue
Render is building from repository root, but React app is in `client/` folder.

## ✅ Solution Options

### Option 1: Update Render Service Settings
1. Go to your Render dashboard
2. Select your service
3. Go to Settings
4. Update:
   - **Root Directory**: `client`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `build`
5. Save and redeploy

### Option 2: Use render.yaml (Already created)
The `render.yaml` file in your repo root will:
- Build from client folder
- Install dependencies in client folder
- Publish from client/build

### Option 3: Separate Repository (Recommended)
1. Create new repo: `travel-planner-frontend`
2. Copy only client/ folder contents to new repo root
3. Deploy new repo to Render

## Environment Variables for Render
Set in Render dashboard:
```
REACT_APP_API_BASE_URL=https://your-backend-url.com
REACT_APP_ENV=production
```

## Next Steps
1. Choose one of the above options
2. Update backend URL in environment variables
3. Redeploy