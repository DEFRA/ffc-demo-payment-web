const jwtDecode = require('jwt-decode')

function b2cCustomProvider (options) {
  console.log(`openid+${options.clientId}`)
  return {
    protocol: 'oauth2',
    useParamsAuth: true,
    auth: `${options.uri}/oauth2/v2.0/authorize`,
    token: `${options.uri}/oauth2/v2.0/token`,
    scope: [`openid ${options.clientId}`],
    profile: async function (credentials, params, get) {
      const { givenName, surname } = jwtDecode(credentials.token)
      credentials.profile = {
        firstName: givenName,
        lastName: surname,
        displayName: `${givenName} ${surname}`
      }
    }
  }
}

module.exports = b2cCustomProvider
/*
        id: profile.sub,
        username: profile.email,
        displayName: profile.nickname,
        firstName: profile.given_name,
        lastName: profile.family_name,
        email: profile.email,
        raw: profile
        */
