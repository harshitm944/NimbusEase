#!/bin/bash
export PATH=$PWD/infrastructure/fabric/bin:$PWD/infrastructure/fabric/samples/bin:$PATH
export FABRIC_CFG_PATH=$PWD/infrastructure/fabric/config

cd infrastructure/fabric/samples/test-network

./network.sh down
./network.sh up createChannel -c mychannel -ca -s couchdb -i 2.5.4

# Deploy chaincode using CCAAS method
./network.sh deployCCAAS -ccn secure-file-registry -ccp ../../../../blockchain/fabric-chaincode -ccl typescript
