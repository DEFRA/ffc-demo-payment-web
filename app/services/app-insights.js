const appInsights = require('applicationinsights')

function setup () {
  if (process.env.APPINSIGHTS_INSTRUMENTATIONKEY) {
    console.log('Registering Application Insights')
    appInsights.setup().start()
    const cloudRoleTag = appInsights.defaultClient.context.keys.cloudRole
    const appName = process.env.APPINSIGHTS_CLOUDROLE
    appInsights.defaultClient.context.tags[cloudRoleTag] = appName
  }
}

module.exports = { setup }
