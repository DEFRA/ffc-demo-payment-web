const path = require('path')
const { Pact } = require('@pact-foundation/pact')
const Matchers = require('@pact-foundation/pact/dsl/matchers')
let scheduleService
let provider

describe('Schedule contract test', () => {
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
    scheduleService = require('../../app/services/payment-schedule-service')
  })

  test('GetAll returns schedule', async () => {
    await provider.addInteraction({
      state: 'schedules exist',
      uponReceiving: 'get all schedules',
      withRequest: {
        method: 'GET',
        path: '/schedule'
      },
      willRespondWith: {
        status: 200,
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: Matchers.eachLike({
          claimId: Matchers.like('MINE123')
        }, { min: 1 })
      }
    })

    const response = await scheduleService.getAll('token')
    expect(response[0].claimId).toBe('MINE123')
  })

  afterEach(async () => {
    await provider.verify()
  })

  afterAll(async () => {
    await provider.finalize()
  })
})
