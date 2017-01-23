import Tx from 'ethereumjs-tx'
import ethUtil from 'ethereumjs-util'
import web3 from './web3client'
import { coinbase, another, keys } from './keys'


export function signTransaction(rawTx) {
  const account = keys[rawTx.from]
  if(!account) {
    throw new Error(`No private key for account "${from}"`)
  }
  const privateKey = account.privateKey
  const tx = new Tx(rawTx)
  tx.sign(privateKey)
  const serializedTx = ethUtil.addHexPrefix(tx.serialize().toString('hex'))

  return serializedTx.toString('hex')
}
