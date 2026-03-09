#!/bin/bash

# NimbusEase Hyperledger Fabric Setup Script
echo "🚀 Starting Hyperledger Fabric Setup for NimbusEase..."

# 1. Download Fabric binaries if they don't exist
if [ ! -d "infrastructure/fabric/samples" ]; then
  echo "Downloading Hyperledger Fabric samples (version 2.5.4)..."
  # Note: Downloaded to current dir, then we need to move it
  curl -sSL https://bit.ly/2ysbOFE | bash -s -- 2.5.4 1.5.7 -s
  mkdir -p infrastructure/fabric
  mv fabric-samples infrastructure/fabric/samples
  mv bin infrastructure/fabric/
  mv config infrastructure/fabric/
else
  echo "Fabric infrastructure already exists. Skipping download."
fi


# 2. Add binaries to path
export PATH=${PWD}/infrastructure/fabric/bin:${PWD}/infrastructure/fabric/samples/bin:$PATH
export FABRIC_CFG_PATH=${PWD}/infrastructure/fabric/config/

# 3. Navigate to test-network
cd infrastructure/fabric/samples/test-network

# 4. Bring down any existing network
./network.sh down

# 5. Bring up network with CA and CouchDB
# We use -i to ensure the correct docker image version is used
./network.sh up createChannel -c mychannel -ca -s couchdb -i 2.5.4

# 6. Deploy NimbusEase Chaincode
echo "📦 Deploying Chaincode as a Service..."
# We use absolute path to avoid resolution issues
CC_PATH="../../../../../blockchain/fabric-chaincode"
./network.sh deployCCAAS -ccn secure-file-registry -ccp ${CC_PATH}

echo "✅ Hyperledger Fabric is running and Chaincode is deployed!"
echo "🔗 Channel: mychannel"
echo "📜 Chaincode: secure-file-registry"
