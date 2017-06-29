import promisify from 'es6-promisify'
import Web3 from 'web3'
import config from './config'
import keystore from './keystore'
import HookedWeb3Provider from 'hooked-web3-provider'

const provider = new HookedWeb3Provider({
  host: config.gethUrl,
  transaction_signer: keystore
})
const web3 = new Web3()
web3.setProvider(provider)

web3.eth.getBlockNumberAsync = promisify(web3.eth.getBlockNumber)
web3.eth.getTransactionCountAsync = promisify(web3.eth.getTransactionCount)
web3.eth.sendTransactionAsync = promisify(web3.eth.sendTransaction)
web3.eth.sendRawTransactionAsync = promisify(web3.eth.sendRawTransaction)

export default web3
