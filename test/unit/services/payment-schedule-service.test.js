let payload
const wreck = require('@hapi/wreck')
jest.mock('@hapi/wreck')
const mockWreck = {
  get: jest.fn(() => Promise.resolve({ payload }))
}
wreck.defaults = () => mockWreck
const mockConfig = {
  paymentServiceUrl: 'https://payment-service'
}
jest.mock('../../../app/config', () => mockConfig)
const paymentScheduleService = require('../../../app/services/payment-schedule-service')

describe('Payment schedule service tests', () => {
  afterEach(() => {
    jest.clearAllMocks()
  })

  test('getSchedulesByClaim calls correct endpoint', async () => {
    const sampleClaimId = 'MINEALLMINE'
    await paymentScheduleService.getSchedulesByClaim(sampleClaimId, 'abc-123')
    expect(mockWreck.get).toHaveBeenCalledWith(
      `${mockConfig.paymentServiceUrl}/schedule/${sampleClaimId}`,
      expect.any(Object)
    )
  })

  test('getSchedulesByClaim passes through token', async () => {
    const sampleToken = 'open-sesame'
    await paymentScheduleService.getSchedulesByClaim('', sampleToken)
    expect(mockWreck.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: { authorization: `Bearer ${sampleToken}` }
      })
    )
  })

  test('getSchedulesByClaim returns payload', async () => {
    payload = [{ claimId: 'MINENOTYOURS', paymentDate: '2020-02-02T02:02:02.000' }]
    const schedules = await paymentScheduleService.getSchedulesByClaim('MINENOTYOURS', '')
    expect(schedules).toEqual(
      expect.objectContaining(payload)
    )
  })
})
