# Frontend Deployment Guide

## 🚀 Recommended Deployment Method

### Option 1: Separate Repository (Easiest)

1. **Create a new GitHub repository** for frontend only:
   ```bash
   # Create new repo: travel-planner-frontend
   ```

2. **Copy client folder contents** to new repo:
   ```bash
   # Copy everything from client/ folder to new repo root
   cp -r client/* new-repo/
   ```

3. **Deploy to Vercel:**
   - Connect new repo to Vercel
   - Vercel will auto-detect React app
   - Set environment variables:
     - `REACT_APP_API_BASE_URL`: Your backend URL
     - `REACT_APP_ENV`: production

### Option 2: Vercel Root Directory Configuration

If deploying from current repo:

1. **In Vercel Dashboard:**
   - Go to Project Settings
   - Set **Root Directory**: `client`
   - Set **Build Command**: `npm run build`
   - Set **Output Directory**: `build`

2. **Environment Variables:**
   ```
   REACT_APP_API_BASE_URL=https://your-backend-url.com
   REACT_APP_ENV=production
   ```

## 🔧 Required Environment Variables

- **REACT_APP_API_BASE_URL**: Your deployed backend URL
- **REACT_APP_ENV**: Set to "production"

## 📁 Files Needed for Deployment

✅ `package.json` - Dependencies and scripts
✅ `public/index.html` - Main HTML file
✅ `public/manifest.json` - App manifest
✅ `public/favicon.ico` - App icon
✅ `src/` - All React components
✅ `vercel.json` - Deployment configuration

## 🚨 Common Issues & Solutions

### "Could not find index.html"
- **Cause**: Vercel building from wrong directory
- **Solution**: Set Root Directory to `client` in Vercel settings

### "Module not found" errors
- **Cause**: Missing dependencies
- **Solution**: Ensure all dependencies are in client/package.json

### API calls failing
- **Cause**: Wrong REACT_APP_API_BASE_URL
- **Solution**: Update to your deployed backend URL

## 🎯 Deployment Checklist

- [ ] Backend deployed and URL obtained
- [ ] REACT_APP_API_BASE_URL updated
- [ ] All required files present
- [ ] Build tested locally (`npm run build`)
- [ ] Environment variables configured
- [ ] Deployment method chosen (separate repo recommended)