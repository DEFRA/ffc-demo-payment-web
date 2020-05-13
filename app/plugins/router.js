const { oidcProvider } = require('../config')

const authRoute = require(`../routes/${oidcProvider}-login`)

const routes = [].concat(
  authRoute,
  require('../routes/home'),
  require('../routes/payments'),
  require('../routes/healthy'),
  require('../routes/healthz'),
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
