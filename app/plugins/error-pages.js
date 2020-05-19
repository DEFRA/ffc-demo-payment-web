const codesWithViews = [401, 403, 404]

module.exports = {
  plugin: {
    name: 'error-pages',
    register: (server, options) => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response

        if (response.isBoom) {
          const statusCode = response.output.statusCode

          if (codesWithViews.includes(statusCode)) {
            return h.view(statusCode.toString()).code(statusCode)
          }

          request.log('error', {
            statusCode: statusCode,
            data: response.data,
            message: response.message
          })

          console.error('500 error', response)
          return h.view('500').code(statusCode)
        }
        return h.continue
      })
    }
  }
}
