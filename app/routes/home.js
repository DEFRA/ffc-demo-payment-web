module.exports = {
  method: 'GET',
  path: '/',
  options: {
    auth: {
      mode: 'required',
      strategy: 'session'
    },
    handler: (request, h) => {
      const name = request.auth.credentials.profile.firstName
      return h.view('home', { name })
    }
  }
}
