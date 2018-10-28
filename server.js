const fs = require('fs')
const next = require('next')
const util = require('util')
const express = require('express')
const pathToRegExp = require('path-to-regexp')
const { parse } = require('url')
const routes = require('./route')
const uglifyjs = require('uglify-es')
const server = express()

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handler = routes.getRequestHandler(app)
const port = 3000

const md5 = text => require('crypto').createHash('md5').update(text).digest('hex')
const routeString = fs.readFileSync(__dirname + '/route.js', 'utf-8').split('/* ========= */')[1]

const clientSideScript = (() => {

  const doGenerateRoute = (routeString) => {
    const routes = {}
    const ret = []
    routes.add = (name, pattern, component) => {
      let keys = []
      const re = pathToRegExp(pattern, keys)
      ret.push([component, re, keys])
    }
    eval(routeString)
    return ret
  }

  const routes = doGenerateRoute(routeString)
  const code = `
    (function () {
      function match (item, path) {
        const values = item[1].exec(path)
        if (values) {
          return valuesToParams(item[2], values.slice(1))
        }
      }

      function valuesToParams (keys, values) {
        return values.reduce((params, val, i) => {
          if (val === undefined) return params
          return Object.assign(params, {
            [keys[i].name]: decodeURIComponent(val)
          })
        }, {})
      }

      var routes = ${util.inspect(routes, {depth: null})};
      for (var i = 0; i < routes.length; i++) {
        var route = routes[i];
        var a = match(route, location.pathname)
        if (a) {
          window.__NEXT_DATA__.page = '/' + route[0]
          window.__NEXT_DATA__.query = a
          console.log(window.__NEXT_DATA__.page, window.__NEXT_DATA__.query)
          return
        }
      }
      window.__NEXT_DATA__.page = '/_error'
    })();
  `
  return uglifyjs.minify(code).code
})()


const hashClientSideScript = md5(clientSideScript)
const clientSideScriptFileName = `/_next/static/client.${hashClientSideScript}.js`


app.prepare().then(() => {

  server.use((req, res, next) => {
    req.clientSideScript = clientSideScriptFileName
    next()
  })
  server.get(clientSideScriptFileName, (req, res) => {
    return res.end(clientSideScript)
  })
  server.use(handler)

  server.listen(port, (err) => {
    if (err) throw err
    console.log(`> Ready on http://localhost:${port}`) // eslint-disable-line
  })
})
