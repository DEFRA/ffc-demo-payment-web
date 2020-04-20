const path = require('path')
const { Pact } = require('@pact-foundation/pact')
const Matchers = require('@pact-foundation/pact/dsl/matchers')
let paymentService
let provider

describe('Payment contract test', () => {
  beforeAll(async () => {
    provider = new Pact({
      consumer: 'ffc-demo-payment-web',
      provider: 'ffc-demo-payment-service',
      port: 1234,
      log: path.resolve(process.cwd(), 'test-output', 'pact.log'),
      dir: path.resolve(process.cwd(), 'test-output'),
      logLevel: 'INFO',
      pactfileWriteMode: 'merge'
    })
    await provider.setup()
    const mockPaymentServiceUrl = provider.mockService.baseUrl
    jest.mock('../../app/config', () => {
      return {
        paymentServiceUrl: mockPaymentServiceUrl
      }
    })
    paymentService = require('../../app/services/payment-service')
  })

  test('GetAll returns payments', async () => {
    await provider.addInteraction({
      state: 'payments exist',
      uponReceiving: 'get all payments',
      withRequest: {
        method: 'GET',
        path: '/payment'
      },
      willRespondWith: {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: Matchers.eachLike({
          claimId: Matchers.like('MINE123'),
          paymentAmount: Matchers.like(100.00)
        }, { min: 1 })
      }
    })

    const response = await paymentService.getAll('token')
    expect(response[0].claimId).toBe('MINE123')
  })

  afterEach(async () => {
    await provider.verify()
  })

  afterAll(async () => {
    await provider.finalize()
  })
})
