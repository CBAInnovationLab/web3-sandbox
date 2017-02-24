import promisify from 'es6-promisify'
import keythereum from 'keythereum'

import { compile, deploy } from './gulp-eth'
import binaries from '../build/contracts.compiled.json'
import config from './config'
import web3 from './web3client'
import { coinbase, another, keys, generateKey } from './keys'
import { signTransaction } from './rawTransaction'
import protobuf from './protobuf'

import OrderCodec from '../build/order_pb.js'

console.log(`Geth URL: ${config.gethUrl}`)


function encodeOrder(pricePoints, address) {
  const order = new OrderCodec.Order()
  pricePoints.forEach(x => {
    const point = new OrderCodec.Order.PricePoint()
    point.setPrice(x.price)
    point.setVolume(x.volume)
    order.addPoint(point)
  })
  return new Uint8Array(order.serializeBinary());
}

async function deployContracts() {
    const pricePointCodec = await deploy(web3, coinbase.address, 'PricePointCodec', binaries.PricePointCodec, 1)
    const orderCodec = await deploy(web3, coinbase.address, 'OrderCodec', binaries.OrderCodec, 1)
    const protobufConsumer = await deploy(web3, coinbase.address, 'ProtobufConsumer', binaries.ProtobufConsumer, 1)
  
    console.log('-------------------------------------------------')
    console.log('PricePointCodec Address:    ' + pricePointCodec.address)
    console.log('OrderCodec Address:         ' + orderCodec.address)
    console.log('ProtobufConsumer Address:   ' + protobufConsumer.address)
    console.log('-------------------------------------------------')

    return {pricePointCodec, orderCodec, protobufConsumer}
}

async function main() {
  const {protobufConsumer} = await deployContracts()
  const order = encodeOrder([{price: 5, volume: 10},{price: 6, volume: 11}], [0])
  await new Promise((resolve,reject) => 
    protobufConsumer.addOrder.call(order, { from: coinbase.address, gas: 4700000 }, (err, result) => {
      if (err) {
        console.error("Error: " + err)
        reject(err)
      } else {
        console.log("Success: " + result)
        resolve(result)
      }
    })
  )
}

main().then(() => {
}).catch(err => {
  console.error(err)
})

