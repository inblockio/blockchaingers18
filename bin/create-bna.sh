#!/bin/sh

cd contracts
composer archive create -t dir -n ./
mv *.bna ../bna/
cd -