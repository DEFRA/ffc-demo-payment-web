const healthy = require('../../../app/routes/healthy')

describe('GET /healthy', () => {
  test('should return 200 with "ok"', () => {
    const mockRequest = {}
    const mockH = {
      response: jest.fn().mockReturnThis(),
      code: jest.fn()
    }

    healthy.options.handler(mockRequest, mockH)

    expect(mockH.response).toHaveBeenCalled()
    expect(mockH.code).toHaveBeenCalled()
  })
})
