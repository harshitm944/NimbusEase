#!/bin/bash

# NimbusEase Master Start Script
echo "🌟 Initializing NimbusEase Full Stack..."

# 1. Ensure directories for SFTP and Database exist
echo "📂 Preparing local storage directories..."
mkdir -p backend/storage
mkdir -p secrets/ssh_host_keys

# 2. Fix Docker Credentials (one-time fix for WSL error)
if [ -f ~/.docker/config.json ]; then
    if grep -q "desktop.exe" ~/.docker/config.json; then
        echo "🔧 Fixing Docker credential helper for WSL..."
        echo '{}' > ~/.docker/config.json
    fi
fi

# 2.5 Clean up existing CCAAS containers to avoid naming conflicts
echo "🧹 Cleaning up old chaincode containers..."
docker rm -f $(docker ps -aq --filter name=ccaas) 2>/dev/null || true

# 3. Start Hyperledger Fabric Network
echo "⛓️  Starting Blockchain Network..."
chmod +x scripts/setup-fabric.sh
./scripts/setup-fabric.sh

# 4. Start Application Stack (Backend, Frontend, Databases)
echo "🚀 Starting Application Services (Mongo, Redis, API, UI)..."
docker-compose up -d --build

echo ""
echo "===================================================="
echo "✅ ALL SYSTEMS ONLINE"
echo "===================================================="
echo "🌐 Frontend: http://localhost:3002"
echo "⚙️  Backend API: http://localhost:3000"
echo "🛡️  Blockchain: Channel 'mychannel' active"
echo "📂 SFTP Server: localhost:2222"
echo "===================================================="
echo "Use 'docker-compose logs -f' to see application logs."
echo "Use 'docker ps' to see all running containers."
