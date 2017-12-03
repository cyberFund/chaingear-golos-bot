const pullReqRoute = require('./pull-req-route.js')
const commitRoute = require('./commit-route.js')
const issuesRoute = require('./issues-route.js')

module.exports = (app, db) => {
  //pullReqRoute(app, db)
  commitRoute(app, db)
  //issuesRoute(app)
}
