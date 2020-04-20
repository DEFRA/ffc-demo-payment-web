const config = require('../config')
const wreck = require('@hapi/wreck').defaults({
  timeout: config.restClientTimeoutMillis,
  json: true
})

async function getAll (token) {
  const headers = { authorization: `Bearer ${token}` }
  const result = await wreck.get(`${config.paymentServiceUrl}/payment`, { headers })
  return result.payload
}

module.exports = {
  getAll
}
