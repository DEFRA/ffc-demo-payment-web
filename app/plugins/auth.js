
const bell = require('@hapi/bell')
const authCookie = require('@hapi/cookie')

const config = require('../config')
const isSecure = config.isProd
const redirectTo = `/auth/${config.oidcProvider}`

bell.providers['okta-custom'] = require('./okta-custom-provider')
bell.providers['b2c-custom'] = require('./b2c-custom-provider')

function registerSessionAuth (server) {
  server.auth.strategy('session', 'cookie', {
    cookie: {
      name: 'ffc-demo-payment-service',
      path: '/',
      password: config.cookiePassword,
      isSecure
    },
    redirectTo
  })
}

function registerB2cAuth (server) {
  server.auth.strategy('b2c', 'bell', {
    provider: 'b2c-custom',
    config: {
      uri: config.b2c.b2cUrl,
      clientId: config.b2c.clientId
    },
    providerParams: {
      response_type: 'code',
      nonce: 'defaultNonce',
      prompt: 'login'
    },
    password: config.cookiePassword,
    isSecure,
    location: config.b2c.url,
    clientId: config.b2c.clientId,
    clientSecret: config.b2c.clientSecret
  })
}
function registerOktaAuth (server) {
  // Declare an authentication strategy using the bell scheme
  // with the name of the provider, cookie encryption password,
  // and the OAuth client credentials.
  server.auth.strategy('okta', 'bell', {
    provider: 'okta-custom',
    config: {
      uri: `https://${config.okta.domain}`,
      authorizationServerId: config.okta.authorizationServerId
    },
    password: config.cookiePassword,
    scope: ['email', 'profile', 'openid', ...config.okta.scopes],
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
      if (config.oidcProvider === 'b2c') {
        registerB2cAuth(server)
      } else if (config.oidcProvider === 'okta') {
        registerOktaAuth(server)
      }
    }
  }
}
