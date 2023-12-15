const moment = require('moment')
const getPaymentsViewModel = require('../../../app/models/payments-view-model')

describe('getPaymentsViewModel', () => {
  test('should format payments correctly', () => {
    const payments = [
      {
        claimId: '123',
        paymentDate: new Date('2023-12-14'),
        paymentAmount: 100.0
      }
    ]

    const expectedOutput = {
      table: {
        caption: 'Payment schedule',
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
        rows: [
          [
            { text: '123' },
            { text: moment(new Date('2023-12-14')).format('DD/MM/YYYY') },
            { text: '£100' }
          ]
        ]
      }
    }

    expect(getPaymentsViewModel(payments)).toEqual(expectedOutput)
  })
})
