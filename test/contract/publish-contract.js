const { Publisher } = require('@pact-foundation/pact')
const path = require('path')
const packageJson = require('../../package.json')

const getPactBrokerURL = () => {
  const pactBrokerArg = process.argv.find(arg => arg.startsWith('--pactBroker'))

  if (pactBrokerArg) {
    return pactBrokerArg.split('=')[1]
  } else if (process.env.PACT_BROKER) {
    return process.env.PACT_BROKER
  }
}

const pactBroker = getPactBrokerURL()

const opts = {
  pactFilesOrDirs: [path.resolve(process.cwd(), 'test-output')],
  pactBroker,
  consumerVersion: packageJson.version,
  pactBrokerUsername: 'pact',
  pactBrokerPassword: 'pact'
}

if (pactBroker) {
  console.log(`Publishing Pacts to ${pactBroker}`)
  new Publisher(opts).publishPacts()
}
