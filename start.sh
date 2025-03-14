#!/bin/bash
npm install
cp -r /usr/src/build/node_modules/mu ./node_modules/mu
rm -rf ./node_modules/mu/server.js
cp fake-server.js ./node_modules/mu/server.js
cp -r /build/test-helpers/dist ./node_modules/contract-tests
npm run "$@"