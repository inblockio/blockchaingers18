#!/bin/sh

if ! echo "$(node --version)" | grep -q "v8.9.0"; then
    printf "\nERROR: You current version of nodejs is $(node --version) - Please install v8.9.0!\n\n";
    exit 1;
fi

npm install -g composer-cli@0.19.0
if [ ! $? -eq 0 ]; then exit 1; fi

npm install -g composer-rest-server@0.19.0
if [ ! $? -eq 0 ]; then exit 1; fi

npm install -g generator-hyperledger-composer@0.19.0
if [ ! $? -eq 0 ]; then exit 1; fi

npm install -g composer-playground@0.19.0
if [ ! $? -eq 0 ]; then exit 1; fi


filename="fabric-dev-servers.tar.gz"
mkdir ./fabric-tools && cd ./fabric-tools
curl -O https://raw.githubusercontent.com/hyperledger/composer-tools/master/packages/fabric-dev-servers/${filename}
tar -xvf ${filename}
rm ${filename}

./downloadFabric.sh
if [ ! $? -eq 0 ]; then exit 1; fi

cd ./frontend/server && npm install
cd -