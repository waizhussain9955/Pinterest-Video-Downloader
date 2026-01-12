#!/bin/bash
echo "Making build script executable..."
chmod +x frontend/vercel-build.sh
echo "Installing frontend dependencies..."
cd frontend
npm ci --legacy-peer-deps
echo "Building frontend..."
npm run build