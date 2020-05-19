const getB2cConfig = require('../../app/config/get-b2c-config')
const origClientId = process.env.B2C_CLIENT_ID
describe('get okta config', () => {
  afterAll(async () => {
    process.env.B2C_CLIENT_ID = origClientId
  })

  test('Should pass validation for all fields populated', async () => {
    const config = getB2cConfig()
    expect(config).toBeDefined()
  })
  test('Should fail validation if all fields not populated', async () => {
    process.env.B2C_CLIENT_ID = ''
    expect(() => getB2cConfig()).toThrow(new Error('The b2c config is invalid. "clientId" is not allowed to be empty'))
  })
})
