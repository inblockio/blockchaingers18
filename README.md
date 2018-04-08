# blockchaingers18

## Prerequisites

* NodeJS v8.9.0 (LTS)
* npm v5.8.0

## Local System Installation

1. To Install fabric and its cli tools locally on your system run the following script (from the root from the project folder!)::

```
bin/install.sh
bin/start-fabric.sh
bin/create-admin-peer-card.sh
```

2. Then start composer playground:

```
composer-playground
```

3. Create the .bna file from the sourceode by running:

```
TBD
```

4. Deploy it in the web interface by clicking on _Deploy a new business network_. Afterwards set the name to _blockchaingers18_ and the decription as well.

	4.2. Choose _Drop here to upload or browse_ to select the .bna to install.

	4.3. At the bottom select _ID and Secret_ and leave _admin_ as user but set _adminpw_ as password. It will take a while but then your network should be deployed.

5. After the deployment, start a new shell and run the composer-rest-server:

```
composer-rest-server -c admin@blockchaingers18 -n never -w true
````

6. After the command was successful you should be able to visit the api docs and the explorer on:

```
http://localhost:3000/explorer
```