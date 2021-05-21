const service = require('../services/payment-schedule-service')
const getViewModel = require('../models/payments-view-model')

function removeResultsWithNoAmount (payments) {
  return payments && payments.filter(p => p.paymentAmount)
}
module.exports = {
  method: 'GET',
  path: '/payments',
  options: {
    handler: async (request, h) => {
      const payments = await service.getAll()
      return h.view('payments', getViewModel(removeResultsWithNoAmount(payments)))
    }
  }
}
