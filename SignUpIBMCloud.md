# IBM Hyperledger Cloud 

All information as provided by Edward Ciggaar during the Blockchaingers18 Hackathon:
IBM provides a 'startup tier' for 6mths free usage of hyperledger on the IBM Cloud (after applying a code). 

**If you use the correct setup, you can develop locally and deploy to your cloud instance using git.**

# Cloud Setup

## Registration for the cloud service

Link to IBM Cloud https://ibm.biz/BdZSke. Please register first & then I'll help you applying the promo code

## Applying the code for 6mths free usage of startup tier

* apply promo code under Manage / Billing and Usage / Billing

## Switch context to US-South

* At the moment, the startup tier only exists in US South 

## Create your Hyperledger Network

* Creating the network pre-selects the enterprise tier - make sure to switch to the free tier. If you messed up - no harm done since you did not provide any payment info yet...

# Local dev environment

Again, Edgar write: Just for your information....I use on hyperledger fabric 1.1-rc1 on my laptop to be compatible with blockchain service on ibm cloud 
to properly download correct version of fabric and start correct version I changed two files in the fabric-tools

basically added '-rc1' to the hlfv11 docker images that are used here:
* fabric-tools/fabric-scripts/hlfv11/composer/docker-compose.yml
* fabric-tools/fabric-scripts/hlfv11/downloadFabric.sh


