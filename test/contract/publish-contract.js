const { Publisher } = require('@pact-foundation/pact')
const path = require('path')
const packageJson = require('../../package.json')

const opts = {
  pactFilesOrDirs: [path.resolve(process.cwd(), 'test-output')],
  pactBroker: process.env.PACT_BROKER || 'http://localhost:9292',
  consumerVersion: packageJson.version
}

new Publisher(opts).publishPacts()
