const payments = require("../../../app/routes/payments");

jest.mock("../../../app/services/payment-schedule-service", () => {
  return {
    getAll: jest.fn().mockImplementation(() => {
      return [
        {
          paymentAmount: 100,
          paymentDate: "2020-01-01",
        },
        {
          paymentAmount: 200,
          paymentDate: "2020-01-02",
        },
      ];
    }),
  };
});
const payScheduleService = require("../../../app/services/payment-schedule-service");

jest.mock("../../../app/models/payments-view-model", () =>
  jest.fn().mockImplementation(() => {
    return {};
  })
);
const getViewModel = require("../../../app/models/payments-view-model");

describe("GET /payments", () => {
  test('should return 200 with "ok"', async () => {
    const mockRequest = {};
    const mockH = {
      view: jest.fn(),
    };

    await payments.options.handler(mockRequest, mockH);

    expect(mockH.view).toHaveBeenCalled();
    expect(payScheduleService.getAll).toHaveBeenCalled();
    expect(getViewModel).toHaveBeenCalled();
  });
});
