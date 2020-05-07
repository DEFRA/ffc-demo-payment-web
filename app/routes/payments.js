const service = require('../services/payment-schedule-service')
const getViewModel = require('../models/payments-view-model')

function removeResultsWithNoAmount (payments) {
  return payments && payments.filter(p => p.paymentAmount)
}
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
      const payments = await service.getAll(request.auth.credentials.token)

      return h.view('payments', getViewModel(name, removeResultsWithNoAmount(payments)))
    }
  }
}
