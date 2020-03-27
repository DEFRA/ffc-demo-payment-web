const moment = require('moment')

function formatDate (date) {
  return moment(date).format('DD/MM/YYYY')
}
function toRow (payment) {
  const payments = payment.paymentDates.map(formatDate).join(', ')
  return [
    { text: payment.claimId },
    { text: payments }
  ]
}

function createTableDefinition (payments) {
  return {
    caption: 'Payments',
    firstCellIsHeader: true,
    head: [
      {
        text: 'Claim ID',
        classes: 'govuk-!-width-one-half'
      },
      {
        text: 'Scheduled Payments',
        classes: 'govuk-!-width-one-half'
      }
    ],
    rows: payments.map(toRow)
  }
}

module.exports = function getPaymentsViewModel (name, payments) {
  return {
    name,
    table: createTableDefinition(payments)
  }
}
