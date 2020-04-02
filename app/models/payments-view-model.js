const moment = require('moment')

function formatDate (date) {
  return moment(date).format('DD/MM/YYYY')
}
function toRow (payment) {
  return [
    { text: payment.claimId },
    { text: formatDate(payment.paymentDate) },
    { text: `£${payment.paymentAmount}` }
  ]
}

function createTableDefinition (payments) {
  return {
    caption: 'Payments',
    firstCellIsHeader: true,
    head: [
      {
        text: 'Claim ID',
        classes: 'govuk-!-width-one-third'
      },
      {
        text: 'Payment Date',
        classes: 'govuk-!-width-one-third'
      },
      {
        text: 'Amount',
        classes: 'govuk-!-width-one-third'
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
