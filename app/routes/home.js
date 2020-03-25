module.exports = {
  method: 'GET',
  path: '/',
  options: {
    auth: {
      mode: 'required',
      strategy: 'okta'
    },
    handler: (request, h) => {
      return h.view('home')
    }
  }
}
