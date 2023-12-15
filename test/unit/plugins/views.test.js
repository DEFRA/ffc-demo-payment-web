jest.mock('../../../app/config', () => {
  return {
    isDev: true,
    googleTagManagerKey: 'mockGoogleTagManagerKey'
  }
})

jest.mock('../../../app/plugins/views')
const viewPlugin = require('../../../app/plugins/views')

jest.mock('nunjucks', () => ({
  compile: jest.fn(() => jest.fn()),
  configure: jest.fn()
}))

jest.mock('path', () => ({
  join: jest.fn(() => 'mockPath')
}))

describe('viewPlugin', () => {
  test('should export the plugin object', () => {
    expect(viewPlugin).toBeDefined()
  })
})
