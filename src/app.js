import config from './config'
import { sleep } from './utils'
import web3 from './web3client'
import { coinbase, another, keys, generateKey } from './keys'
import { signTransaction } from './rawTransaction'
import keythereum from 'keythereum'

console.log(`Geth URL: ${config.gethUrl}`)

async function main() {
  const coinbaseInitialBalance = web3.eth.getBalance(coinbase.address)
  const anotherInitialBalance = web3.eth.getBalance(another.address)
  const initialSum = coinbaseInitialBalance.add(anotherInitialBalance);

  /* Use raw transactions */
  const startingNonce = await web3.eth.getTransactionCountAsync(coinbase.address)
  console.log(`Nonce: ${startingNonce}`)

  /* Prepare signed txs */
  const signedTxs = [];
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
    signedTxs.push(signedTx)
  }

  /* Send signed txs */
  const firstBlock = await web3.eth.getBlockNumberAsync()
  const start = new Date()
  for(var i = 0; i < signedTxs.length; i++) {
    const result = await web3.eth.sendRawTransactionAsync(signedTxs[i])
    console.log(result)
  }
  const end = new Date()

  console.log('\n(Giving the last txs 3 seconds to finalise...)')
  await sleep(3000);
  const lastBlock = await web3.eth.getBlockNumberAsync()

  const coinbaseFinalBalance = web3.eth.getBalance(coinbase.address)
  const anotherFinalBalance = web3.eth.getBalance(another.address)
  const finalSum = coinbaseFinalBalance.add(anotherFinalBalance)
  const delta = finalSum.sub(initialSum);

  console.log(`\nInitial Balances\n----------------`);
  console.log(`Coinbase: ${coinbaseInitialBalance.toFormat()}`)
  console.log(`Another: ${anotherInitialBalance.toFormat()}`)
  console.log(`Sum: ${initialSum.toFormat()}`)

  console.log(`\nFinal Balances\n--------------`);
  console.log(`Coinbase: ${coinbaseFinalBalance.toFormat()}`)
  console.log(`Another: ${anotherFinalBalance.toFormat()}`)
  console.log(`Sum: ${finalSum.toFormat()}`)

  console.log('\nDeltas\n------')
  console.log(`Coinbase: ${coinbaseFinalBalance.sub(coinbaseInitialBalance).toFormat()}`)
  console.log(`Another: ${anotherFinalBalance.sub(anotherInitialBalance).toFormat()}`)
  console.log(`Sum: ${finalSum.sub(initialSum).toFormat()}`)

  console.log('\nBlocks\n------')
  console.log(`First: ${firstBlock}`)
  console.log(`Last: ${lastBlock}`)
  console.log(`Count: ${lastBlock - firstBlock}`)

  console.log(`\nDuration (ms): ${end - start}`)
}

main().then(() => {
  console.log('\nGoodbye')
}).catch(err => {
  console.error(err)
})
