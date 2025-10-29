#!/bin/bash

# Image Gallery Startup Script
# This script helps you get started with the Image Gallery application

echo "🖼️  Image Gallery Setup Script"
echo "================================"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    echo "Visit: https://docs.docker.com/get-docker/"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    echo "Visit: https://docs.docker.com/compose/install/"
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p backend/uploads
mkdir -p ssl

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from example..."
    cp env.prod.example .env
    echo "⚠️  Please edit .env file with your configuration before continuing"
    echo "   - Set POSTGRES_PASSWORD"
    echo "   - Set SECRET_KEY"
    echo "   - Set API_URL"
    read -p "Press Enter when you've updated the .env file..."
fi

# Build and start services
echo "🔨 Building and starting services..."
docker-compose -f docker-compose.prod.yml build

echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check service health
echo "🔍 Checking service health..."
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "🎉 Image Gallery is now running!"
echo ""
echo "📱 Access your application:"
echo "   Frontend: http://localhost (or your domain)"
echo "   Backend API: http://localhost/api"
echo "   Elasticsearch: http://localhost:9200"
echo ""
echo "📊 Monitor logs with:"
echo "   docker-compose -f docker-compose.prod.yml logs -f"
echo ""
echo "🛑 Stop services with:"
echo "   docker-compose -f docker-compose.prod.yml down"
echo ""
echo "🔄 Restart services with:"
echo "   docker-compose -f docker-compose.prod.yml restart"

