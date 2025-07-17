#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "Starting Albert installation..."

echo "Installing system dependencies..."
# Install Node.js and npm
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

# Install MongoDB
if ! command -v mongod &> /dev/null; then
    echo "Installing MongoDB..."
    sudo apt-get install -y mongodb
fi

# Install Redis
if ! command -v redis-cli &> /dev/null; then
    echo "Installing Redis..."
    sudo apt-get install -y redis-server
fi

echo "Installing project dependencies..."
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install

echo "Setting up environment variables..."
# Create .env file if it doesn't exist
cp .env.example .env

# Configure MongoDB
sudo systemctl start mongodb
sudo systemctl enable mongodb

# Configure Redis
sudo systemctl start redis
sudo systemctl enable redis

echo "Building the application..."
# Build backend
npm run build

# Build frontend
cd frontend
npm run build

echo "Starting the application..."
# Start MongoDB
sudo systemctl start mongodb

# Start Redis
sudo systemctl start redis

# Start the application
npm start &

# Start the frontend
cd frontend
npm start

echo "Installation complete!"
echo "The application is now running at http://localhost:3000"
echo "The frontend is running at http://localhost:5173"

echo "Note: Make sure to configure your Slack app credentials in the .env file before using the application."
