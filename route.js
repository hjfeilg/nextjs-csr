
const routes = require('next-routes')()

// DONT DELETE THIS SEPARATOR LINE!!!
/* ========= */
routes.add('home', '/', 'Home')
routes.add('page1', '/page1', 'Page1')
routes.add('page2', '/page2', 'Page2')
/* ========= */

module.exports = routes
