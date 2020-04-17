const {Pact} = require("@pact-foundation/pact")
const {getAll} = require("../../app/services/payment-schedule-service")
const {atMostLike, eachLike, like, string, date} = require("@pact-foundation/pact/dsl/matchers");

const provider = new Pact({
  consumer: 'ffc-demo-payment-web',
  provider: 'ffc-demo-payment-service',
  log: path.resolve(process.cwd(), 'logs', 'pact.log'),
  logLevel: "warn",
  dir: path.resolve(process.cwd(), 'pacts'),
  spec: 2
})

describe("", () => {
  beforeAll(() => provider.setup());
  afterEach(() => provider.verify());
  afterAll(() => provider.finalize());

  describe("getting all schedules", () => {
    test("schedules exist", async () => {
      await provider.addInteraction({
        state: "schedules exist",
        uponReceiving: "get all schedules",
        withRequest: {
          method: "GET",
          path: "/schedule",
          headers: {}
        },
        willRespondWith: {
          status: 200,
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          },
          body: eachLike({
            claimId: string("MINE123"),
            // paymentDate: string(), // date("Fri Apr 17 11:48:17 BST 2020"),
            // atMostLike({ paymentAmount: 100.00 }, 1)
          })
        }
      })
    })
  })
})