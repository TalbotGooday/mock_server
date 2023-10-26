const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()
const port = process.env.PORT || 3000


server.use(jsonServer.rewriter({
   '/api/*': '/$1',
   '/policies/': '/policy',
   '/policies/email/': '/policies',
   '/auth-service/oauth/token\\?*': '/users/sample/login?singular=1',
   '/TravelSmart-Allyz-bff/1.0/initialization-data': '/initialization-data',
}))

server.use(jsonServer.bodyParser)

server.use(function (req, res, next) {
  if (req.method === 'POST') {
    // Converts POST to GET and move payload to query params
    // This way it will make JSON Server that it's GET request
    req.method = 'GET'
    req.query = req.body
  }
  // Continue to JSON Server router
  next()
})

server.use(function (req, res, next) {
  const _send = res.send
  res.send = function (body) {

  console.log(req.method, req.url, req.query)
    if (require('url').parse(req.originalUrl, true).query['singular']) {
      try {
        const json = JSON.parse(body)
        if (Array.isArray(json)) {
          if (json.length === 1) {
            return _send.call(this, JSON.stringify(json[0]))
          } else if (json.length === 0) {
            return _send.call(this, '{}', 404)
          }
        }
      } catch (e) {}
    }
    return _send.call(this, body)
  }
  next()
})


server.use(middlewares)

server.use(router)

server.listen(port, () => {
  console.log('JSON Server is running')
})
