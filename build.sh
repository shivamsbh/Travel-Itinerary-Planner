#!/bin/bash
set -e

echo "Starting build process..."
echo "Current directory: $(pwd)"
echo "Listing root directory:"
ls -la

echo "Checking client directory:"
ls -la client/

echo "Checking client/public directory:"
ls -la client/public/

echo "Installing client dependencies..."
cd client
npm install

echo "Building React app..."
npm run build

echo "Build completed. Checking output:"
ls -la build/

echo "Build process finished successfully!"