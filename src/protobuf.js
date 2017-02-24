import OrderCodec from '../build/order_pb.js'

export function encodeOrder(pricePoints, address) {
  const order = new OrderCodec.Order()
  pricePoints.forEach((price, vol) => {
    const point = new OrderCodec.PricePoint()
    point.setPrice(price)
    point.setVolume(vol)
    order.addPoint(point)
  })
  return new UInt8Array(order.serializeBinary());
}


