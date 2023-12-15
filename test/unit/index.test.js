jest.mock('../../app/services/app-insights', () => {
  return {
    setup: jest.fn()
  }
})
const appInsights = require('../../app/services/app-insights')

jest.mock('../../app/server', () =>
  jest.fn().mockResolvedValue({ start: jest.fn() })
)
const createServer = require('../../app/server')

describe('Server setup', () => {
  let mockExit
  let mockConsoleLog

  beforeEach(() => {
    jest.clearAllMocks()
    mockExit = jest.spyOn(process, 'exit').mockImplementation(() => {})
    mockConsoleLog = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    mockExit.mockRestore()
    mockConsoleLog.mockRestore()
  })

  test('should setup app insights and start the server', async () => {
    require('../../app/index')

    expect(appInsights.setup).toHaveBeenCalled()
    expect(createServer).toHaveBeenCalled()
  })

  test('should log error and exit process when server start fails', async () => {
    const error = new Error('Server start failed')
    require('../../app/index')
    createServer.mockRejectedValue(error)
  })
})
