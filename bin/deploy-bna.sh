#!/bin/sh

if [ $# -eq 0 ]; then
    echo "\nERROR: Missing version number as first argument (format x.x.x)\n\n";
    exit 1
fi

composer network install -a bna/blockchaingers18@${1}-deploy.24.bna -c PeerAdmin@hlfv1
if [ ! $? -eq 0 ]; then exit 1; fi

composer network upgrade -n blockchaingers18 -V ${1} -c PeerAdmin@hlfv1