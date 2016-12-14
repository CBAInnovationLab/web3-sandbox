import config from './config'
import { coinbase, keys } from './keys'
import Tx from 'ethereumjs-tx'
import ethUtil from 'ethereumjs-util'
import keythereum from 'keythereum'

const hasAddress = async function (address, callback) {
  var account = keys[address]
  callback(null, typeof account !== 'undefined' && account != null)
}

const signTransaction = async function signTransaction(tx_params,callback) {
  var account = keys[tx_params.from]

  if (typeof account === 'undefined' || account == null) {
    callback(new Error("Cannot find from Address"))
  }

  const rawTx = {
    nonce: tx_params.nonce,
    gasPrice: "0x0",
    gasLimit: "0x3d0901",
    value: '0x0',
    data: ''
  }

  if (tx_params.gas != null) {
    rawTx.gasLimit = tx_params.gas
  }

  if (tx_params.to != null) {
    rawTx.to = tx_params.to
  }

  if (tx_params.value != null) {
    rawTx.value = tx_params.value
  }

  if (tx_params.data != null) {
    rawTx.data = tx_params.data
  }

  const tx = new Tx(rawTx)

  tx.sign(account.privateKey)

  const serializedTx =  ethUtil.addHexPrefix(tx.serialize().toString('hex'))

  callback(null, serializedTx)
}

export default {
    hasAddress,
    signTransaction
}
