#!/bin/bash

# Full Setup Script for Hyperledger Fabric and Backend Connection
echo "🚀 Starting Full Fabric Setup..."

# 1. Run the base Fabric setup



chmod +x scripts/setup-fabric.sh
./scripts/setup-fabric.sh | tee setup-fabric-output.log

# 2. Copy the Connection Profile to the root (where backend expects it)
echo "📂 Copying connection profile..."
CP_PATH="infrastructure/fabric/samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json"

if [ -f "$CP_PATH" ]; then
    cp "$CP_PATH" ./connection-org1.json
    echo "✅ Connection profile copied to root."
else
    echo "❌ Error: Connection profile not found. Did the network start correctly?"
    exit 1
fi

# 3. Setup Backend Environment
echo "⚙️ Configuring backend environment..."
cd backend

# Create .env if it doesn't exist
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "✅ Created .env from .env.example"
fi

# 4. Force Install backend dependencies
echo "📦 Installing backend dependencies (with legacy-peer-deps)..."
# We remove node_modules if it's causing permission issues
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# 5. Enroll Admin/User
echo "👤 Enrolling identities..."
# Ensure wallet directory exists and is writable
mkdir -p wallet
npx ts-node src/scripts/enroll-admin.ts

echo "✨ Setup Complete!"
echo "If you saw 'Broken Pipe' during chaincode deployment, please RESTART Docker Desktop and run this script again."
echo "To start the backend, run: cd backend && npm run start:dev"
