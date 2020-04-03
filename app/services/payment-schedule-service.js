const config = require('../config')
const wreck = require('@hapi/wreck').defaults({
  timeout: config.restClientTimeoutMillis
})

async function getAll () {
  const result = await wreck.get(`${config.paymentServiceUrl}/schedule`, { json: true })
  return result.payload
}

module.exports = {
  getAll
}
