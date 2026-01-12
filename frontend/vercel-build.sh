#!/bin/bash
echo "Installing frontend dependencies with legacy peer deps..."
npm ci --legacy-peer-deps
echo "Building frontend..."
npm run build