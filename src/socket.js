/*import WebSocket from 'ws'

const ws = new WebSocket('ws://localhost:8546');

ws.on('open', function open() {
  console.log('connected');
  ws.send('{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":"adsasdasd"}', {mask: true});
});

ws.on('error', function(err) {
  console.log('error');
  console.log(err)
})

ws.on('close', function close() {
  console.log('disconnected');
});

ws.on('message', function message(data, flags) {
  console.log(data)
  ws.send('{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":"abc"}', {mask: true});
});
*/

import HttpProvider from './http-provider'
import WsProvider from './ws-provider'
import Eth from 'ethjs-query'

async function main() {
  //const eth = new Eth(new HttpProvider('https://ropsten.infura.io'));
  const wsProvider = new WsProvider('ws://localhost:8546');
  await wsProvider.connect();

  try {
    const eth = new Eth(wsProvider);
    var promises = [];

    for(var i = 1; i <= 5; i++) {
      promises.push(eth.getBlockByNumber(i, true))
    }

    var results = await Promise.all(promises)
    console.log(results)
  } catch (e) {
    console.error(e)
  }

  //wsProvider.disconnect();
}

main().then(() => {
  console.log("Done")
}).catch(err => {
  console.error(err)
})

setTimeout(function () {
  console.log('Bye!')
}, 2000000)

// eth.getBlockByNumber(45300, true, (err, block) => {
//   console.log(block)
//   console.log(err)
// });
