## Web3 Sandbox

This is a sandbox app that can be used to throw load at an instance of ethereum/ethermint.
It assumes that you already have Node.JS >= `6.*.*` and [yarn](https://yarnpkg.com/) installed.

It also assumes a minimum gas price of `0x0`

### Running
1. `yarn install` to install node_modules
  1. `yarn start` to run 1000 x "send ether" transactions (~4.5 seconds on my machine)
  1. `yarn contracts:deploy` to deploy 10 x instances of a smart contract (~10 seconds on my machine)

### Configuration
* Edit `src/config.js` to change the desired number of iterations or geth node
* Or prefix `yarn` commands with the following to point to a different node: `GETH_URL=http://some-node:8545`
