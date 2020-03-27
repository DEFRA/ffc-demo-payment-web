
const bell = require('@hapi/bell')
const authCookie = require('@hapi/cookie')
const config = require('../config')

const isSecure = config.isProd
const redirectTo = config.isProd ? '/auth/okta' : '/auth/dev'

function registerSessionAuth (server) {
  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'ffc-demo-payment-service',
      path: '/',
      password: config.okta.cookiePassword,
      isSecure
    },
    redirectTo
  })
}

function registerOktaAuth (server) {
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

module.exports = {
  plugin: {
    name: 'auth',
    register: async (server) => {
      await server.register([authCookie, bell])
      registerSessionAuth(server)
      registerOktaAuth(server)
    }
  }
}
