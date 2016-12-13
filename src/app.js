import config from './config'
import web3 from './web3client'
import { coinbase, another, keys, generateKey } from './keys'
import { signTransaction } from './rawTransaction'
import keythereum from 'keythereum'

console.log(`Geth URL: ${config.gethUrl}`)
console.log(`Block #: ${web3.eth.blockNumber}`)

const iterations = 100

/* Use hooked-web3-provider */
for(var i = 1; i <= iterations; i++) {
  web3.eth.sendTransaction({
      from: coinbase.address,
      to: another.address,
      value: 1,
    }, function(err, hash) {
      if(err) {
        console.error(err)
      } else {
        console.log(hash)
      }
  })
}

/* Use raw transactions */
// for(var i = 1; i <= iterations; i++) {
//   var rawTx = {
//     nonce: i,
//     gasPrice: "0x0",
//     gasLimit: "0x3d0901",
//     to: another.address,
//     value: 1,
//     data: ''
//   }
//   var signedTx = signTransaction(rawTx, coinbase.address)
//   web3.eth.sendRawTransaction(signedTx, function(err, hash) {
//       if(err) {
//         console.error(err)
//       } else {
//         console.log(hash)
//       }
//   })
// }
