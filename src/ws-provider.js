import WebSocket from 'ws'

/**
 * InvalidResponseError helper for invalid errors.
 */
function invalidResponseError(result, host) {
  const message = !!result && !!result.error && !!result.error.message ? `[ethjs-provider-ws] ${result.error.message}` : `[ethjs-provider-ws] Invalid JSON RPC response from host provider ${host}: ${JSON.stringify(result, null, 2)}`;
  return new Error(message);
}

/**
 * WsProvider should be used to send rpc calls over http
 */
function WsProvider(host, timeout) {
  if (!(this instanceof WsProvider)) { throw new Error('[ethjs-provider-ws] the WsProvider instance requires the "new" flag in order to function normally (e.g. `const eth = new Eth(new WsProvider());`).'); }
  if (typeof host !== 'string') { throw new Error('[ethjs-provider-ws] the WsProvider instance requires that the host be specified (e.g. `new WsProvider("ws://localhost:8546")`)'); }

  const self = this;
  self.host = host;
  self.timeout = timeout || 2000;
  self.connected = false;
  self.reconnect = false;
}

WsProvider.prototype.connect = function () {
  const self = this;

  return new Promise((resolve, reject) => {
    self.socket = new WebSocket(self.host);
    self.callbacks = {};

    self.socket.on('open', function open() {
      console.log('connected');
      self.connected = true;
      resolve();
    });

    self.socket.on('close', function close() {
      console.log('disconnected');
      self.connected = false;
      if(self.reconnect) {
        self.connect();
      }
    });

    self.socket.on('message', function message(data, flags) {
      var result = data;
      var error;
      try {
        console.log(data)
        result = JSON.parse(data);
        const callback = self.callbacks[result.id];
        if(callback) {
          delete self.callbacks[result.id];
          clearTimeout(callback.timeout);
          callback.handler(error, result);
        }
      } catch (jsonError) {
        const error = invalidResponseError(data, self.host);
        console.error(jsonError)
      }
    });
  });
}

WsProvider.prototype.disconnect = function () {
  const self = this;
  self.reconnect = false;
  self.socket.close();
}

/**
 * Should be used to make async request
 *
 * @method sendAsync
 * @param {Object} payload
 * @param {Function} callback triggered on end with (err, result)
 */
WsProvider.prototype.sendAsync = function (payload, callback) { // eslint-disable-line
  const self = this;

  try {
    if(!self.connected) {
      throw 'Not connected'
    }
    self.callbacks[payload.id] = {
      handler: callback,
      timeout: setTimeout(function() {
        delete self.callbacks[payload.id];
        callback('Request timeout')
      }, self.timeout)
    }
    console.log(payload)
    self.socket.send(JSON.stringify(payload), {mask: true});
  } catch (error) {
    callback('[ethjs-provider-ws] CONNECTION ERROR: Couldn\'t connect to node \'' + self.host + '\': ' + JSON.stringify(error, null, 2), null);
  }
};

module.exports = WsProvider;
