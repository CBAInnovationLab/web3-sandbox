## Web3 Sandbox

This is a sandbox app that can be used to throw load at an instance of ethereum/ethermint/quorum.
It assumes that you already have Node.JS >= `6.*.*` and [yarn](https://yarnpkg.com/) installed.

It also assumes a minimum gas price of `0x0`

### Running
1. `yarn install` to install node_modules
1. Ensure you have a node running and listening at `http://localhost:8545` (or see Configuration)
1. Send lots of Ether to `0xbfdacdfe79ccf1e61649220df47701df16606405` (or see Configuration
1. `yarn start` to run 1,000 x "send ether" transactions (~14 seconds on my machine)
1. `yarn contracts:deploy` to deploy 1,000 x instances of a smart contract (~4.2 mins on my machine)

### Configuration
* Edit `src/config.js` to change the desired number of iterations or geth node
* Edit `src/keys.js` if you would like to use different Ethereum keys
* Or prefix `yarn` commands with the following to point to a different node: `GETH_URL=http://some-node:8545`
