const Boom = require('@hapi/boom')

module.exports = {
  method: 'GET',
  path: '/auth/okta',
  options: {
    auth: {
      strategy: 'okta',
      mode: 'try'
    },
    handler: function (request, h) {
      console.log('/auth/okta')
      if (!request.auth.isAuthenticated) {
        throw Boom.unauthorized('Authentication failed: ' + request.auth.error.message)
      }

      console.log('authenticated', request.auth.credentials.profile.username)
      // Just store the third party credentials in the session as an example. You could do something
      // more useful here - like loading or setting up an account (social signup).

      request.cookieAuth.set(request.auth.credentials)
      return h.redirect('/')
    }
  }
}
