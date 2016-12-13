import keythereum from 'keythereum'

export let keys = {}

export const coinbase = {
  address: "0xbfdacdfe79ccf1e61649220df47701df16606405",
  privateKey: new Buffer("729ab3ebee34c9f43fd2afa20e892cfd5c181b7299870e4e089943516acf2a63",'hex'),
}

export const another = {
  address: "0xd4645b2d3d46746ebba9f5788e32250ae345a10c",
  privateKey: new Buffer("edf4727570c8c7640051b5812cea08a8e94324c569ab831ff1c52624afee6bb6",'hex'),
}

export function generateKey() {
  const params = { keyBytes: 32, ivBytes: 16 }
  const dk = keythereum.create(params)
  const account = {
    address: keythereum.privateKeyToAddress(dk.privateKey),
    privateKey: dk.privateKey
  }
  keys[account.address] = account
  console.log(account)
  console.log(account.privateKey.toString('hex'))
}

keys[coinbase.address] = coinbase
keys[another.address] = another
