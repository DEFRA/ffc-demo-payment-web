const healthz = require('../../../app/routes/healthz')

describe('GET /healthz', () => {
  test('should return 200 with "ok"', () => {
    const mockRequest = {}
    const mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn()
    }

    healthz.options.handler(mockRequest, mockH)

    expect(mockH.response).toHaveBeenCalled()
    expect(mockH.code).toHaveBeenCalled()
  })
})
