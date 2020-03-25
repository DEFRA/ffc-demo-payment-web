
const bell = require('@hapi/bell')
const config = require('../config')

const isSecure = config.isProd

module.exports = {
  plugin: {
    name: 'auth',
    register: async (server) => {
      await server.register(bell)
      // Declare an authentication strategy using the bell scheme
      // with the name of the provider, cookie encryption password,
      // and the OAuth client credentials.
      server.auth.strategy('okta', 'bell', {
        provider: 'okta',
        config: { uri: `https://${config.okta.domain}` },
        password: config.okta.cookiePassword,
        isSecure,
        location: config.okta.url,
        clientId: config.okta.clientId,
        clientSecret: config.okta.clientSecret
      })
    }
  }
}
