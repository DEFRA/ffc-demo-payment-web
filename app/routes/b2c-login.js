const Boom = require('@hapi/boom')

module.exports = {
  method: 'GET',
  path: '/auth/b2c',
  options: {
    auth: {
      strategy: 'b2c',
      mode: 'try'
    },
    handler: function (request, h) {
      console.log('/auth/b2c')
      if (!request.auth.isAuthenticated) {
        throw Boom.unauthorized('Authentication failed: ' + request.auth.error.message)
      }
      console.log('authenticated', request.auth.credentials.profile.displayName)
      request.cookieAuth.set(request.auth.credentials)
      return h.redirect('/')
    }
  }
}
