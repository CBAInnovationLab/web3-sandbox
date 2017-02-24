import promisify from 'es6-promisify'
import config from './config'
import web3 from './web3client'
import { coinbase, another, keys, generateKey } from './keys'
import { signTransaction } from './rawTransaction'
import keythereum from 'keythereum'
import protobuf from './protobuf'

console.log(`Geth URL: ${config.gethUrl}`)

web3.eth.getBlockNumber = promisify(web3.eth.getBlockNumber)
web3.eth.getTransactionCount = promisify(web3.eth.getTransactionCount)
web3.eth.sendTransaction = promisify(web3.eth.sendTransaction)
web3.eth.sendRawTransaction = promisify(web3.eth.sendRawTransaction)

var start
async function main() {
  const block = await web3.eth.getBlockNumber()
  console.log(`Block #: ${block}`)

  /* Use hooked-web3-provider */
  // for(var i = 1; i <= config.txIterations; i++) {
  //   var result = await web3.eth.sendTransaction({
  //     from: coinbase.address,
  //     to: another.address,
  //     value: 1,
  //   })
  //   console.log(result)
  // }

  const coinbaseInitialBalance = web3.eth.getBalance(coinbase.address)
  const anotherInitialBalance = web3.eth.getBalance(another.address)

  console.log(`Coinbase Balance: ${coinbaseInitialBalance.toFormat()}`)
  console.log(`Another Balance: ${anotherInitialBalance.toFormat()}`)
  console.log(`Total: ${(coinbaseInitialBalance.add(anotherInitialBalance)).toFormat()}`)

  /* Use raw transactions */
  const startingNonce = await web3.eth.getTransactionCount(coinbase.address, 'pending')
  console.log(`Nonce: ${startingNonce}`)
  start = new Date()
  for(var i = 0; i < config.txIterations; i++) {
    var rawTx = {
      from: coinbase.address,
      to: another.address,
      nonce: startingNonce + i,
      gasPrice: "0x0",
      gasLimit: "0x3d0901",
      value: 1,
      data: ''
    }

    var signedTx = signTransaction(rawTx)
    const result = await web3.eth.sendRawTransaction(signedTx)
    console.log(result)
  }
}

main().then(() => {
  var end = new Date()
  console.log(`Duration (ms): ${end - start}`)
  console.log('Goodbye')
}).catch(err => {
  console.error(err)
})

