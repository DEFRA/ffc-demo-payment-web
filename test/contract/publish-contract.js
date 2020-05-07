const { Publisher } = require('@pact-foundation/pact')
const path = require('path')
const packageJson = require('../../package.json')

// check for required arguments...
const requiredArguments = ['--pactUsername', '--pactPassword']
for (const requiredArgument of requiredArguments) {
  if (!process.argv.find(arg => arg.startsWith(requiredArgument))) {
    throw new Error(`${requiredArgument} must be specified when publishing a Pact`)
  }
}

const getPactBrokerURL = () => {
  const pactBrokerArg = process.argv.find(arg => arg.startsWith('--pactBroker'))

  if (pactBrokerArg) {
    return pactBrokerArg.split('=')[1]
  } else if (process.env.PACT_BROKER) {
    return process.env.PACT_BROKER
  }
}

const pactBroker = getPactBrokerURL()

const pactBrokerUsername = process.argv.find(arg => arg.startsWith('--pactUsername')).split('=')[1]
const pactBrokerPassword = process.argv.find(arg => arg.startsWith('--pactPassword')).split('=')[1]

const opts = {
  pactFilesOrDirs: [path.resolve(process.cwd(), 'test-output')],
  pactBroker,
  consumerVersion: packageJson.version,
  pactBrokerUsername,
  pactBrokerPassword
}

if (pactBroker) {
  console.log(`Publishing Pacts to ${pactBroker}`)
  new Publisher(opts).publishPacts()
} else {
  throw new Error('No pact broker url found: either --pactBroker must be used or PACT_BROKER env var set')
}
