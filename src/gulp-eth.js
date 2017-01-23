import through from 'through2'

export function compile(web3) {
  return through.obj(function CompilePlugin(file, encoding, done) {
    this.push(file)
    if (file.isBuffer()) {
      var source = file.contents.toString('utf8')
      var compiled = web3.eth.compile.solidity(source)
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

    var contract = web3.eth.contract(compiled.info.abiDefinition)

    const options = {
      from: fromAddress,
      data: compiled.code,
      gas: 4000001
    }

    var contractArgs = ctorArgs.concat([options, callback])
    await contract.new.apply(contract, contractArgs)
  })
}
