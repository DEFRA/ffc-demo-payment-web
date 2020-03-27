describe('Home test', () => {
  let createServer
  let server

  beforeAll(async () => {
    createServer = require('../../app/server')
  })

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET /auth/dev sets auth cookie and redirects', async () => {
    const authUrlOptions = {
      method: 'GET',
      url: '/auth/dev'
    }

    const response = await server.inject(authUrlOptions)
    expect(response.statusCode).toBe(302)
    expect(response.headers['set-cookie'][0]).toContain('ffc-demo-payment-service=')
  })

  afterEach(async () => {
    await server.stop()
  })
})
