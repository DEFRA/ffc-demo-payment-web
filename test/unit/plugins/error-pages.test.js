const errorPages = require('../../../app/plugins/error-pages')

describe('error-pages', () => {
  const h = {
    view: jest.fn().mockReturnThis(),
    code: jest.fn().mockReturnThis(),
    continue: Symbol('continue')
  }

  const server = {
    ext: jest.fn((event, handler) => {
      this.handler = handler
    })
  }

  beforeEach(() => {
    jest.clearAllMocks()
    errorPages.plugin.register(server)
  })

  test('should return the correct view for error codes with views', () => {
    const request = {
      response: {
        isBoom: true,
        output: {
          statusCode: 401
        }
      },
      log: jest.fn()
    }

    expect(this.handler(request, h)).toBe(h)
    expect(h.view).toHaveBeenCalledWith('401')
    expect(h.code).toHaveBeenCalledWith(401)
  })

  test('should return the 500 view for other error codes', () => {
    const request = {
      response: {
        isBoom: true,
        output: {
          statusCode: 500
        },
        data: {},
        message: 'An error occurred'
      },
      log: jest.fn()
    }

    expect(this.handler(request, h)).toBe(h)
    expect(h.view).toHaveBeenCalledWith('500')
    expect(h.code).toHaveBeenCalledWith(500)
  })

  test('should continue for non-error responses', () => {
    const request = {
      response: {
        isBoom: false
      }
    }

    expect(this.handler(request, h)).toBe(h.continue)
  })
})
