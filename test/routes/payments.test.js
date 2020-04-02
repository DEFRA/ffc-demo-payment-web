let paymentScheduleService

const payments = [
  {
    claimId: 'MINE123',
    paymentDate: '2020-04-01T14:10:20.331Z',
    paymentAmount: 32.83
  }
]

function createMocks () {
  jest.mock('../../app/services/payment-schedule-service')
  paymentScheduleService = require('../../app/services/payment-schedule-service')
  paymentScheduleService.getAll.mockImplementation(() => Promise.resolve(payments))
}

describe('Home test', () => {
  let createServer
  let server

  beforeAll(async () => {
    createMocks()
    createServer = require('../../app/server')
  })

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET / route redirects for unauthenticated user', async () => {
    const options = {
      method: 'GET',
      url: '/payments'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('GET / route displays payments authenticated user', async () => {
    const testUserProfile = {
      username: 'testuser',
      firstName: 'Testuser',
      lastName: 'Usertest'
    }

    const homeOptions = {
      method: 'GET',
      url: '/payments',
      auth: { strategy: 'session', credentials: { profile: testUserProfile } }
    }

    const homeResponse = await server.inject(homeOptions)
    expect(homeResponse.statusCode).toBe(200)
    expect(homeResponse.payload).toContain('MINE123')
    expect(homeResponse.payload).toContain('01/04/2020')
    expect(homeResponse.payload).toContain('£32.83')
  })

  afterEach(async () => {
    await server.stop()
    jest.clearAllMocks()
  })

  afterAll(async () => {
    jest.clearAllMocks()
  })
})
