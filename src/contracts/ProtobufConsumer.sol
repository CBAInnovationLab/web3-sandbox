contract ProtobufConsumer {

  /* We will maintain a list of orders in the contract's storage. */
  OrderCodec.Order[] public orders;

  /* For each price/volume specified in an order, we emit an event. */
  event PricePointEvent(address bidder, uint price, uint volume);

  /* External functions in Solidity cannot take structs as arguments, so we
     take an encoded bytestring instead. */
  function addOrder(bytes data) {
    /* We can decode the binary into a struct in memory. */
    OrderCodec.Order memory order = OrderCodec.decode(data);

    /* Emit some events to demonstrate the object was decoded correctly. */
    for (uint i = 0; i < order.point.length; i++) {
      PricePointCodec.PricePoint memory point = order.point[i];
      PricePointEvent(this, point.price, point.volume);
    }

    /* Solidity cannot yet copy in-memory structs to storage, so we use a
       the auto-generated 'store' function to copy it manually. */
    orders.length += 1;
    OrderCodec.store(order, orders[orders.length-1]);
  }

}

