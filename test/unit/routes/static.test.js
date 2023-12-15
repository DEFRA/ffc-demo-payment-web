const staticRoute = require('../../../app/routes/static')
jest.mock('../../../app/config', () => {
  return {
    staticCacheTimeoutMillis: 10000
  }
})

describe('Routes tests', () => {
  test('GET assets', async () => {
    expect(staticRoute).toBeDefined()
  })
})
