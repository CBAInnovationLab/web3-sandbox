import through from 'through2'
import solc from 'solc'
import ethUtil from 'ethereumjs-util'

export function compile() {
  return through.obj(function CompilePlugin(file, encoding, done) {
    this.push(file)
    if (file.isBuffer()) {
      var source = file.contents.toString('utf8')
      const compiled = solc.compile(source)
      file.contents = new Buffer(JSON.stringify(compiled))
    }
    return done()
  })
}

export async function deploy(web3, fromAddress, name, compiled, ...ctorArgs) {
  return new Promise(async (resolve, reject) => {
    console.log(`Deploying: ${name} [${ctorArgs}]`)

    async function callback(e, contract) {
      if(e) {
        console.log(e)
        reject(e)
      } else {
        if(!contract.address) {
          console.log(`- Waiting to be mined... Tx Hash: ${contract.transactionHash}`)
        } else {
          console.log(`- Mined! Address: ${contract.address}`)
          resolve(contract)
        }
      }
    }
    var contract = web3.eth.contract(JSON.parse(compiled.interface))
    const options = {
      from: fromAddress,
      data: ethUtil.addHexPrefix(compiled.bytecode),
      gas: 4000001
    }

    var contractArgs = ctorArgs.concat([options, callback])
    await contract.new.apply(contract, contractArgs)
  })
}
