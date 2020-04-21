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
      dir: path.resolve(process.cwd(), 'test-output')
    })
    await provider.setup()
    const mockPaymentServiceUrl = provider.mockService.baseUrl
    jest.mock('../../app/config', () => ({
      paymentServiceUrl: mockPaymentServiceUrl
    }))
    scheduleService = require('../../app/services/payment-schedule-service')
  })

  test('GetAll returns schedule (including optional fields)', async () => {
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
          claimId: Matchers.like('MINE123'),
          paymentAmount: Matchers.decimal(),
          paymentDate: Matchers.iso8601DateTime()
        }, { min: 1 })
      }
    })

    const response = await scheduleService.getAll('token')
    console.log(response)
    expect(response[0]).toEqual(expect.objectContaining({
      claimId: 'MINE123',
      paymentAmount: 13.01,
      paymentDate: '2015-08-06T16:53:10+01:00'
    }))
  })

  afterEach(async () => {
    await provider.verify()
  })

  afterAll(async () => {
    await provider.finalize()
  })
})
