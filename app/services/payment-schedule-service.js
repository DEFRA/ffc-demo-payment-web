
const config = require('../config')
const wreck = require('@hapi/wreck').defaults({
  timeout: config.restClientTimeoutMillis,
  json: true
})

async function getAll () {
  const result = await wreck.get(`${config.paymentServiceUrl}/schedule`)
  return result.payload
}

async function getSchedulesByClaim (claimId, token) {
  const result = await wreck.get(`${config.paymentServiceUrl}/schedule/${claimId}`)

  return result.payload
}

module.exports = {
  getAll,
  getSchedulesByClaim
}
