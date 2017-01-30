## Web3 Sandbox

This is a sandbox app that can be used to throw load at an instance of ethermint.
It assumes that you already have Node.JS, [yarn](https://yarnpkg.com/), [Ethermint](https://github.com/tendermint/ethermint/blob/master/docker/Dockerfile#L6) and `solc` installed.

### Running
1. `yarn install` to install node_modules
1. `npm run ethermint:init` to initialise a fresh chain
1. `npm run ethermint:start` to start ethermint, then either:
  1. `npm start` to run 1000 x "send ether" transactions (~4.5 seconds on my machine)
  1. `npm run contracts:deploy` to deploy 10 x instances of a smart contract (~10 seconds on my machine)

### Configuration
* Edit `src/config.js` to change the desired number of iterations
* Prefix `npm` commands with the following to point to a different node: `GETH_URL=http://some-node:8545`
