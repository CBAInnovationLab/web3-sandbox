import Tx from 'ethereumjs-tx'
import ethUtil from 'ethereumjs-util'
import web3 from './web3client'
import { coinbase, another, keys } from './keys'


export function signTransaction(rawTx) {
  var account = keys[rawTx.from]
  if(!account) {
    throw new Error(`No private key for account "${from}"`)
  }
  var privateKey = account.privateKey
  var tx = new Tx(rawTx)
  tx.sign(privateKey)
  var serializedTx = tx.serialize()

  return serializedTx.toString('hex')
}
