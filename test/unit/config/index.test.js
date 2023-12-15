jest.mock('joi')
const joi = require('joi')

describe('Config', () => {
  beforeEach(() => {
    joi.object.mockClear()
    joi.string = jest.fn().mockImplementation(() => {
      return {
        required: jest.fn().mockReturnThis(),
        optional: jest.fn().mockReturnThis(),
        default: jest.fn().mockReturnThis(),
        valid: jest.fn().mockReturnThis(),
        uri: jest.fn().mockReturnThis()
      }
    })

    joi.bool = jest.fn().mockImplementation(() => {
      return {
        default: jest.fn().mockReturnValue(false)
      }
    })

    joi.number = jest.fn().mockImplementation(() => {
      return {
        default: jest.fn().mockReturnValue(0)
      }
    })

    process.env.PORT = '3000'
    process.env.NODE_ENV = 'development'
    process.env.COOKIE_PASSWORD = 'password'
    process.env.STATIC_CACHE_TIMEOUT_IN_MILLIS = '900000'
    process.env.PAYMENT_SERVICE_URL = 'http://localhost:3000'
    process.env.REST_CLIENT_TIMEOUT_IN_MILLIS = '20000'
    process.env.GOOGLE_TAG_MANAGER_KEY = ''
  })

  test('should validate the config successfully', () => {
    const mockValidate = jest.fn().mockReturnValue({ error: null, value: {} })
    joi.object = jest.fn().mockReturnValue({ validate: mockValidate })

    require('../../../app/config/index')

    expect(joi.object).toHaveBeenCalled()
    expect(mockValidate).toHaveBeenCalled()
  })

  test('should throw validation error', () => {
    const mockValidate = jest.fn().mockReturnValue({ error: "error", value: {} })
    joi.object = jest.fn().mockReturnValue({ validate: mockValidate })

    require('../../../app/config/index')

  })
})
