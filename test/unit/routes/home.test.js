const home = require("../../../app/routes/home");

describe("GET /", () => {
  test('should return 200 with "ok"', () => {
    const mockRequest = {};
    const mockH = {
      view: jest.fn()
    };

    home.options.handler(mockRequest, mockH);

    expect(mockH.view).toHaveBeenCalled();
  });
});
