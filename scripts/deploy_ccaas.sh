#!/bin/bash
export PATH=$PWD/infrastructure/fabric/bin:$PWD/infrastructure/fabric/samples/bin:$PATH
export FABRIC_CFG_PATH=$PWD/infrastructure/fabric/config/
cd infrastructure/fabric/samples/test-network
./network.sh deployCCAAS -ccn secure-file-registry -ccp ../../../../blockchain/fabric-chaincode
