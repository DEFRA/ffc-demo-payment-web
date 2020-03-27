const service = require('../services/payment-schedule-service')
const getViewModel = require('../models/payments-view-model')

module.exports = {
  method: 'GET',
  path: '/payments',
  options: {
    auth: {
      mode: 'required',
      strategy: 'session'
    },
    handler: async (request, h) => {
      const name = request.auth.credentials.profile.firstName
      const payments = await service.getAll()
      return h.view('payments', getViewModel(name, payments))
    }
  }
}
