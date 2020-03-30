async function getAll () {
  return Promise.resolve(
    [
      {
        claimId: 'MINE123',
        paymentDate: '2020-04-01T14:10:20.331Z',
        amount: 32.83
      },
      {
        claimId: 'MINE123',
        paymentDate: '2020-05-01T14:10:20.331Z',
        amount: 32.83
      },
      {
        claimId: 'MINE123',
        paymentDate: '2020-06-01T14:10:20.331Z',
        amount: 32.83
      },
      {
        claimId: 'MINE123',
        paymentDate: '2020-07-01T14:10:20.331Z',
        amount: 32.83
      },
      {
        claimId: 'MINE124',
        paymentDate: '2020-07-01T14:10:20.331Z',
        amount: 42.12
      },
      {
        claimId: 'MINE123',
        paymentDate: '2020-08-01T14:10:20.331Z',
        amount: 32.83
      },
      {
        claimId: 'MINE124',
        paymentDate: '2020-08-01T14:10:20.331Z',
        amount: 42.12
      },
      {
        claimId: 'MINE123',
        paymentDate: '2020-09-01T14:10:20.331Z',
        amount: 32.83
      },
      {
        claimId: 'MINE124',
        paymentDate: '2020-09-01T14:10:20.331Z',
        amount: 42.12
      },
      {
        claimId: 'MINE124',
        paymentDate: '2020-10-01T14:10:20.331Z',
        amount: 42.12
      },
      {
        claimId: 'MINE124',
        paymentDate: '2020-08-01T14:10:20.331Z',
        amount: 42.12
      },
      {
        claimId: 'MINE124',
        paymentDate: '2020-09-01T14:10:20.331Z',
        amount: 42.12
      }
    ])
}

module.exports = {
  getAll
}
