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

  test('GET / route returns 302', async () => {
    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  afterEach(async () => {
    await server.stop()
  })
})
