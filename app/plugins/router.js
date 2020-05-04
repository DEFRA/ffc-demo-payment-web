
// const { oktaEnabled } = require('../config')
// const authRoute = oktaEnabled ? require('../routes/okta') : require('../routes/dev-login')

const routes = [].concat(
  // authRoute,
  require('../routes/home'),
  require('../routes/payments'),
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/b2c'),
  require('../routes/static')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, options) => {
      server.route(routes)
    }
  }
}
