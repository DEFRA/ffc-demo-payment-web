const {
  getAll,
  getSchedulesByClaim,
} = require("../../../app/services/payment-schedule-service");

jest.mock("../../../app/config", () => {
  return {
    paymentServiceUrl: "url",
  };
});

jest.mock("@hapi/wreck", () => {
  return {
    defaults: jest.fn().mockReturnValue({
      get: jest.fn().mockReturnValue({
        payload: {},
      }),
    }),
  };
});
const wreck = require("@hapi/wreck");

describe("Payment Schedule Service", () => {
  test("should call getAll", async () => {
    const schedules = await getAll();
    expect(schedules).toMatchObject({});
  });

  test("should call getScheduleByClaim", async () => {
    const schedules = await getSchedulesByClaim("claimId");
    console.log(schedules);
    expect(schedules).toMatchObject({});
  });
});
