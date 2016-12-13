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

export default web3
